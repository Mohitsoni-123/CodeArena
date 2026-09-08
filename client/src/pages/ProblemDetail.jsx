import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const ProblemDetail = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  const [activeTab, setActiveTab] = useState("testcase");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [runResults, setRunResults] = useState([]);
  const [isSubmissionResult, setIsSubmissionResult] = useState(false);

  // =========================================
  // FETCH PROBLEM
  // =========================================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/problems/${id}`);

        const data = response.data;

        const problemData =
          data?.problem ||
          data?.data ||
          data;

        setProblem(problemData);

        setCode(
          problemData?.starterCode ||
            `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here

    return 0;
}`
        );
      } catch (err) {
        console.error("Fetch Problem Error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load problem."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // =========================================
  // RUN EXAMPLES
  // =========================================

  const handleRun = async () => {
    try {
      setRunning(true);
      setSubmitting(false);

      setActiveTab("output");
      setOutput("");
      setRunResults([]);
      setIsSubmissionResult(false);

      const examples = Array.isArray(problem?.example)
        ? problem.example
        : [];

      if (examples.length === 0) {
        setOutput(
          "No example test cases available."
        );

        return;
      }

      const results = [];

      // Run every example one by one
      for (
        let index = 0;
        index < examples.length;
        index++
      ) {
        const example = examples[index];

        try {
          const response = await api.post(
            "/submissions/run",
            {
              language,
              code,
              stdin: example.input,
            }
          );

          const data = response.data;

          const actualOutput = (
            data?.output || ""
          ).trim();

          const expectedOutput = (
            example?.output || ""
          ).trim();

          const passed =
            !data?.error &&
            data?.status !==
              "Compilation Error" &&
            data?.status !==
              "Runtime Error" &&
            actualOutput === expectedOutput;

          results.push({
            type: "Example",
            number: index + 1,
            input: example.input,
            expectedOutput,
            actualOutput,
            passed,

            status: data?.error
              ? data?.status ||
                "Runtime Error"
              : passed
                ? "Accepted"
                : "Wrong Answer",

            error: data?.error || "",
            isHidden: false,
          });
        } catch (err) {
          console.error(
            `Run Example ${index + 1} Error:`,
            err
          );

          const backendError =
            err?.response?.data?.error;

          let errorMessage =
            err?.response?.data?.message ||
            "Failed to run example.";

          if (
            typeof backendError ===
            "string"
          ) {
            errorMessage =
              backendError;
          } else if (
            backendError?.message
          ) {
            errorMessage =
              backendError.message;
          }

          results.push({
            type: "Example",
            number: index + 1,
            input: example.input,
            expectedOutput:
              example.output,
            actualOutput: "",
            passed: false,
            status: "Error",
            error: errorMessage,
            isHidden: false,
          });
        }

        // Show result immediately
        setRunResults([...results]);
      }

      const passedCount =
        results.filter(
          (result) => result.passed
        ).length;

      const allPassed =
        passedCount === examples.length;

      setOutput(
        allPassed
          ? `✓ All example test cases passed — ${passedCount}/${examples.length}`
          : `${passedCount}/${examples.length} example test cases passed`
      );
    } catch (err) {
      console.error(
        "Run Code Error:",
        err
      );

      setOutput(
        err?.response?.data?.message ||
          "Unable to run code."
      );
    } finally {
      setRunning(false);
    }
  };

  // =========================================
  // SUBMIT SOLUTION
  // =========================================

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setRunning(false);

      setActiveTab("output");
      setOutput("");
      setRunResults([]);
      setIsSubmissionResult(true);

      const response = await api.post(
        "/submissions",
        {
          problemId: id,
          language,
          code,
        }
      );

      const data = response.data;

      const results = Array.isArray(
        data?.testCaseResults
      )
        ? data.testCaseResults
        : [];

      setRunResults(results);

      const passed = Number(
        data?.passedTestCases || 0
      );

      const total = Number(
        data?.totalTestCases || 0
      );

      setOutput(
        data?.status === "Accepted"
          ? `✓ Accepted — ${passed}/${total} test cases passed`
          : `${data?.status || "Submission Failed"} — ${passed}/${total} test cases passed`
      );
    } catch (err) {
      console.error(
        "Submit Error:",
        err
      );

      const data =
        err?.response?.data;

      const errorMessage =
        typeof data?.error ===
        "string"
          ? data.error
          : data?.message ||
            "Unable to submit solution.";

      setOutput(errorMessage);

      setRunResults([]);

      setIsSubmissionResult(true);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================
  // DIFFICULTY STYLE
  // =========================================

  const getDifficultyStyle = (
    difficulty
  ) => {
    if (difficulty === "Easy") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (
      difficulty === "Medium"
    ) {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (
    status,
    passed
  ) => {
    if (passed || status === "Accepted") {
      return "text-emerald-400";
    }

    if (
      status === "Compilation Error"
    ) {
      return "text-amber-400";
    }

    return "text-red-400";
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-[1500px] animate-pulse">

          <div className="h-5 w-32 rounded bg-white/5" />

          <div className="mt-6 h-10 w-96 max-w-full rounded bg-white/5" />

          <div className="mt-4 h-5 w-64 rounded bg-white/5" />

          <div className="mt-8 grid gap-5 lg:grid-cols-2">

            <div className="h-[600px] rounded-3xl border border-white/10 bg-white/[0.03]" />

            <div className="h-[600px] rounded-3xl border border-white/10 bg-white/[0.03]" />

          </div>

        </div>
      </main>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error || !problem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
            ⚠
          </div>

          <h1 className="mt-5 text-xl font-black">
            Problem unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error ||
              "This problem could not be found."}
          </p>

          <Link
            to="/problems"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
          >
            ← Back to Problems
          </Link>

        </div>

      </main>
    );
  }

  // =========================================
  // CALCULATED RESULT DATA
  // =========================================

  const passedCount =
    runResults.filter(
      (result) => result.passed
    ).length;

  const totalResults =
    runResults.length;

  const allPassed =
    totalResults > 0 &&
    passedCount === totalResults;

  // =========================================
  // UI
  // =========================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ===================================== */}
      {/* TOP BAR */}
      {/* ===================================== */}

      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex min-w-0 items-center gap-3">

            <Link
              to="/problems"
              className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              ← Problems
            </Link>

            <span className="hidden h-5 w-px bg-white/10 sm:block" />

            <span className="truncate text-xs font-bold text-slate-500">
              Problem #
              {problem._id
                ? String(problem._id).slice(-4)
                : id}
            </span>

          </div>

          <div
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-[10px] font-black ${getDifficultyStyle(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* WORKSPACE */}
      {/* ===================================== */}

      <section className="mx-auto max-w-[1500px] px-3 py-3 sm:px-5 lg:px-6">

        <div className="grid min-h-[calc(100vh-145px)] gap-3 lg:grid-cols-2">

          {/* ================================= */}
          {/* LEFT PANEL */}
          {/* ================================= */}

          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">

            {/* Header */}

            <div className="border-b border-white/10 px-5 py-5 sm:px-6">

              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                {problem.title}
              </h1>

              {problem.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">

                  {problem.topics.map(
                    (topic) => (
                      <span
                        key={topic}
                        className="rounded-lg border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-[10px] font-bold text-violet-300"
                      >
                        {topic}
                      </span>
                    )
                  )}

                </div>
              )}

            </div>

            {/* Description */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">

              <section>

                <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                  Description
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">
                  {problem.description}
                </p>

              </section>

              {/* ================================= */}
              {/* EXAMPLES */}
              {/* ================================= */}

              {problem.example && (
                <section className="mt-8">

                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Examples
                  </h2>

                  <div className="mt-4 space-y-4">

                    {Array.isArray(
                      problem.example
                    ) ? (
                      problem.example.map(
                        (
                          example,
                          index
                        ) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                          >

                            <div className="border-b border-white/10 px-4 py-3 text-xs font-black text-slate-500">
                              Example{" "}
                              {index + 1}
                            </div>

                            <div className="grid gap-px bg-white/10 sm:grid-cols-2">

                              <div className="bg-slate-950/80 p-4">

                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                  Input
                                </p>

                                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                                  {
                                    example.input
                                  }
                                </pre>

                              </div>

                              <div className="bg-slate-950/80 p-4">

                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                  Output
                                </p>

                                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-emerald-400">
                                  {
                                    example.output
                                  }
                                </pre>

                              </div>

                            </div>

                            {example.explanation && (
                              <div className="border-t border-white/10 bg-slate-950/50 p-4">

                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                  Explanation
                                </p>

                                <p className="mt-2 text-xs leading-6 text-slate-500">
                                  {
                                    example.explanation
                                  }
                                </p>

                              </div>
                            )}

                          </div>
                        )
                      )
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">

                        <div className="grid gap-px bg-white/10 sm:grid-cols-2">

                          <div className="bg-slate-950/80 p-4">

                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              Input
                            </p>

                            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                              {
                                problem
                                  .example
                                  .input
                              }
                            </pre>

                          </div>

                          <div className="bg-slate-950/80 p-4">

                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              Output
                            </p>

                            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-emerald-400">
                              {
                                problem
                                  .example
                                  .output
                              }
                            </pre>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </section>
              )}

              {/* ================================= */}
              {/* CONSTRAINTS */}
              {/* ================================= */}

              {problem.constraints && (
                <section className="mt-8">

                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Constraints
                  </h2>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">

                    {Array.isArray(
                      problem.constraints
                    ) ? (
                      <ul className="space-y-2">

                        {problem.constraints.map(
                          (
                            constraint,
                            index
                          ) => (
                            <li
                              key={index}
                              className="flex gap-3 text-xs leading-6 text-slate-500"
                            >
                              <span className="text-violet-400">
                                •
                              </span>

                              <span>
                                {constraint}
                              </span>
                            </li>
                          )
                        )}

                      </ul>
                    ) : (
                      <p className="whitespace-pre-line text-xs leading-6 text-slate-500">
                        {
                          problem.constraints
                        }
                      </p>
                    )}

                  </div>

                </section>
              )}

            </div>

          </div>

          {/* ================================= */}
          {/* RIGHT PANEL */}
          {/* ================================= */}

          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">

            {/* ================================= */}
            {/* EDITOR HEADER */}
            {/* ================================= */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3">

              <div className="flex items-center gap-2">

                <span className="h-3 w-3 rounded-full bg-red-400/70" />

                <span className="h-3 w-3 rounded-full bg-yellow-400/70" />

                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />

                <span className="ml-3 font-mono text-[10px] text-slate-600">
                  solution
                </span>

              </div>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-300 outline-none transition focus:border-violet-500/40"
              >
                <option value="cpp">
                  C++
                </option>

                <option value="c">
                  C
                </option>

                <option value="python">
                  Python
                </option>

                <option value="javascript">
                  JavaScript
                </option>
              </select>

            </div>

            {/* ================================= */}
            {/* CODE EDITOR */}
            {/* ================================= */}

            <div className="min-h-[420px] flex-1 bg-[#0b1120]">

              <textarea
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                  )
                }
                spellCheck="false"
                className="h-full min-h-[420px] w-full resize-none bg-transparent p-5 font-mono text-[13px] leading-6 text-slate-300 outline-none placeholder:text-slate-700"
                placeholder="// Write your solution here..."
              />

            </div>

            {/* ================================= */}
            {/* BOTTOM PANEL */}
            {/* ================================= */}

            <div className="border-t border-white/10 bg-slate-950">

              {/* ================================= */}
              {/* TABS */}
              {/* ================================= */}

              <div className="flex items-center border-b border-white/10">

                <button
                  onClick={() =>
                    setActiveTab(
                      "testcase"
                    )
                  }
                  className={`px-5 py-3 text-xs font-bold transition ${
                    activeTab ===
                    "testcase"
                      ? "border-b-2 border-violet-500 text-violet-300"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                >
                  Test Case
                </button>

                <button
                  onClick={() =>
                    setActiveTab(
                      "output"
                    )
                  }
                  className={`px-5 py-3 text-xs font-bold transition ${
                    activeTab ===
                    "output"
                      ? "border-b-2 border-violet-500 text-violet-300"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                >
                  Output

                  {runResults.length >
                    0 && (
                    <span className="ml-2 rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-300">
                      {runResults.length}
                    </span>
                  )}

                </button>

              </div>

              {/* ================================= */}
              {/* CUSTOM INPUT */}
              {/* ================================= */}

              {activeTab ===
                "testcase" && (
                <div className="p-4">

                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Custom Input
                  </label>

                  <textarea
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                      )
                    }
                    placeholder="Enter input..."
                    className="mt-2 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs text-slate-300 outline-none transition focus:border-violet-500/40"
                  />

                </div>
              )}

              {/* ================================= */}
              {/* OUTPUT */}
              {/* ================================= */}

              {activeTab ===
                "output" && (
                <div className="max-h-[460px] overflow-y-auto">

                  <div className="p-4">

                    {/* ================================= */}
                    {/* SUMMARY */}
                    {/* ================================= */}

                    {output && (
                      <div
                        className={`mb-4 rounded-2xl border p-4 ${
                          output.includes(
                            "✓ Accepted"
                          ) ||
                          (
                            !isSubmissionResult &&
                            allPassed
                          )
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : output.includes(
                                "Wrong Answer"
                              ) ||
                              output.includes(
                                "Error"
                              ) ||
                              output.includes(
                                "Failed"
                              )
                              ? "border-red-500/20 bg-red-500/5"
                              : "border-white/10 bg-white/[0.03]"
                        }`}
                      >

                        <div className="flex items-center justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                                output.includes(
                                  "✓ Accepted"
                                ) ||
                                (
                                  !isSubmissionResult &&
                                  allPassed
                                )
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {output.includes(
                                "✓ Accepted"
                              ) ||
                              (
                                !isSubmissionResult &&
                                allPassed
                              )
                                ? "✓"
                                : "!"
                              }
                            </div>

                            <div>

                              <p
                                className={`text-sm font-black ${
                                  output.includes(
                                    "✓ Accepted"
                                  ) ||
                                  (
                                    !isSubmissionResult &&
                                    allPassed
                                  )
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {isSubmissionResult
                                  ? output.includes(
                                      "✓ Accepted"
                                    )
                                    ? "Accepted"
                                    : "Submission Result"
                                  : allPassed
                                    ? "All Examples Passed"
                                    : "Execution Result"}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                {output}
                              </p>

                            </div>

                          </div>

                          {(running ||
                            submitting) && (
                            <span className="flex shrink-0 items-center gap-2 text-[10px] text-violet-400">

                              <span className="h-3 w-3 animate-spin rounded-full border border-violet-400/30 border-t-violet-400" />

                              {running
                                ? "Running"
                                : "Judging"}

                            </span>
                          )}

                        </div>

                      </div>
                    )}

                    {/* ================================= */}
                    {/* RUNNING STATE */}
                    {/* ================================= */}

                    {running &&
                      runResults.length ===
                        0 && (
                        <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">

                          <div className="flex items-center gap-3">

                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />

                            <div>

                              <p className="text-xs font-black text-violet-300">
                                Running examples...
                              </p>

                              <p className="mt-1 text-[10px] text-slate-600">
                                Testing your solution against example test cases.
                              </p>

                            </div>

                          </div>

                        </div>
                      )}

                    {/* ================================= */}
                    {/* TEST CASE RESULTS */}
                    {/* ================================= */}

                    {runResults.length >
                      0 && (
                      <div>

                        <div className="mb-3 flex items-center justify-between">

                          <div>

                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                              {isSubmissionResult
                                ? "Test Cases"
                                : "Example Test Cases"}
                            </h3>

                            <p className="mt-1 text-[10px] text-slate-600">
                              {isSubmissionResult
                                ? "Examples and all test cases"
                                : "Example cases used for quick testing"}
                            </p>

                          </div>

                          <span
                            className={`text-[10px] font-black ${
                              allPassed
                                ? "text-emerald-400"
                                : "text-slate-500"
                            }`}
                          >
                            {passedCount}
                            {" / "}
                            {totalResults}
                            {" Passed"}
                          </span>

                        </div>

                        <div className="space-y-3">

                          {runResults.map(
                            (
                              result,
                              index
                            ) => {

                              const isExample =
                                result.type ===
                                "Example";

                              const isHidden =
                                result.isHidden ===
                                true ||
                                result.input ===
                                  "Hidden Test Case";

                              return (
                                <div
                                  key={`${result.type}-${result.number}-${index}`}
                                  className={`overflow-hidden rounded-xl border ${
                                    result.passed
                                      ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                                      : "border-red-500/20 bg-red-500/[0.04]"
                                  }`}
                                >

                                  {/* ================================= */}
                                  {/* RESULT HEADER */}
                                  {/* ================================= */}

                                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">

                                    <div className="flex min-w-0 items-center gap-2">

                                      <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
                                          result.passed
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}
                                      >
                                        {result.passed
                                          ? "✓"
                                          : "!"}
                                      </span>

                                      <span className="truncate text-xs font-black text-slate-300">

                                        {isExample
                                          ? `Example ${result.number}`
                                          : `Test Case ${result.number}`}

                                      </span>

                                      {/* TYPE BADGE */}

                                      {isExample ? (
                                        <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[8px] font-black text-violet-300">
                                          EXAMPLE
                                        </span>
                                      ) : isHidden ? (
                                        <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[8px] font-black text-amber-300">
                                          HIDDEN
                                        </span>
                                      ) : (
                                        <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[8px] font-black text-slate-500">
                                          TEST
                                        </span>
                                      )}

                                    </div>

                                    <span
                                      className={`shrink-0 text-[10px] font-black ${getStatusStyle(
                                        result.status,
                                        result.passed
                                      )}`}
                                    >
                                      {result.passed
                                        ? "Passed"
                                        : result.status ||
                                          "Failed"}
                                    </span>

                                  </div>

                                  {/* ================================= */}
                                  {/* HIDDEN CASE */}
                                  {/* ================================= */}

                                  {isHidden ? (
                                    <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-5">

                                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-lg">
                                        🔒
                                      </div>

                                      <div className="min-w-0">

                                        <p className="text-xs font-bold text-slate-300">
                                          Hidden Test Case
                                        </p>

                                        <p className="mt-1 text-[10px] leading-5 text-slate-600">
                                          Test data is hidden to prevent solutions from being hardcoded.
                                        </p>

                                      </div>

                                    </div>
                                  ) : (
                                    /* ================================= */
                                    /* PUBLIC CASE */
                                    /* ================================= */

                                    <div className="grid gap-px bg-white/10 sm:grid-cols-3">

                                      {/* INPUT */}

                                      <div className="bg-slate-950/80 p-3">

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                                          Input
                                        </p>

                                        <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 text-slate-400">
                                          {result.input ||
                                            "No input"}
                                        </pre>

                                      </div>

                                      {/* EXPECTED */}

                                      <div className="bg-slate-950/80 p-3">

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                                          Expected
                                        </p>

                                        <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 text-slate-400">
                                          {result.expectedOutput ||
                                            "No expected output"}
                                        </pre>

                                      </div>

                                      {/* ACTUAL */}

                                      <div className="bg-slate-950/80 p-3">

                                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                                          Your Output
                                        </p>

                                        <pre
                                          className={`mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 ${
                                            result.passed
                                              ? "text-emerald-400"
                                              : "text-red-400"
                                          }`}
                                        >
                                          {result.actualOutput ||
                                            "No output"}
                                        </pre>

                                      </div>

                                    </div>
                                  )}

                                  {/* ================================= */}
                                  {/* ERROR */}
                                  {/* ================================= */}

                                  {result.error && (
                                    <div className="border-t border-red-500/10 bg-red-500/5 px-4 py-3">

                                      <p className="text-[9px] font-black uppercase tracking-wider text-red-400">
                                        Error
                                      </p>

                                      <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-5 text-red-300">
                                        {typeof result.error ===
                                        "string"
                                          ? result.error
                                          : JSON.stringify(
                                              result.error
                                            )}
                                      </pre>

                                    </div>
                                  )}

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>
                    )}

                    {/* ================================= */}
                    {/* EMPTY OUTPUT */}
                    {/* ================================= */}

                    {!running &&
                      !submitting &&
                      runResults.length ===
                        0 && (
                        <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-white/10 bg-black/20">

                          <div className="text-center">

                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm">
                              ▶
                            </div>

                            <p className="mt-3 text-xs font-bold text-slate-500">
                              No execution results
                            </p>

                            <p className="mt-1 text-[10px] text-slate-700">
                              Run your code to test the examples.
                            </p>

                          </div>

                        </div>
                      )}

                  </div>

                </div>
              )}

              {/* ================================= */}
              {/* ACTIONS */}
              {/* ================================= */}

              <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">

                <span className="hidden text-[10px] text-slate-700 sm:block">
                  Run examples before submitting
                </span>

                <div className="ml-auto flex gap-2">

                  <button
                    onClick={handleRun}
                    disabled={
                      running ||
                      submitting
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {running
                      ? "Running..."
                      : "▶ Run"}
                  </button>

                  <button
                    onClick={
                      handleSubmit
                    }
                    disabled={
                      running ||
                      submitting
                    }
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting
                      ? "Submitting..."
                      : "Submit →"}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
};

export default ProblemDetail;
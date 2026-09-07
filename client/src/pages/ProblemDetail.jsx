import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function ProblemDetail() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [runResults, setRunResults] = useState([]);
  const [stdin, setStdin] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/problems/${id}`);

        setProblem(response.data.problem);
        setCode(response.data.problem.starterCode || "");
      } catch (error) {
        console.error("Fetch Problem Error:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch problem"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRunCode = async () => {
    try {
      setRunning(true);
      setOutput("");
      setSubmissionResult(null);
      setRunResults([]);

      const examples = problem?.example || [];

      if (examples.length > 0) {
        const results = [];

        for (let index = 0; index < examples.length; index++) {
          const example = examples[index];

          try {
            const response = await api.post("/submissions/run", {
              language,
              code,
              stdin: example.input,
            });

            const data = response.data;

            const actualOutput = (data.output || "").trim();
            const expectedOutput = (example.output || "").trim();

            const passed =
              !data.error && actualOutput === expectedOutput;

            results.push({
              index,
              input: example.input,
              expectedOutput,
              actualOutput,
              passed,
              status: data.error
                ? data.status || "Error"
                : passed
                  ? "Accepted"
                  : "Wrong Answer",
              error: data.error || "",
            });
          } catch (error) {
            const backendError =
              error.response?.data?.error;

            let errorMessage = "Failed to run example";

            if (typeof backendError === "string") {
              errorMessage = backendError;
            } else if (backendError?.message) {
              errorMessage = backendError.message;
            } else if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            }

            results.push({
              index,
              input: example.input,
              expectedOutput: example.output,
              actualOutput: "",
              passed: false,
              status: "Error",
              error: errorMessage,
            });
          }
        }

        setRunResults(results);
      }

      if (stdin.trim()) {
        const response = await api.post("/submissions/run", {
          language,
          code,
          stdin,
        });

        const data = response.data;

        if (data.error) {
          setOutput(
            `${data.status || "Execution Error"}\n\n${
              typeof data.error === "string"
                ? data.error
                : data.error.message || "Execution failed"
            }`
          );
        } else {
          setOutput(data.output || "No output");
        }
      }
    } catch (error) {
      console.error("Run Code Error:", error);

      const backendError =
        error.response?.data?.error;

      if (typeof backendError === "string") {
        setOutput(backendError);
      } else if (backendError?.message) {
        setOutput(backendError.message);
      } else {
        setOutput(
          error.response?.data?.message ||
            "Failed to run code"
        );
      }
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmissionResult(null);

      const response = await api.post("/submissions", {
        problemId: problem._id,
        language,
        code,
      });

      setSubmissionResult(response.data);
    } catch (error) {
      console.error("Submit Error:", error);

      const backendError =
        error.response?.data?.error;

      let errorMessage = "Failed to submit solution";

      if (typeof backendError === "string") {
        errorMessage = backendError;
      } else if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmissionResult({
        status:
          error.response?.data?.status ||
          "Submission Failed",
        error: errorMessage,
        passedTestCases:
          error.response?.data?.passedTestCases || 0,
        totalTestCases:
          error.response?.data?.totalTestCases || 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyClasses = (difficulty) => {
    if (difficulty === "Easy") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (difficulty === "Medium") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Accepted":
        return "text-emerald-400";

      case "Wrong Answer":
        return "text-red-400";

      case "Compilation Error":
        return "text-amber-400";

      case "Runtime Error":
        return "text-red-400";

      case "Time Limit Exceeded":
        return "text-orange-400";

      default:
        return "text-slate-400";
    }
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200" />

          <div className="mt-5 h-10 w-96 max-w-full rounded-lg bg-slate-200" />

          <div className="mt-4 flex gap-3">
            <div className="h-8 w-20 rounded-full bg-slate-200" />
            <div className="h-8 w-24 rounded-full bg-slate-200" />
            <div className="h-8 w-24 rounded-full bg-slate-200" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="h-[650px] rounded-3xl bg-white" />
            <div className="h-[650px] rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            Unable to load problem
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="text-5xl">🔍</div>

          <h2 className="mt-4 text-2xl font-black text-slate-900">
            Problem not found
          </h2>

          <Link
            to="/problems"
            className="mt-5 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
          >
            ← Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const passedRunCases = runResults.filter(
    (result) => result.passed
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ============================
            HEADER
        ============================ */}

        <div className="mb-6">

          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to Problems
          </Link>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black tracking-wider text-blue-700">
                  <span>⚡</span>
                  CODING CHALLENGE
                </div>

                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {problem.title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2">

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getDifficultyClasses(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>

                  {problem.topics?.map((topic, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden shrink-0 rounded-2xl bg-slate-50 px-5 py-4 text-center sm:block">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Challenge
                </p>

                <p className="mt-1 text-xl font-black text-slate-900">
                  #{String(id).slice(-6)}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ============================
            WORKSPACE
        ============================ */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

          {/* ==================================
              LEFT — PROBLEM
          ================================== */}

          <div className="min-w-0 space-y-5">

            {/* DESCRIPTION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                  📝
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Description
                  </h2>

                  <p className="text-xs text-slate-400">
                    Understand the problem
                  </p>
                </div>
              </div>

              <div className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {problem.description}
              </div>
            </section>

            {/* CONSTRAINTS */}

            {problem.constraints?.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg">
                    📌
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Constraints
                    </h2>

                    <p className="text-xs text-slate-400">
                      Conditions to keep in mind
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3">
                  {problem.constraints.map(
                    (constraint, index) => (
                      <li
                        key={index}
                        className="flex gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <span>{constraint}</span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            )}

            {/* EXAMPLES */}

            {problem.example?.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                    💡
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Examples
                    </h2>

                    <p className="text-xs text-slate-400">
                      Sample inputs and outputs
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">

                  {problem.example.map(
                    (example, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-2xl border border-slate-200"
                      >

                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                          <span className="text-sm font-black text-slate-800">
                            Example {index + 1}
                          </span>
                        </div>

                        <div className="space-y-4 p-4">

                          <div>
                            <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                              Input
                            </p>

                            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-slate-200">
                              {example.input}
                            </pre>
                          </div>

                          <div>
                            <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                              Output
                            </p>

                            <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-6 text-emerald-300">
                              {example.output}
                            </pre>
                          </div>

                          {example.explanation && (
                            <div>
                              <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">
                                Explanation
                              </p>

                              <p className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-600">
                                {example.explanation}
                              </p>
                            </div>
                          )}

                        </div>
                      </div>
                    )
                  )}

                </div>
              </section>
            )}
          </div>

          {/* ==================================
              RIGHT — EDITOR
          ================================== */}

          <div className="min-w-0">

            <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#0b1120] shadow-xl">

              {/* EDITOR HEADER */}

              <div className="flex flex-col gap-3 border-b border-slate-700 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>

                  <span className="text-sm font-bold text-white">
                    Code Editor
                  </span>
                </div>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-bold text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                >
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="python">Python</option>
                  <option value="javascript">
                    JavaScript
                  </option>
                </select>
              </div>

              {/* CODE EDITOR */}

              <div className="p-3 sm:p-4">

                <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#080d18]">

                  <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5">
                    <span className="text-xs font-semibold text-slate-500">
                      {language === "cpp"
                        ? "solution.cpp"
                        : language === "c"
                          ? "solution.c"
                          : language === "python"
                            ? "solution.py"
                            : "solution.js"}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Editable
                    </span>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value)
                    }
                    spellCheck="false"
                    className="h-[420px] w-full resize-none overflow-auto bg-transparent p-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 sm:h-[500px]"
                    placeholder="// Write your solution here..."
                  />
                </div>

                {/* CUSTOM INPUT */}

                <div className="mt-4">

                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">
                        Custom Input
                      </p>

                      <p className="text-xs text-slate-500">
                        Test your solution with your own input
                      </p>
                    </div>

                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">
                      Optional
                    </span>
                  </div>

                  <textarea
                    value={stdin}
                    onChange={(e) =>
                      setStdin(e.target.value)
                    }
                    rows={4}
                    spellCheck="false"
                    placeholder="Enter input here..."
                    className="w-full resize-y rounded-2xl border border-slate-700 bg-[#080d18] p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* ACTIONS */}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <button
                    onClick={handleRunCode}
                    disabled={running || submitting}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 text-sm font-black text-white transition hover:border-blue-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {running ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
                        Running...
                      </>
                    ) : (
                      <>
                        ▶
                        Run Code
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || running}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Solution
                        →
                      </>
                    )}
                  </button>

                </div>
              </div>

              {/* ============================
                  RUN RESULTS
              ============================ */}

              {runResults.length > 0 && (
                <div className="border-t border-slate-700 bg-[#080d18] p-4 sm:p-5">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 className="font-black text-white">
                        Run Code Results
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Results from visible examples
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                        passedRunCases === runResults.length
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {passedRunCases} /{" "}
                      {runResults.length} Passed
                    </span>

                  </div>

                  <div className="mt-5 space-y-3">

                    {runResults.map((result) => (
                      <div
                        key={result.index}
                        className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
                      >

                        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">

                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                result.passed
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {result.passed
                                ? "✓"
                                : "✕"}
                            </span>

                            <span className="text-sm font-bold text-white">
                              Example{" "}
                              {result.index + 1}
                            </span>
                          </div>

                          <span
                            className={`text-xs font-bold ${getStatusClasses(
                              result.status
                            )}`}
                          >
                            {result.status}
                          </span>

                        </div>

                        <div className="grid gap-4 p-4 md:grid-cols-3">

                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Input
                            </p>

                            <pre className="min-h-16 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#080d18] p-3 font-mono text-xs leading-5 text-slate-300">
                              {result.input || "(empty)"}
                            </pre>
                          </div>

                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Expected
                            </p>

                            <pre className="min-h-16 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#080d18] p-3 font-mono text-xs leading-5 text-emerald-300">
                              {result.expectedOutput ||
                                "(empty)"}
                            </pre>
                          </div>

                          <div>
                            <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Your Output
                            </p>

                            <pre className="min-h-16 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[#080d18] p-3 font-mono text-xs leading-5 text-slate-300">
                              {result.actualOutput ||
                                "(empty)"}
                            </pre>
                          </div>

                        </div>

                        {result.error && (
                          <div className="mx-4 mb-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                            <p className="mb-2 text-xs font-bold text-red-400">
                              Error
                            </p>

                            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-red-300">
                              {result.error}
                            </pre>
                          </div>
                        )}

                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* ============================
                  CUSTOM OUTPUT
              ============================ */}

              {output && (
                <div className="border-t border-slate-700 bg-[#080d18] p-4 sm:p-5">

                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-white">
                        Custom Input Output
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Output generated by your code
                      </p>
                    </div>

                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-400">
                      Output
                    </span>
                  </div>

                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl border border-slate-700 bg-slate-900 p-4 font-mono text-sm leading-6 text-slate-200">
                    {output}
                  </pre>
                </div>
              )}

              {/* ============================
                  SUBMISSION RESULT
              ============================ */}

              {submissionResult && (
                <div className="border-t border-slate-700 bg-[#080d18] p-4 sm:p-5">

                  <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">

                    {/* RESULT HEADER */}

                    <div className="flex flex-col gap-4 border-b border-slate-700 p-5 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Submission Result
                        </p>

                        <p
                          className={`mt-1 text-2xl font-black ${getStatusClasses(
                            submissionResult.status
                          )}`}
                        >
                          {submissionResult.status ||
                            "Unknown"}
                        </p>
                      </div>

                      {submissionResult.passedTestCases !==
                        undefined && (
                        <div className="rounded-xl bg-slate-800 px-5 py-3">
                          <p className="text-xs font-bold text-slate-500">
                            TEST CASES
                          </p>

                          <p className="mt-1 text-lg font-black text-white">
                            {
                              submissionResult.passedTestCases
                            }{" "}
                            /{" "}
                            {
                              submissionResult.totalTestCases
                            }
                          </p>
                        </div>
                      )}

                    </div>

                    {/* ERROR */}

                    {submissionResult.error && (
                      <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                        <p className="mb-2 text-xs font-black uppercase tracking-wider text-red-400">
                          Error
                        </p>

                        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-red-300">
                          {submissionResult.error}
                        </pre>

                      </div>
                    )}

                    {/* TEST CASES */}

                    {submissionResult.testCaseResults?.length >
                      0 && (
                      <div className="p-5 pt-0">

                        <h4 className="mb-3 text-sm font-black text-white">
                          Test Case Results
                        </h4>

                        <div className="space-y-2">

                          {submissionResult.testCaseResults.map(
                            (testCase, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
                              >
                                <div className="flex items-center gap-3">

                                  <span
                                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                                      testCase.passed
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-red-500/10 text-red-400"
                                    }`}
                                  >
                                    {testCase.passed
                                      ? "✓"
                                      : "✕"}
                                  </span>

                                  <span className="text-sm font-semibold text-slate-200">
                                    Test Case{" "}
                                    {index + 1}
                                  </span>

                                </div>

                                <span
                                  className={`text-xs font-bold ${
                                    testCase.passed
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {testCase.passed
                                    ? "Passed"
                                    : "Failed"}
                                </span>

                              </div>
                            )
                          )}

                        </div>
                      </div>
                    )}

                    {/* RUNTIME / MEMORY */}

                    {(submissionResult.runtime !==
                      undefined ||
                      submissionResult.memory !==
                        undefined) && (
                      <div className="grid grid-cols-2 gap-3 border-t border-slate-700 p-5">

                        {submissionResult.runtime !==
                          undefined && (
                          <div className="rounded-xl bg-slate-800 p-4">
                            <p className="text-xs font-bold text-slate-500">
                              RUNTIME
                            </p>

                            <p className="mt-1 font-black text-white">
                              {submissionResult.runtime ||
                                0}
                            </p>
                          </div>
                        )}

                        {submissionResult.memory !==
                          undefined && (
                          <div className="rounded-xl bg-slate-800 p-4">
                            <p className="text-xs font-bold text-slate-500">
                              MEMORY
                            </p>

                            <p className="mt-1 font-black text-white">
                              {submissionResult.memory ||
                                0}
                            </p>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
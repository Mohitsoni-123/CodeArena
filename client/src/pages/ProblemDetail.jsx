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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/problems/${id}`);

        const data = response.data;

        const problemData = data?.problem || data?.data || data;

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

  const handleRun = async () => {
    try {
      setRunning(true);
      setActiveTab("output");
      setOutput("Running your code...");

      const response = await api.post("/submissions/run", {
        problemId: id,
        language,
        code,
        input,
      });

      const data = response.data;

      setOutput(
        data?.output ||
          data?.result ||
          data?.message ||
          "Code executed successfully."
      );
    } catch (err) {
      setOutput(
        err?.response?.data?.message ||
          "Unable to run code."
      );
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setActiveTab("output");
      setOutput("Submitting your solution...");

      const response = await api.post("/submissions", {
        problemId: id,
        language,
        code,
      });

      const data = response.data;

      setOutput(
        data?.message ||
          data?.submission?.status ||
          "Submission completed."
      );
    } catch (err) {
      setOutput(
        err?.response?.data?.message ||
          "Unable to submit solution."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyStyle = (difficulty) => {
    if (difficulty === "Easy") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (difficulty === "Medium") {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  };

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
            {error || "This problem could not be found."}
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================= TOP BAR ================= */}

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
              Problem #{problem._id ? String(problem._id).slice(-4) : id}
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

      {/* ================= WORKSPACE ================= */}

      <section className="mx-auto max-w-[1500px] px-3 py-3 sm:px-5 lg:px-6">

        <div className="grid min-h-[calc(100vh-145px)] gap-3 lg:grid-cols-2">

          {/* ================= LEFT ================= */}

          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">

            {/* Problem Header */}

            <div className="border-b border-white/10 px-5 py-5 sm:px-6">

              <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                {problem.title}
              </h1>

              {problem.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {problem.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg border border-violet-500/10 bg-violet-500/5 px-2.5 py-1 text-[10px] font-bold text-violet-300"
                    >
                      {topic}
                    </span>
                  ))}
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

              {/* Examples */}

              {problem.example && (
                <section className="mt-8">

                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Examples
                  </h2>

                  <div className="mt-4 space-y-4">

                    {Array.isArray(problem.example) ? (
                      problem.example.map((example, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                        >
                          <div className="border-b border-white/10 px-4 py-3 text-xs font-black text-slate-500">
                            Example {index + 1}
                          </div>

                          <div className="grid gap-px bg-white/10 sm:grid-cols-2">

                            <div className="bg-slate-950/80 p-4">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Input
                              </p>

                              <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                                {example.input}
                              </pre>
                            </div>

                            <div className="bg-slate-950/80 p-4">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Output
                              </p>

                              <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-emerald-400">
                                {example.output}
                              </pre>
                            </div>

                          </div>

                          {example.explanation && (
                            <div className="border-t border-white/10 bg-slate-950/50 p-4">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                Explanation
                              </p>

                              <p className="mt-2 text-xs leading-6 text-slate-500">
                                {example.explanation}
                              </p>
                            </div>
                          )}

                        </div>
                      ))
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">

                        <div className="grid gap-px bg-white/10 sm:grid-cols-2">

                          <div className="bg-slate-950/80 p-4">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              Input
                            </p>

                            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">
                              {problem.example.input}
                            </pre>
                          </div>

                          <div className="bg-slate-950/80 p-4">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              Output
                            </p>

                            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-emerald-400">
                              {problem.example.output}
                            </pre>
                          </div>

                        </div>

                        {problem.example.explanation && (
                          <div className="border-t border-white/10 p-4">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                              Explanation
                            </p>

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                              {problem.example.explanation}
                            </p>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </section>
              )}

              {/* Constraints */}

              {problem.constraints && (
                <section className="mt-8">

                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Constraints
                  </h2>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">

                    {Array.isArray(problem.constraints) ? (
                      <ul className="space-y-2">
                        {problem.constraints.map((constraint, index) => (
                          <li
                            key={index}
                            className="flex gap-3 text-xs leading-6 text-slate-500"
                          >
                            <span className="text-violet-400">
                              •
                            </span>
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-line text-xs leading-6 text-slate-500">
                        {problem.constraints}
                      </p>
                    )}

                  </div>
                </section>
              )}

            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">

            {/* Editor Header */}

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
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-300 outline-none transition focus:border-violet-500/40"
              >
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>

            </div>

            {/* Editor */}

            <div className="min-h-[420px] flex-1 bg-[#0b1120]">

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="h-full min-h-[420px] w-full resize-none bg-transparent p-5 font-mono text-[13px] leading-6 text-slate-300 outline-none placeholder:text-slate-700"
                placeholder="// Write your solution here..."
              />

            </div>

            {/* Bottom Panel */}

            <div className="border-t border-white/10 bg-slate-950">

              {/* Tabs */}

              <div className="flex items-center border-b border-white/10">

                <button
                  onClick={() => setActiveTab("testcase")}
                  className={`px-5 py-3 text-xs font-bold transition ${
                    activeTab === "testcase"
                      ? "border-b-2 border-violet-500 text-violet-300"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                >
                  Test Case
                </button>

                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-5 py-3 text-xs font-bold transition ${
                    activeTab === "output"
                      ? "border-b-2 border-violet-500 text-violet-300"
                      : "text-slate-600 hover:text-slate-300"
                  }`}
                >
                  Output
                </button>

              </div>

              {/* Test Case */}

              {activeTab === "testcase" && (
                <div className="p-4">

                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Custom Input
                  </label>

                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter input..."
                    className="mt-2 h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-3 font-mono text-xs text-slate-300 outline-none transition focus:border-violet-500/40"
                  />

                </div>
              )}

              {/* Output */}

              {activeTab === "output" && (
                <div className="min-h-[145px] p-4">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Execution Output
                    </span>

                    {running && (
                      <span className="flex items-center gap-2 text-[10px] text-violet-400">
                        <span className="h-3 w-3 animate-spin rounded-full border border-violet-400/30 border-t-violet-400" />
                        Running
                      </span>
                    )}

                  </div>

                  <pre className="min-h-[90px] whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs leading-6 text-slate-400">
                    {output || "Run your code to see the output here."}
                  </pre>

                </div>
              )}

              {/* Actions */}

              <div className="flex items-center justify-between gap-3 border-t border-white/10 p-4">

                <span className="hidden text-[10px] text-slate-700 sm:block">
                  Ctrl + Enter to run
                </span>

                <div className="ml-auto flex gap-2">

                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {running ? "Running..." : "▶ Run"}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting}
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
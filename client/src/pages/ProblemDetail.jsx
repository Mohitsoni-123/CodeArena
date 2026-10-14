import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Copy,
  Lock,
  MemoryStick,
  Play,
  RotateCcw,
  Rocket,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import api from "../services/api";

// --------------------------------------------------
// STARTER CODE
// --------------------------------------------------

const CPP_STARTER = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`;

const STARTERS = {
  cpp: CPP_STARTER,
  c: `#include <stdio.h>

int main() {
    // Write your code here
    return 0;
}`,
  python: `# Write your code here
`,
  javascript: `// Write your code here
`,
};

const getStarter = (problem, lang) =>
  lang === "cpp" && problem?.starterCode
    ? problem.starterCode
    : STARTERS[lang] || "";

// --------------------------------------------------
// SYNTAX HIGHLIGHTING
// --------------------------------------------------

const KEYWORDS = {
  cpp: "if else for while do return break continue class struct public private protected using namespace new delete const static template typename switch case default try catch throw true false nullptr auto this virtual override inline",
  c: "if else for while do return break continue struct const static switch case default typedef enum sizeof NULL",
  python:
    "def class if elif else for while return break continue import from as in is not and or pass lambda try except finally with yield True False None",
  javascript:
    "function const let var if else for while do return break continue class new this switch case default try catch throw import export from async await true false null undefined of in",
};

const TYPES = {
  cpp: "int long short char bool void float double unsigned signed string vector map set unordered_map unordered_set pair queue stack deque priority_queue size_t",
  c: "int long short char void float double unsigned signed size_t",
  python: "int str list dict set tuple float bool",
  javascript: "Array Object Map Set Promise Number String Boolean",
};

const toSet = (str) => new Set(str.split(" "));

const tokenColors = {
  comment: "italic text-[#6a9955]",
  pre: "text-[#c586c0]",
  string: "text-[#ce9178]",
  number: "text-[#b5cea8]",
  keyword: "text-[#569cd6]",
  type: "text-[#4ec9b0]",
  fn: "text-[#dcdcaa]",
};

const highlightCode = (code, lang) => {
  const keywords = toSet(KEYWORDS[lang] || "");
  const types = toSet(TYPES[lang] || "");
  const isPy = lang === "python";
  const isC = lang === "cpp" || lang === "c";

  const comment = isPy ? "#[^\\n]*" : "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/";
  const pre = isC ? "^[ \\t]*#[^\\n]*" : "(?!)";

  const regex = new RegExp(
    `(${comment})|(${pre})|("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*')|(\\b\\d+(?:\\.\\d+)?\\b)|(\\b[A-Za-z_]\\w*\\b)`,
    "gm"
  );

  const nodes = [];
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > last) nodes.push(code.slice(last, match.index));

    const [text, cmt, prep, str, num, word] = match;
    let cls = "";

    if (cmt) cls = tokenColors.comment;
    else if (prep) cls = tokenColors.pre;
    else if (str) cls = tokenColors.string;
    else if (num) cls = tokenColors.number;
    else if (word) {
      if (keywords.has(word)) cls = tokenColors.keyword;
      else if (types.has(word)) cls = tokenColors.type;
      else if (code[match.index + text.length] === "(")
        cls = tokenColors.fn;
    }

    nodes.push(
      cls ? (
        <span key={key++} className={cls}>
          {text}
        </span>
      ) : (
        text
      )
    );

    last = match.index + text.length;
    if (text.length === 0) regex.lastIndex++;
  }

  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [resultTab, setResultTab] = useState("output");

  const [runResults, setRunResults] = useState([]);
  const [summary, setSummary] = useState(null);

  const [copied, setCopied] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const gutterRef = useRef(null);
  const preRef = useRef(null);

  // --------------------------------------------------
  // FETCH PROBLEM
  // --------------------------------------------------

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/problems/${id}`);

        const data = response.data?.problem || response.data;

        setProblem(data);
        setCode(getStarter(data, "cpp"));
      } catch (error) {
        console.error("Failed to fetch problem:", error);

        if (error.response?.status === 404) {
          navigate("/problems");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, navigate]);

  // --------------------------------------------------
  // LANGUAGE DATA
  // --------------------------------------------------

  const languages = [
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
    { value: "python", label: "Python" },
    { value: "javascript", label: "JavaScript" },
  ];

  const selectedLanguage =
    languages.find((item) => item.value === language) || languages[0];

  // --------------------------------------------------
  // DIFFICULTY
  // --------------------------------------------------

  const difficultyConfig = {
    Easy: {
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      dot: "bg-emerald-400",
    },
    Medium: {
      text: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20",
      dot: "bg-amber-400",
    },
    Hard: {
      text: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/20",
      dot: "bg-rose-400",
    },
  };

  const difficulty =
    difficultyConfig[problem?.difficulty] || difficultyConfig.Easy;

  // --------------------------------------------------
  // EDITOR HANDLERS
  // --------------------------------------------------

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleResetCode = () => {
    if (!problem) return;
    setCode(getStarter(problem, language));
  };

  const handleLanguageChange = (nextLang) => {
    // If the user has not edited the code, swap in the new language's starter
    if (code === getStarter(problem, language)) {
      setCode(getStarter(problem, nextLang));
    }

    setLanguage(nextLang);
    setShowLanguageMenu(false);
  };

  const handleEditorScroll = (e) => {
    const { scrollTop, scrollLeft } = e.target;

    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;

    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
  };

  const handleEditorKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const { selectionStart, selectionEnd } = e.target;
      const target = e.target;

      const next =
        code.slice(0, selectionStart) + "    " + code.slice(selectionEnd);

      setCode(next);

      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 4;
      });
    }
  };

  const lineCount = code.split("\n").length;

  // --------------------------------------------------
  // RUN EXAMPLES
  // --------------------------------------------------

  const handleRun = async () => {
    if (!problem || !code.trim()) return;

    try {
      setRunning(true);
      setSummary(null);
      setRunResults([]);
      setResultTab("output");
      setActiveTab("description");

      const examples = Array.isArray(problem.example)
        ? problem.example
        : [];

      if (examples.length === 0) {
        setSummary({
          mode: "run",
          status: "No Examples",
          passed: 0,
          total: 0,
        });

        return;
      }

      const results = [];

      for (let index = 0; index < examples.length; index++) {
        const example = examples[index];

        try {
          const response = await api.post("/submissions/run", {
            language,
            code,
            stdin: example.input || "",
          });

          const data = response.data;

          const actualOutput = (data.output || "").trim();
          const expectedOutput = (example.output || "").trim();

          const passed =
            data.status === "Accepted" && actualOutput === expectedOutput;

          results.push({
            type: "Example",
            number: index + 1,
            input: example.input || "",
            expectedOutput: example.output || "",
            actualOutput: data.output || "",
            passed,
            status: passed ? "Accepted" : data.status || "Wrong Answer",
            error: data.error || "",
          });
        } catch (error) {
          results.push({
            type: "Example",
            number: index + 1,
            input: example.input || "",
            expectedOutput: example.output || "",
            actualOutput: "",
            passed: false,
            status: error.response?.data?.message || "Runtime Error",
            error:
              error.response?.data?.error ||
              error.message ||
              "Execution failed.",
          });
        }

        setRunResults([...results]);
      }

      const passedCount = results.filter((item) => item.passed).length;

      setSummary({
        mode: "run",
        status: passedCount === examples.length ? "Accepted" : "Wrong Answer",
        passed: passedCount,
        total: examples.length,
      });
    } catch (error) {
      console.error("Run error:", error);

      setSummary({
        mode: "run",
        status: "Runtime Error",
        passed: 0,
        total: 0,
      });
    } finally {
      setRunning(false);
    }
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (!problem || !code.trim()) return;

    try {
      setSubmitting(true);
      setSummary(null);
      setRunResults([]);
      setResultTab("output");

      const response = await api.post("/submissions", {
        problemId: id,
        language,
        code,
      });

      const data = response.data;

      const results = Array.isArray(data.testCaseResults)
        ? data.testCaseResults
        : [];

      setRunResults(results);

      setSummary({
        mode: "submit",
        status: data.status || "Pending",
        passed: data.passedTestCases || 0,
        total: data.totalTestCases || results.length,
        runtime: data.runtime || 0,
        memory: data.memory || 0,
      });
    } catch (error) {
      console.error("Submission error:", error);

      setSummary({
        mode: "submit",
        status: error.response?.data?.message || "Submission Failed",
        passed: 0,
        total: 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // RESULT STATUS CONFIG
  // --------------------------------------------------

  const getStatusConfig = (result) => {
    if (result.passed || result.status === "Accepted") {
      return {
        label: "Passed",
        icon: Check,
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/20",
        iconBg: "bg-emerald-400/15",
      };
    }

    if (result.status === "Wrong Answer") {
      return {
        label: "Wrong Answer",
        icon: X,
        text: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-400/20",
        iconBg: "bg-rose-400/15",
      };
    }

    if (result.status === "Compilation Error") {
      return {
        label: "Compilation Error",
        icon: CircleAlert,
        text: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        iconBg: "bg-orange-400/15",
      };
    }

    if (result.status === "Runtime Error") {
      return {
        label: "Runtime Error",
        icon: CircleAlert,
        text: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/20",
        iconBg: "bg-red-400/15",
      };
    }

    if (result.status === "Time Limit Exceeded") {
      return {
        label: "Time Limit Exceeded",
        icon: Clock3,
        text: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
        iconBg: "bg-yellow-400/15",
      };
    }

    if (result.status === "Not Run") {
      return {
        label: "Not Run",
        icon: Clock3,
        text: "text-slate-400",
        bg: "bg-slate-400/10",
        border: "border-slate-400/20",
        iconBg: "bg-slate-400/15",
      };
    }

    return {
      label: result.status || "Pending",
      icon: Clock3,
      text: "text-slate-400",
      bg: "bg-slate-400/10",
      border: "border-slate-400/20",
      iconBg: "bg-slate-400/15",
    };
  };

  // --------------------------------------------------
  // RESULT COUNTS
  // --------------------------------------------------

  const resultStats = useMemo(() => {
    const total = runResults.length;

    const passed = runResults.filter(
      (item) => item.passed || item.status === "Accepted"
    ).length;

    const failed = runResults.filter(
      (item) =>
        !item.passed && item.status !== "Not Run" && item.status !== "Pending"
    ).length;

    return { total, passed, failed };
  }, [runResults]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b12] text-white">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-40 rounded-lg bg-white/5" />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[650px] rounded-2xl bg-white/5" />
              <div className="h-[650px] rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return null;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#070b12] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-[1700px] px-3 py-4 sm:px-5 lg:px-7">
        {/* ------------------------------------------------ */}
        {/* TOP BAR */}
        {/* ------------------------------------------------ */}

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#0b111b]/90 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Link
            to="/problems"
            className="group flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition group-hover:-translate-x-1"
            />
            <span>All Problems</span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-xs text-slate-400">
              <Code2 size={14} />
              Coding Arena
            </div>

            <div className="h-4 w-px bg-white/10" />

            <span className="text-xs text-slate-500">Problem #{id}</span>
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* MAIN GRID */}
        {/* ------------------------------------------------ */}

        <div className="grid min-h-[calc(100vh-145px)] gap-4 lg:grid-cols-[minmax(380px,0.92fr)_minmax(520px,1.08fr)]">
          {/* ================================================= */}
          {/* LEFT - PROBLEM */}
          {/* ================================================= */}

          <section className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b111b] shadow-2xl shadow-black/20">
            {/* Problem Header */}

            <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${difficulty.bg} ${difficulty.border} ${difficulty.text}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${difficulty.dot}`}
                  />
                  {problem.difficulty}
                </span>

                {problem.topics?.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs text-slate-400"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {problem.title}
              </h1>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Sparkles size={13} className="text-indigo-400" />
                Master this problem and improve your problem-solving skills.
              </div>
            </div>

            {/* Problem Tabs */}

            <div className="flex border-b border-white/[0.07] px-5 sm:px-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`relative px-1 py-3.5 text-sm font-medium transition ${
                  activeTab === "description"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Description

                {activeTab === "description" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("examples")}
                className={`relative ml-6 px-1 py-3.5 text-sm font-medium transition ${
                  activeTab === "examples"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Examples

                {activeTab === "examples" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-500" />
                )}
              </button>
            </div>

            {/* Problem Content */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              {activeTab === "description" ? (
                <div className="space-y-7">
                  {/* Description */}

                  <div>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                      Problem
                    </h2>

                    <p className="whitespace-pre-line text-[15px] leading-7 text-slate-300">
                      {problem.description}
                    </p>
                  </div>

                  {/* Examples preview */}

                  {problem.example?.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Examples
                      </h2>

                      <div className="space-y-3">
                        {problem.example.slice(0, 2).map((example, index) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#080d15]"
                          >
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                              <span className="text-xs font-semibold text-slate-400">
                                Example {index + 1}
                              </span>

                              <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-400">
                                Sample
                              </span>
                            </div>

                            <div className="grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                              <div className="p-4">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                  Input
                                </p>

                                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-slate-300">
                                  {example.input}
                                </pre>
                              </div>

                              <div className="p-4">
                                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                                  Output
                                </p>

                                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-emerald-300">
                                  {example.output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Constraints */}

                  {problem.constraints && (
                    <div>
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Constraints
                      </h2>

                      <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                        <pre className="whitespace-pre-wrap font-mono text-xs leading-7 text-slate-400">
                          {problem.constraints}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Topics */}

                  {problem.topics?.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                        Topics
                      </h2>

                      <div className="flex flex-wrap gap-2">
                        {problem.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-lg border border-indigo-500/10 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-white">
                      Sample Test Cases
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Run your code against these examples before submitting.
                    </p>
                  </div>

                  {problem.example?.length > 0 ? (
                    problem.example.map((example, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#080d15]"
                      >
                        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                              {index + 1}
                            </div>

                            <span className="text-sm font-medium text-slate-300">
                              Example {index + 1}
                            </span>
                          </div>

                          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                            Public
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2">
                          <div className="border-b border-white/[0.06] p-4 sm:border-b-0 sm:border-r">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              Input
                            </p>

                            <pre className="min-h-20 whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-slate-300">
                              {example.input}
                            </pre>
                          </div>

                          <div className="p-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              Expected Output
                            </p>

                            <pre className="min-h-20 whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-emerald-300">
                              {example.output}
                            </pre>
                          </div>
                        </div>

                        {example.explanation && (
                          <div className="border-t border-white/[0.06] px-4 py-4">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              Explanation
                            </p>

                            <p className="text-xs leading-6 text-slate-400">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                      <Terminal
                        size={28}
                        className="mx-auto mb-3 text-slate-700"
                      />

                      <p className="text-sm text-slate-500">
                        No example test cases available.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ================================================= */}
          {/* RIGHT - CODE EDITOR */}
          {/* ================================================= */}

          <section className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#141414] shadow-2xl shadow-black/20">
            {/* Editor Header */}

            <div className="flex h-12 items-center justify-between border-b border-white/[0.06] bg-[#141414] px-4">
              {/* Language */}

              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-white"
                >
                  {selectedLanguage.label}
                  <ChevronDown size={15} />
                </button>

                {showLanguageMenu && (
                  <>
                    <button
                      aria-label="Close menu"
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => setShowLanguageMenu(false)}
                    />

                    <div className="absolute left-0 top-9 z-30 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1d1d1d] p-1.5 shadow-2xl">
                      {languages.map((item) => (
                        <button
                          key={item.value}
                          onClick={() => handleLanguageChange(item.value)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition ${
                            language === item.value
                              ? "bg-white/[0.06] text-white"
                              : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          {item.label}

                          {language === item.value && (
                            <Check size={13} className="ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  title="Reset code"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300"
                >
                  <RotateCcw size={15} />
                </button>

                <button
                  onClick={handleCopyCode}
                  title="Copy code"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300"
                >
                  {copied ? (
                    <Check size={15} className="text-emerald-400" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>

                <button
                  onClick={handleRun}
                  disabled={running || submitting}
                  title="Run examples"
                  className="flex h-9 w-11 items-center justify-center rounded-lg bg-[#262626] text-slate-300 transition hover:bg-[#303030] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {running ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
                  ) : (
                    <Play size={15} fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={running || submitting}
                  className="flex h-9 items-center gap-2 rounded-lg bg-[#262626] px-5 text-sm font-semibold text-emerald-400 transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-900 border-t-emerald-400" />
                  ) : (
                    <Rocket size={15} />
                  )}
                  Submit
                </button>
              </div>
            </div>

            {/* Editor */}

            <div className="relative min-h-[420px] flex-1 bg-[#141414]">
              <div className="absolute inset-0 flex">
                {/* Line numbers */}

                <div
                  ref={gutterRef}
                  className="w-14 shrink-0 select-none overflow-hidden pt-4 text-right font-mono text-[14px] leading-7 text-slate-600"
                >
                  {Array.from({ length: lineCount }, (_, index) => (
                    <div key={index} className="pr-4">
                      {index + 1}
                    </div>
                  ))}

                  <div className="h-10" />
                </div>

                {/* Highlight layer + textarea */}

                <div className="relative min-w-0 flex-1">
                  <pre
                    ref={preRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-4 pl-2 font-mono text-[14px] leading-7 text-slate-200"
                  >
                    {highlightCode(code, language)}
                    {"\n"}
                  </pre>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onScroll={handleEditorScroll}
                    onKeyDown={handleEditorKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    wrap="off"
                    className="absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre border-0 bg-transparent p-4 pl-2 font-mono text-[14px] leading-7 text-transparent caret-white outline-none selection:bg-indigo-500/30 focus:ring-0"
                    placeholder="Write your solution here..."
                  />
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* RESULTS */}
            {/* ================================================= */}

            <div className="border-t border-white/[0.07] bg-[#141414]">
              {/* Result tabs */}

              <div className="flex items-center justify-between border-b border-white/[0.06] px-4">
                <div className="flex">
                  <button
                    onClick={() => setResultTab("output")}
                    className={`relative px-1 py-3 text-xs font-semibold ${
                      resultTab === "output"
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    Output

                    {resultTab === "output" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setResultTab("tests")}
                    className={`relative ml-5 px-1 py-3 text-xs font-semibold ${
                      resultTab === "tests"
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    Test Cases

                    {resultTab === "tests" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>
                </div>

                {runResults.length > 0 && (
                  <span className="text-[10px] text-slate-600">
                    {resultStats.passed}/{resultStats.total} passed
                  </span>
                )}
              </div>

              {/* Results content */}

              <div className="max-h-[390px] min-h-[210px] overflow-y-auto p-4">
                {resultTab === "tests" ? (
                  <div className="space-y-2">
                    {problem.example?.length > 0 ? (
                      problem.example.map((example, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-[10px] font-bold text-indigo-400">
                              {index + 1}
                            </div>

                            <div>
                              <p className="text-xs font-medium text-slate-300">
                                Example {index + 1}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-600">
                                Public test case
                              </p>
                            </div>
                          </div>

                          <ChevronRight size={15} className="text-slate-700" />
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <Terminal
                          size={28}
                          className="mx-auto mb-3 text-slate-700"
                        />

                        <p className="text-xs text-slate-600">
                          No test cases available.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Empty */}

                    {runResults.length === 0 && !summary && (
                      <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                          <Terminal size={21} className="text-slate-700" />
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                          No output yet
                        </p>

                        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-700">
                          Run your code to test it against the examples.
                        </p>
                      </div>
                    )}

                    {/* Summary */}

                    {summary && (
                      <div
                        className={`mb-4 overflow-hidden rounded-xl border ${
                          summary.status === "Accepted"
                            ? "border-emerald-400/15 bg-emerald-400/[0.035]"
                            : "border-rose-400/15 bg-rose-400/[0.035]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                summary.status === "Accepted"
                                  ? "bg-emerald-400/10 text-emerald-400"
                                  : "bg-rose-400/10 text-rose-400"
                              }`}
                            >
                              {summary.status === "Accepted" ? (
                                <Check size={20} />
                              ) : (
                                <CircleAlert size={20} />
                              )}
                            </div>

                            <div>
                              <p
                                className={`text-sm font-bold ${
                                  summary.status === "Accepted"
                                    ? "text-emerald-400"
                                    : "text-rose-400"
                                }`}
                              >
                                {summary.mode === "run"
                                  ? summary.status === "Accepted"
                                    ? "All Examples Passed"
                                    : "Some Examples Failed"
                                  : summary.status}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {summary.passed} of {summary.total} test cases
                                passed
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {summary.runtime !== undefined && (
                              <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                  <Clock3 size={11} />
                                  Runtime
                                </div>

                                <p className="mt-1 text-xs font-semibold text-slate-400">
                                  {summary.runtime} ms
                                </p>
                              </div>
                            )}

                            {summary.memory !== undefined && (
                              <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                  <MemoryStick size={11} />
                                  Memory
                                </div>

                                <p className="mt-1 text-xs font-semibold text-slate-400">
                                  {summary.memory}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Individual results */}

                    {runResults.length > 0 && (
                      <div className="space-y-3">
                        {runResults.map((result, index) => {
                          const status = getStatusConfig(result);
                          const StatusIcon = status.icon;

                          const isHidden =
                            result.input === "Hidden Test Case" ||
                            result.expectedOutput === "Hidden" ||
                            result.actualOutput === "Hidden";

                          return (
                            <div
                              key={`${result.type || "Test"}-${result.number || index}`}
                              className={`overflow-hidden rounded-xl border ${status.border} bg-[#0b111b]`}
                            >
                              {/* Result header */}

                              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${status.iconBg} ${status.text}`}
                                  >
                                    <StatusIcon size={15} />
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-semibold text-slate-300">
                                        {result.type || "Test Case"}{" "}
                                        {result.number || index + 1}
                                      </p>

                                      {isHidden && (
                                        <span className="flex items-center gap-1 rounded-md bg-slate-500/10 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                                          <Lock size={9} />
                                          Hidden
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <span
                                  className={`rounded-md px-2 py-1 text-[10px] font-semibold ${status.bg} ${status.text}`}
                                >
                                  {status.label}
                                </span>
                              </div>

                              {/* Result body */}

                              <div className="grid sm:grid-cols-3">
                                {/* Input */}

                                <div className="border-b border-white/[0.05] p-4 sm:border-b-0 sm:border-r">
                                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                    Input
                                  </p>

                                  <pre
                                    className={`max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-black/25 p-3 font-mono text-[11px] leading-5 ${
                                      isHidden
                                        ? "text-slate-600"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {result.input || ""}
                                  </pre>
                                </div>

                                {/* Expected */}

                                <div className="border-b border-white/[0.05] p-4 sm:border-b-0 sm:border-r">
                                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                    Expected
                                  </p>

                                  <pre
                                    className={`max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-black/25 p-3 font-mono text-[11px] leading-5 ${
                                      isHidden
                                        ? "text-slate-600"
                                        : "text-emerald-300/80"
                                    }`}
                                  >
                                    {result.expectedOutput || ""}
                                  </pre>
                                </div>

                                {/* Actual */}

                                <div className="p-4">
                                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                                    Actual
                                  </p>

                                  <pre
                                    className={`max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-black/25 p-3 font-mono text-[11px] leading-5 ${
                                      isHidden
                                        ? "text-slate-600"
                                        : result.passed
                                        ? "text-emerald-300/80"
                                        : "text-rose-300/80"
                                    }`}
                                  >
                                    {result.actualOutput || ""}
                                  </pre>
                                </div>
                              </div>

                              {/* Error */}

                              {result.error && (
                                <div className="border-t border-white/[0.05] bg-rose-500/[0.025] px-4 py-3">
                                  <div className="flex items-start gap-2">
                                    <CircleAlert
                                      size={14}
                                      className="mt-0.5 shrink-0 text-rose-400"
                                    />

                                    <pre className="whitespace-pre-wrap font-mono text-[11px] leading-5 text-rose-300/80">
                                      {typeof result.error === "string"
                                        ? result.error
                                        : JSON.stringify(result.error, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProblemDetail;

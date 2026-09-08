import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  CirclePlus,
  Code2,
  EyeOff,
  FileCode2,
  Layers3,
  Minus,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import api from "../../services/api";

const CreateProblem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    topics: "",
    constraints: "",
    starterCode: "",
  });

  const [examples, setExamples] = useState([
    {
      input: "",
      output: "",
      explanation: "",
    },
  ]);

  const [testCases, setTestCases] = useState([
    {
      input: "",
      expectedOutput: "",
      isHidden: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExampleChange = (index, field, value) => {
    setExamples((prev) =>
      prev.map((example, i) =>
        i === index
          ? {
              ...example,
              [field]: value,
            }
          : example
      )
    );
  };

  const addExample = () => {
    setExamples((prev) => [
      ...prev,
      {
        input: "",
        output: "",
        explanation: "",
      },
    ]);
  };

  const removeExample = (index) => {
    if (examples.length === 1) {
      return;
    }

    setExamples((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleTestCaseChange = (index, field, value) => {
    setTestCases((prev) =>
      prev.map((testCase, i) =>
        i === index
          ? {
              ...testCase,
              [field]: value,
            }
          : testCase
      )
    );
  };

  const addTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        input: "",
        expectedOutput: "",
        isHidden: false,
      },
    ]);
  };

  const removeTestCase = (index) => {
    if (testCases.length === 1) {
      return;
    }

    setTestCases((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const validExamples = examples.filter(
        (example) =>
          example.input.trim() ||
          example.output.trim() ||
          example.explanation.trim()
      );

      const validTestCases = testCases.filter(
        (testCase) =>
          testCase.input.trim() &&
          testCase.expectedOutput.trim()
      );

      if (!formData.title.trim()) {
        setError("Problem title is required.");
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError("Problem description is required.");
        setLoading(false);
        return;
      }

      if (validExamples.length === 0) {
        setError("Please add at least one example.");
        setLoading(false);
        return;
      }

      if (validTestCases.length === 0) {
        setError("Please add at least one valid test case.");
        setLoading(false);
        return;
      }

      const problemData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        difficulty: formData.difficulty,

        topics: formData.topics
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),

        constraints: formData.constraints
          .split("\n")
          .map((constraint) => constraint.trim())
          .filter(Boolean),

        starterCode: formData.starterCode,

        example: validExamples,
        testCases: validTestCases,
      };

      await api.post("/problems", problemData);

      alert("Problem created successfully 🎉");

      navigate("/admin/problems");
    } catch (error) {
      console.error(
        "Create Problem Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to create problem"
      );
    } finally {
      setLoading(false);
    }
  };

  const difficultyConfig = {
    Easy: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    Medium: {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
    Hard: {
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      dot: "bg-rose-400",
    },
  };

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-[#080b12] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5";

  const textareaClass =
    "w-full resize-y rounded-xl border border-slate-800 bg-[#080b12] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5";

  const SectionHeader = ({
    number,
    icon: Icon,
    title,
    description,
    action,
  }) => (
    <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-blue-400">
              {number}
            </span>

            <h2 className="text-sm font-bold text-slate-100 sm:text-base">
              {title}
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      {action}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#080b12] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Admin Control Center
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            Problems
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            Create
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 sm:flex">
                <CirclePlus className="h-7 w-7 text-blue-400" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Create New Problem
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Build a complete coding challenge with examples,
                  constraints, starter code and evaluation test cases.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/problems")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0d111a] px-4 py-3 text-sm font-bold text-slate-400 transition hover:border-slate-700 hover:bg-[#10151f] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Problems
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-rose-300">
                    Unable to create problem
                  </p>

                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="rounded-md p-1 text-rose-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-1 text-xs leading-5 text-rose-400/80">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] shadow-2xl shadow-black/10">
            <SectionHeader
              number="01"
              icon={Layers3}
              title="Basic Information"
              description="Define the core details of the coding challenge."
            />

            <div className="space-y-6 p-5 sm:p-6">

              {/* Title */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Problem Title
                  <span className="text-rose-400">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Two Sum"
                  required
                  className={inputClass}
                />

                <p className="mt-2 text-[11px] text-slate-600">
                  Use a clear and concise title that describes the challenge.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                  <span className="text-rose-400">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write the complete problem description..."
                  rows={8}
                  required
                  className={textareaClass}
                />

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                  <span>
                    Clearly explain what the user needs to solve.
                  </span>

                  <span>{formData.description.length} characters</span>
                </div>
              </div>

              {/* Difficulty + Topics */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Difficulty
                  </label>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <div className="mt-3">
                    {(() => {
                      const config =
                        difficultyConfig[formData.difficulty];

                      return (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.bg} ${config.border} ${config.text}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                          />
                          {formData.difficulty} Difficulty
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Topics
                  </label>

                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder="Array, Hash Table, Two Pointer"
                    className={inputClass}
                  />

                  <p className="mt-2 text-[11px] text-slate-600">
                    Separate multiple topics using commas.
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Constraints
                </label>

                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  placeholder={`2 <= nums.length <= 10000
-10^9 <= nums[i] <= 10^9`}
                  rows={6}
                  className={`${textareaClass} font-mono text-[13px]`}
                />

                <p className="mt-2 text-[11px] text-slate-600">
                  Write each constraint on a separate line.
                </p>
              </div>
            </div>
          </section>

          {/* Starter Code */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] shadow-2xl shadow-black/10">
            <SectionHeader
              number="02"
              icon={Code2}
              title="Starter Code"
              description="Provide the initial code shown to users."
            />

            <div className="p-5 sm:p-6">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#080b12]">

                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0a0e16] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-blue-400" />

                    <span className="font-mono text-xs font-bold text-slate-400">
                      starter.cpp
                    </span>
                  </div>

                  <span className="rounded-lg border border-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    C++
                  </span>
                </div>

                <textarea
                  name="starterCode"
                  value={formData.starterCode}
                  onChange={handleChange}
                  placeholder={`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`}
                  rows={16}
                  className="w-full resize-y bg-transparent px-5 py-4 font-mono text-[13px] leading-6 text-slate-300 outline-none placeholder:text-slate-700"
                />
              </div>
            </div>
          </section>

          {/* Examples */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] shadow-2xl shadow-black/10">
            <SectionHeader
              number="03"
              icon={Sparkles}
              title="Examples"
              description="Examples visible to users on the problem page."
              action={
                <button
                  type="button"
                  onClick={addExample}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-xs font-bold text-blue-400 transition hover:border-blue-500/30 hover:bg-blue-500/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Example
                </button>
              }
            />

            <div className="space-y-5 p-5 sm:p-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-[#080b12]"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 bg-[#0a0e16] px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 font-mono text-xs font-bold text-violet-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3 className="text-sm font-bold text-slate-200">
                          Example {index + 1}
                        </h3>

                        <p className="hidden text-[10px] text-slate-600 sm:block">
                          Visible to all users
                        </p>
                      </div>
                    </div>

                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-2 text-[11px] font-bold text-slate-500 transition hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          Remove
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-5 p-4 sm:p-5">

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Input
                        </label>

                        <textarea
                          value={example.input}
                          onChange={(e) =>
                            handleExampleChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          placeholder="Example input"
                          rows={5}
                          required
                          className={`${textareaClass} font-mono text-[13px]`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Output
                        </label>

                        <textarea
                          value={example.output}
                          onChange={(e) =>
                            handleExampleChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          placeholder="Expected output"
                          rows={5}
                          required
                          className={`${textareaClass} font-mono text-[13px]`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Explanation
                      </label>

                      <textarea
                        value={example.explanation}
                        onChange={(e) =>
                          handleExampleChange(
                            index,
                            "explanation",
                            e.target.value
                          )
                        }
                        placeholder="Explain why this is the expected output..."
                        rows={4}
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Test Cases */}
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] shadow-2xl shadow-black/10">
            <SectionHeader
              number="04"
              icon={Zap}
              title="Test Cases"
              description="Test cases used to evaluate submitted code."
              action={
                <button
                  type="button"
                  onClick={addTestCase}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-400 transition hover:border-emerald-500/30 hover:bg-emerald-500/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Test Case
                </button>
              }
            />

            <div className="space-y-5 p-5 sm:p-6">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-[#080b12]"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 bg-[#0a0e16] px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-xs font-bold text-emerald-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3 className="text-sm font-bold text-slate-200">
                          Test Case {index + 1}
                        </h3>

                        <p className="hidden text-[10px] text-slate-600 sm:block">
                          Evaluation input
                        </p>
                      </div>
                    </div>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-2.5 py-2 text-[11px] font-bold text-slate-500 transition hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          Remove
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-5 p-4 sm:p-5">

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Input
                        </label>

                        <textarea
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          placeholder={`5
1 2 3 4 5`}
                          rows={5}
                          required
                          className={`${textareaClass} font-mono text-[13px]`}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Expected Output
                        </label>

                        <textarea
                          value={testCase.expectedOutput}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "expectedOutput",
                              e.target.value
                            )
                          }
                          placeholder="15"
                          rows={5}
                          required
                          className={`${textareaClass} font-mono text-[13px]`}
                        />
                      </div>
                    </div>

                    <label
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition ${
                        testCase.isHidden
                          ? "border-amber-500/20 bg-amber-500/5"
                          : "border-slate-800 bg-[#0d111a] hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            testCase.isHidden
                              ? "bg-amber-500/10"
                              : "bg-slate-800"
                          }`}
                        >
                          {testCase.isHidden ? (
                            <EyeOff className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Check className="h-4 w-4 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-300">
                            Hidden Test Case
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-600">
                            Keep this test case hidden from users.
                          </p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={testCase.isHidden}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "isHidden",
                            e.target.checked
                          )
                        }
                        className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/20"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-[#0d111a] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Examples
              </p>

              <p className="mt-2 text-2xl font-black text-violet-400">
                {examples.length}
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                Visible examples
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d111a] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Test Cases
              </p>

              <p className="mt-2 text-2xl font-black text-emerald-400">
                {testCases.length}
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                Evaluation cases
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0d111a] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Hidden
              </p>

              <p className="mt-2 text-2xl font-black text-amber-400">
                {testCases.filter((testCase) => testCase.isHidden).length}
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                Private evaluation cases
              </p>
            </div>
          </section>

          {/* Submit */}
          <section className="sticky bottom-4 z-20 overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 sm:flex">
                  <Save className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Ready to publish?
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Verify the problem statement, examples and test cases
                    before creating it.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/admin/problems")}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#080b12] px-5 py-3 text-sm font-bold text-slate-400 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Problem
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

        </form>
      </main>
    </div>
  );
};

export default CreateProblem;
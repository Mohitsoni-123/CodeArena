import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Code2,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import api from "../../services/api";

const emptyExample = {
  input: "",
  output: "",
  explanation: "",
};

const emptyTestCase = {
  input: "",
  expectedOutput: "",
  isHidden: false,
};

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="border-b border-white/10 px-5 py-5 sm:px-7">
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon size={19} className="text-cyan-400" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-white sm:text-base">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const InputLabel = ({ children }) => (
  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
    {children}
  </label>
);

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1018] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    topics: "",
    constraints: "",
    starterCode: "",
  });

  const [examples, setExamples] = useState([emptyExample]);
  const [testCases, setTestCases] = useState([emptyTestCase]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ============================
  // FETCH PROBLEM
  // ============================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/problems/admin/${id}`);
        const problem = response.data.problem;

        setFormData({
          title: problem.title || "",
          description: problem.description || "",
          difficulty: problem.difficulty || "Easy",
          topics: problem.topics?.join(", ") || "",
          constraints: problem.constraints?.join("\n") || "",
          starterCode: problem.starterCode || "",
        });

        setExamples(
          problem.example?.length
            ? problem.example.map((example) => ({
                input: example.input || "",
                output: example.output || "",
                explanation: example.explanation || "",
              }))
            : [{ ...emptyExample }]
        );

        setTestCases(
          problem.testCases?.length
            ? problem.testCases.map((testCase) => ({
                input: testCase.input || "",
                expectedOutput: testCase.expectedOutput || "",
                isHidden: Boolean(testCase.isHidden),
              }))
            : [{ ...emptyTestCase }]
        );
      } catch (err) {
        console.error("Fetch Problem Error:", err);

        setError(
          err.response?.data?.message || "Failed to load problem."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  // ============================
  // BASIC FORM
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // EXAMPLES
  // ============================

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
    setExamples((prev) => [...prev, { ...emptyExample }]);
  };

  const removeExample = (index) => {
    if (examples.length === 1) {
      setError("At least one example is required.");
      return;
    }

    setExamples((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================
  // TEST CASES
  // ============================

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
    setTestCases((prev) => [...prev, { ...emptyTestCase }]);
  };

  const removeTestCase = (index) => {
    if (testCases.length === 1) {
      setError("At least one test case is required.");
      return;
    }

    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================
  // UPDATE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Problem title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Problem description is required.");
      return;
    }

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

    if (validExamples.length === 0) {
      setError("Please add at least one valid example.");
      return;
    }

    if (validTestCases.length === 0) {
      setError("Please add at least one valid test case.");
      return;
    }

    try {
      setUpdating(true);

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

      await api.put(`/problems/${id}`, problemData);

      alert("Problem updated successfully 🎉");

      navigate("/admin/problems");
    } catch (err) {
      console.error(
        "Update Problem Error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          "Failed to update problem."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a0f] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="mt-5 h-10 w-72 rounded bg-white/10" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/5" />

          <div className="mt-10 space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-44 rounded-2xl border border-white/5 bg-[#0d1118]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // FETCH ERROR
  // ============================

  if (error && !formData.title) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070a0f] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0d1118] p-7 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
            <X size={25} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            Unable to load problem
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/admin/problems")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            <ArrowLeft size={17} />
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/problems")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Problems
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                <Zap size={13} />
                Admin • Edit Problem
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Edit Problem
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Update the problem statement, examples, starter code,
                and test cases.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-slate-500 sm:flex">
              <Code2 size={15} className="text-cyan-400" />
              Problem ID: {id}
            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <X size={19} className="mt-0.5 shrink-0 text-red-400" />

            <div>
              <p className="text-sm font-bold text-red-300">
                Something went wrong
              </p>

              <p className="mt-1 text-xs leading-5 text-red-400/80">
                {error}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= BASIC INFORMATION ================= */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1118] shadow-xl shadow-black/10">
            <SectionHeader
              icon={FileText}
              title="Basic Information"
              description="Define the problem title, difficulty, description, topics and constraints."
            />

            <div className="space-y-6 p-5 sm:p-7">

              <div>
                <InputLabel>Problem Title</InputLabel>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Two Sum"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <InputLabel>Difficulty</InputLabel>

                  <div className="relative">
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <InputLabel>Topics</InputLabel>

                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleChange}
                    placeholder="Array, Hash Map, Two Pointers"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-slate-600">
                    Separate topics using commas.
                  </p>
                </div>
              </div>

              <div>
                <InputLabel>Description</InputLabel>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Write a clear problem statement..."
                  className={`${inputClass} resize-y leading-6`}
                />
              </div>

              <div>
                <InputLabel>Constraints</InputLabel>

                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows={5}
                  placeholder={"1 <= n <= 10^5\n-10^9 <= nums[i] <= 10^9"}
                  className={`${inputClass} resize-y font-mono leading-6`}
                />

                <p className="mt-2 text-xs text-slate-600">
                  Write each constraint on a new line.
                </p>
              </div>
            </div>
          </section>

          {/* ================= STARTER CODE ================= */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1118] shadow-xl shadow-black/10">
            <SectionHeader
              icon={Code2}
              title="Starter Code"
              description="This code will be shown to users when they open the problem."
            />

            <div className="p-5 sm:p-7">
              <textarea
                name="starterCode"
                value={formData.starterCode}
                onChange={handleChange}
                rows={16}
                spellCheck={false}
                placeholder={`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`}
                className="w-full resize-y rounded-xl border border-white/10 bg-[#080b10] px-4 py-4 font-mono text-sm leading-6 text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-400/10"
              />

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <Code2 size={14} />
                Starter code is editable by the admin.
              </div>
            </div>
          </section>

          {/* ================= EXAMPLES ================= */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1118] shadow-xl shadow-black/10">
            <SectionHeader
              icon={FileText}
              title="Examples"
              description="Add the public examples users will see on the problem page."
            />

            <div className="space-y-5 p-5 sm:p-7">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#0a0e14] p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-xs font-black text-cyan-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Example {index + 1}
                        </h3>
                        <p className="text-xs text-slate-600">
                          Public example
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Remove example"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <InputLabel>Input</InputLabel>

                      <textarea
                        value={example.input}
                        onChange={(e) =>
                          handleExampleChange(
                            index,
                            "input",
                            e.target.value
                          )
                        }
                        rows={5}
                        placeholder="5
1 2 3 4 5"
                        className={`${inputClass} resize-y font-mono`}
                      />
                    </div>

                    <div>
                      <InputLabel>Expected Output</InputLabel>

                      <textarea
                        value={example.output}
                        onChange={(e) =>
                          handleExampleChange(
                            index,
                            "output",
                            e.target.value
                          )
                        }
                        rows={5}
                        placeholder="15"
                        className={`${inputClass} resize-y font-mono`}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <InputLabel>Explanation</InputLabel>

                    <textarea
                      value={example.explanation}
                      onChange={(e) =>
                        handleExampleChange(
                          index,
                          "explanation",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Explain why this output is correct..."
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addExample}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-400"
              >
                <Plus size={17} />
                Add Example
              </button>
            </div>
          </section>

          {/* ================= TEST CASES ================= */}

          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1118] shadow-xl shadow-black/10">
            <SectionHeader
              icon={FlaskConical}
              title="Test Cases"
              description="Configure the cases used to validate user submissions."
            />

            <div className="space-y-5 p-5 sm:p-7">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-[#0a0e14] p-4 sm:p-5"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-xs font-black text-violet-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Test Case {index + 1}
                        </h3>

                        <div className="mt-1 flex items-center gap-2">
                          {testCase.isHidden ? (
                            <>
                              <EyeOff size={12} className="text-amber-400" />
                              <span className="text-[11px] font-semibold text-amber-400">
                                Hidden
                              </span>
                            </>
                          ) : (
                            <>
                              <Eye size={12} className="text-emerald-400" />
                              <span className="text-[11px] font-semibold text-emerald-400">
                                Visible
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleTestCaseChange(
                            index,
                            "isHidden",
                            !testCase.isHidden
                          )
                        }
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                          testCase.isHidden
                            ? "border-amber-400/20 bg-amber-400/10 text-amber-400 hover:bg-amber-400/15"
                            : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {testCase.isHidden ? (
                          <>
                            <EyeOff size={14} />
                            Hidden
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            Visible
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="rounded-lg p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Remove test case"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <InputLabel>Input</InputLabel>

                      <textarea
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "input",
                            e.target.value
                          )
                        }
                        rows={5}
                        placeholder="Test case input..."
                        className={`${inputClass} resize-y font-mono`}
                      />
                    </div>

                    <div>
                      <InputLabel>Expected Output</InputLabel>

                      <textarea
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        rows={5}
                        placeholder="Expected output..."
                        className={`${inputClass} resize-y font-mono`}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addTestCase}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-violet-400/40 hover:bg-violet-400/5 hover:text-violet-400"
              >
                <Plus size={17} />
                Add Test Case
              </button>
            </div>
          </section>

          {/* ================= SUMMARY ================= */}

          <section className="rounded-2xl border border-white/10 bg-[#0d1118] p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-600">Difficulty</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {formData.difficulty}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-600">Examples</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {examples.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-xs text-slate-600">Test Cases</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {testCases.length}
                </p>
              </div>
            </div>
          </section>

          {/* ================= ACTIONS ================= */}

          <div className="sticky bottom-4 z-20">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1118]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate("/admin/problems")}
                disabled={updating}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Update Problem
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* ================= FOOTER ================= */}

        <div className="mt-8 flex items-center justify-center gap-2 pb-4 text-xs text-slate-700">
          <Check size={13} className="text-emerald-500" />
          Changes are saved securely to CodeArena.
        </div>
      </div>
    </div>
  );
};

export default EditProblem;
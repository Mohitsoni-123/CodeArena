import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

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

        // IMPORTANT: Admin endpoint
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

        if (problem.example?.length > 0) {
          setExamples(
            problem.example.map((example) => ({
              input: example.input || "",
              output: example.output || "",
              explanation: example.explanation || "",
            }))
          );
        } else {
          setExamples([
            {
              input: "",
              output: "",
              explanation: "",
            },
          ]);
        }

        if (problem.testCases?.length > 0) {
          setTestCases(
            problem.testCases.map((testCase) => ({
              input: testCase.input || "",
              expectedOutput: testCase.expectedOutput || "",
              isHidden: Boolean(testCase.isHidden),
            }))
          );
        } else {
          setTestCases([
            {
              input: "",
              expectedOutput: "",
              isHidden: false,
            },
          ]);
        }
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

  // ============================
  // BASIC CHANGE
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
      alert("At least one example is required");
      return;
    }

    setExamples((prev) =>
      prev.filter((_, i) => i !== index)
    );
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
      alert("At least one test case is required");
      return;
    }

    setTestCases((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ============================
  // UPDATE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
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

      if (validExamples.length === 0) {
        setError("Please add at least one example.");
        setUpdating(false);
        return;
      }

      if (validTestCases.length === 0) {
        setError("Please add at least one valid test case.");
        setUpdating(false);
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

      await api.put(`/problems/${id}`, problemData);

      alert("Problem updated successfully 🎉");

      navigate("/admin/problems");
    } catch (error) {
      console.error(
        "Update Problem Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update problem"
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
      <div className="min-h-screen bg-[#f6f8fc] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 rounded-2xl bg-white shadow-sm"
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
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load problem
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/admin/problems")}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <span>✏️</span>
              ADMIN • EDIT PROBLEM
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Edit Problem
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Update your CodeArena coding problem and test cases.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/problems")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back to Problems
          </button>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <span className="text-lg">⚠️</span>

            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= BASIC INFO ================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                  📝
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="text-sm text-slate-500">
                    Define the problem title and description.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-7">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Problem Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Two Sum"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* DIFFICULTY */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:max-w-xs"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={7}
                  required
                  placeholder="Describe the problem clearly..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* TOPICS */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Topics
                </label>

                <input
                  type="text"
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  placeholder="Array, Hash Map, Two Pointers"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate multiple topics using commas.
                </p>
              </div>

              {/* CONSTRAINTS */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Constraints
                </label>

                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  rows={5}
                  placeholder={"1 ≤ n ≤ 10⁵\n-10⁹ ≤ nums[i] ≤ 10⁹"}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Write each constraint on a new line.
                </p>
              </div>
            </div>
          </section>

          {/* ================= STARTER CODE ================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                  💻
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Starter Code
                  </h2>

                  <p className="text-sm text-slate-500">
                    Provide the initial code shown to users.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <textarea
                name="starterCode"
                value={formData.starterCode}
                onChange={handleChange}
                rows={12}
                placeholder="// Write starter code here..."
                className="w-full resize-y rounded-xl border border-slate-800 bg-[#0b1120] px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </section>

          {/* ================= EXAMPLES ================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                  🧪
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Examples
                  </h2>

                  <p className="text-sm text-slate-500">
                    Examples visible to users on the problem page.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addExample}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                + Add Example
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-700 shadow-sm">
                        {index + 1}
                      </span>

                      <h3 className="font-bold text-slate-900">
                        Example {index + 1}
                      </h3>
                    </div>

                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">

                    {/* INPUT */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
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
                        rows={4}
                        required
                        placeholder="Example input..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    {/* OUTPUT */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
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
                        rows={4}
                        required
                        placeholder="Example output..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    {/* EXPLANATION */}

                    <div className="lg:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-slate-700">
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
                        rows={4}
                        placeholder="Explain why this output is correct..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================= TEST CASES ================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-lg">
                  🔐
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Test Cases
                  </h2>

                  <p className="text-sm text-slate-500">
                    Used by CodeArena to evaluate submitted code.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addTestCase}
                className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
              >
                + Add Test Case
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-700 shadow-sm">
                        {index + 1}
                      </span>

                      <h3 className="font-bold text-slate-900">
                        Test Case {index + 1}
                      </h3>
                    </div>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">

                    {/* INPUT */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
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
                        rows={4}
                        required
                        placeholder="Test input..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    {/* EXPECTED OUTPUT */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
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
                        rows={4}
                        required
                        placeholder="Expected output..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* HIDDEN */}

                  <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
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
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Hidden Test Case
                      </p>

                      <p className="text-xs text-slate-400">
                        Users will not see this test case.
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* ================= ACTIONS ================= */}

          <div className="flex flex-col-reverse gap-3 pb-10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/problems")}
              disabled={updating}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating Problem...
                </span>
              ) : (
                "✓ Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProblem;
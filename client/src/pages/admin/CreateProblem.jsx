import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      alert("At least one example is required");
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
      alert("At least one test case is required");
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

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const textareaClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y";

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Problem Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create New Problem
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Add a new coding challenge to CodeArena.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/problems")}
            className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back to Problems
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                !
              </div>

              <div>
                <p className="font-semibold text-red-800">
                  Unable to create problem
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  01
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    Define the core details of the problem.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Problem Title
                  <span className="ml-1 text-red-500">*</span>
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
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write the complete problem description..."
                  rows={7}
                  required
                  className={textareaClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Clearly explain the problem and what the user needs to solve.
                </p>
              </div>

              {/* Difficulty + Topics */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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

                  <p className="mt-2 text-xs text-slate-400">
                    Separate topics using commas.
                  </p>
                </div>
              </div>

              {/* Constraints */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Constraints
                </label>

                <textarea
                  name="constraints"
                  value={formData.constraints}
                  onChange={handleChange}
                  placeholder={`2 <= nums.length <= 10000
-10^9 <= nums[i] <= 10^9`}
                  rows={6}
                  className={textareaClass}
                />

                <p className="mt-2 text-xs text-slate-400">
                  Write each constraint on a new line.
                </p>
              </div>
            </div>
          </section>

          {/* Starter Code */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                  02
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Starter Code
                  </h2>

                  <p className="text-xs text-slate-500">
                    Provide the initial code shown to users.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <textarea
                name="starterCode"
                value={formData.starterCode}
                onChange={handleChange}
                placeholder="// Write starter code here..."
                rows={14}
                className={`${textareaClass} font-mono text-[13px] leading-6`}
              />
            </div>
          </section>

          {/* Examples */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xs font-bold text-violet-600">
                    03
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Examples
                    </h2>

                    <p className="text-xs text-slate-500">
                      Examples visible on the problem page.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addExample}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  + Add Example
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                        {index + 1}
                      </span>

                      <h3 className="font-semibold text-slate-900">
                        Example {index + 1}
                      </h3>
                    </div>

                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        rows={3}
                        required
                        className={`${textareaClass} font-mono text-[13px]`}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        rows={3}
                        required
                        className={`${textareaClass} font-mono text-[13px]`}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-xs font-bold text-emerald-600">
                    04
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Test Cases
                    </h2>

                    <p className="text-xs text-slate-500">
                      Test cases used to evaluate submitted code.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addTestCase}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  + Add Test Case
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                        {index + 1}
                      </span>

                      <h3 className="font-semibold text-slate-900">
                        Test Case {index + 1}
                      </h3>
                    </div>

                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        placeholder="[2,7,11,15] 9"
                        rows={3}
                        required
                        className={`${textareaClass} font-mono text-[13px]`}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Expected Output
                      </label>

                      <input
                        type="text"
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          handleTestCaseChange(
                            index,
                            "expectedOutput",
                            e.target.value
                          )
                        }
                        placeholder="[0,1]"
                        required
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
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
                        <p className="text-sm font-semibold text-slate-800">
                          Hidden Test Case
                        </p>

                        <p className="text-xs text-slate-400">
                          Keep this test case hidden from users.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Ready to publish?
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Make sure the problem, examples and test cases are correct.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/admin/problems")}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Problem..." : "Create Problem"}
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
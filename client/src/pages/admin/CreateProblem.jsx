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

  // -----------------------------
  // Form Change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Example Functions
  // -----------------------------
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

  // -----------------------------
  // Test Case Functions
  // -----------------------------
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

  // -----------------------------
  // Submit Problem
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      // Validate examples
      const validExamples = examples.filter(
        (example) =>
          example.input.trim() ||
          example.output.trim() ||
          example.explanation.trim()
      );

      // Validate test cases
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

        // IMPORTANT:
        // Backend Problem model uses "example" singular
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

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      {/* PAGE HEADER */}
      <h1>Create New Problem</h1>

      <p>
        Add a new coding problem to CodeArena.
      </p>

      {/* ERROR */}
      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ===================================== */}
        {/* TITLE */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Problem Title</strong>
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Two Sum"
            required
            style={inputStyle}
          />
        </div>

        {/* ===================================== */}
        {/* DESCRIPTION */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Description</strong>
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write the complete problem description..."
            rows="6"
            required
            style={inputStyle}
          />
        </div>

        {/* ===================================== */}
        {/* DIFFICULTY */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Difficulty</strong>
          </label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>
          </select>
        </div>

        {/* ===================================== */}
        {/* TOPICS */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Topics</strong>
          </label>

          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="Array, Hash Table, Two Pointer"
            style={inputStyle}
          />

          <small>
            Separate topics using commas.
          </small>
        </div>

        {/* ===================================== */}
        {/* CONSTRAINTS */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Constraints</strong>
          </label>

          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            placeholder={`Example:
2 <= nums.length <= 10000
-10^9 <= nums[i] <= 10^9`}
            rows="5"
            style={inputStyle}
          />

          <small>
            Write each constraint on a new line.
          </small>
        </div>

        {/* ===================================== */}
        {/* STARTER CODE */}
        {/* ===================================== */}

        <div style={fieldStyle}>
          <label>
            <strong>Starter Code</strong>
          </label>

          <textarea
            name="starterCode"
            value={formData.starterCode}
            onChange={handleChange}
            placeholder="Write starter code..."
            rows="10"
            style={{
              ...inputStyle,
              fontFamily: "monospace",
            }}
          />
        </div>

        {/* ===================================== */}
        {/* EXAMPLES */}
        {/* ===================================== */}

        <div
          style={{
            marginTop: "35px",
          }}
        >
          <h2>Examples</h2>

          <p
            style={{
              color: "#666",
              marginBottom: "15px",
            }}
          >
            Add examples that users will see on the
            problem page.
          </p>

          {examples.map((example, index) => (
            <div
              key={index}
              style={exampleCardStyle}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  Example {index + 1}
                </h3>

                {examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeExample(index)
                    }
                    style={deleteButtonStyle}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Example Input */}
              <div style={fieldStyle}>
                <label>
                  <strong>Input</strong>
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
                  rows="3"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Example Output */}
              <div style={fieldStyle}>
                <label>
                  <strong>Output</strong>
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
                  rows="3"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Explanation */}
              <div style={fieldStyle}>
                <label>
                  <strong>Explanation</strong>
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
                  rows="4"
                  style={inputStyle}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExample}
            style={addButtonStyle}
          >
            + Add Example
          </button>
        </div>

        {/* ===================================== */}
        {/* TEST CASES */}
        {/* ===================================== */}

        <div
          style={{
            marginTop: "35px",
          }}
        >
          <h2>Test Cases</h2>

          <p
            style={{
              color: "#666",
              marginBottom: "15px",
            }}
          >
            Test cases are used to evaluate submitted
            code.
          </p>

          {testCases.map((testCase, index) => (
            <div
              key={index}
              style={testCaseCardStyle}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  Test Case {index + 1}
                </h3>

                {testCases.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeTestCase(index)
                    }
                    style={deleteButtonStyle}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Input */}
              <div style={fieldStyle}>
                <label>
                  <strong>Input</strong>
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
                  rows="3"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Expected Output */}
              <div style={fieldStyle}>
                <label>
                  <strong>
                    Expected Output
                  </strong>
                </label>

                <input
                  type="text"
                  value={
                    testCase.expectedOutput
                  }
                  onChange={(e) =>
                    handleTestCaseChange(
                      index,
                      "expectedOutput",
                      e.target.value
                    )
                  }
                  placeholder="[0,1]"
                  required
                  style={inputStyle}
                />
              </div>

              {/* Hidden */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "15px",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    testCase.isHidden
                  }
                  onChange={(e) =>
                    handleTestCaseChange(
                      index,
                      "isHidden",
                      e.target.checked
                    )
                  }
                />

                Hidden Test Case
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addTestCase}
            style={addButtonStyle}
          >
            + Add Test Case
          </button>
        </div>

        {/* ===================================== */}
        {/* SUBMIT */}
        {/* ===================================== */}

        <div
          style={{
            marginTop: "35px",
            marginBottom: "50px",
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              ...submitButtonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Problem..."
              : "Create Problem"}
          </button>
        </div>
      </form>
    </div>
  );
};

// =============================================
// Styles
// =============================================

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "20px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  width: "100%",
  boxSizing: "border-box",
};

const exampleCardStyle = {
  border: "1px solid #d1d5db",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  background: "#fafafa",
};

const testCaseCardStyle = {
  border: "1px solid #d1d5db",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  background: "#fafafa",
};

const addButtonStyle = {
  padding: "10px 16px",
  border: "1px solid #2563eb",
  background: "#fff",
  color: "#2563eb",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

const deleteButtonStyle = {
  padding: "8px 14px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const submitButtonStyle = {
  padding: "14px 25px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
};

export default CreateProblem;
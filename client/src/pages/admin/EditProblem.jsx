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

  // -----------------------------
  // Examples
  // -----------------------------
  const [examples, setExamples] = useState([
    {
      input: "",
      output: "",
      explanation: "",
    },
  ]);

  // -----------------------------
  // Test Cases
  // -----------------------------
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

  // =========================================
  // FETCH EXISTING PROBLEM
  // =========================================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/problems/${id}`
        );

        const problem = response.data.problem;

        // -----------------------------
        // Basic Problem Data
        // -----------------------------
        setFormData({
          title: problem.title || "",
          description: problem.description || "",
          difficulty:
            problem.difficulty || "Easy",

          topics:
            problem.topics?.join(", ") || "",

          constraints:
            problem.constraints?.join("\n") || "",

          starterCode:
            problem.starterCode || "",
        });

        // -----------------------------
        // Existing Examples
        // -----------------------------
        if (
          problem.example &&
          problem.example.length > 0
        ) {
          setExamples(
            problem.example.map((example) => ({
              input: example.input || "",
              output: example.output || "",
              explanation:
                example.explanation || "",
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

        // -----------------------------
        // Existing Test Cases
        // -----------------------------
        if (
          problem.testCases &&
          problem.testCases.length > 0
        ) {
          setTestCases(
            problem.testCases.map((testCase) => ({
              input: testCase.input || "",
              expectedOutput:
                testCase.expectedOutput || "",
              isHidden:
                Boolean(testCase.isHidden),
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
        console.error(
          "Fetch Problem Error:",
          error
        );

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

  // =========================================
  // BASIC FORM CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // EXAMPLE FUNCTIONS
  // =========================================

  const handleExampleChange = (
    index,
    field,
    value
  ) => {
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
      alert(
        "At least one example is required"
      );
      return;
    }

    setExamples((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // TEST CASE FUNCTIONS
  // =========================================

  const handleTestCaseChange = (
    index,
    field,
    value
  ) => {
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
      alert(
        "At least one test case is required"
      );
      return;
    }

    setTestCases((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // UPDATE PROBLEM
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      // -----------------------------
      // Validate Examples
      // -----------------------------
      const validExamples = examples.filter(
        (example) =>
          example.input.trim() ||
          example.output.trim() ||
          example.explanation.trim()
      );

      // -----------------------------
      // Validate Test Cases
      // -----------------------------
      const validTestCases =
        testCases.filter(
          (testCase) =>
            testCase.input.trim() &&
            testCase.expectedOutput.trim()
        );

      if (validExamples.length === 0) {
        setError(
          "Please add at least one example."
        );
        setUpdating(false);
        return;
      }

      if (validTestCases.length === 0) {
        setError(
          "Please add at least one valid test case."
        );
        setUpdating(false);
        return;
      }

      // -----------------------------
      // Problem Data
      // -----------------------------
      const problemData = {
        title: formData.title.trim(),

        description:
          formData.description.trim(),

        difficulty: formData.difficulty,

        topics: formData.topics
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),

        constraints:
          formData.constraints
            .split("\n")
            .map((constraint) =>
              constraint.trim()
            )
            .filter(Boolean),

        starterCode:
          formData.starterCode,

        // IMPORTANT:
        // Backend uses "example"
        example: validExamples,

        testCases: validTestCases,
      };

      await api.put(
        `/problems/${id}`,
        problemData
      );

      alert(
        "Problem updated successfully 🎉"
      );

      navigate("/admin/problems");
    } catch (error) {
      console.error(
        "Update Problem Error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update problem"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={loadingStyle}>
        <h2>Loading problem...</h2>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !formData.title) {
    return (
      <div style={loadingStyle}>
        <h2>{error}</h2>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div style={containerStyle}>
      <h1>Edit Problem</h1>

      <p>
        Update your CodeArena coding problem.
      </p>

      {/* ERROR MESSAGE */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <div style={fieldStyle}>
          <label>
            <strong>Problem Title</strong>
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* ================================= */}
        {/* DESCRIPTION */}
        {/* ================================= */}

        <div style={fieldStyle}>
          <label>
            <strong>Description</strong>
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
            style={inputStyle}
          />
        </div>

        {/* ================================= */}
        {/* DIFFICULTY */}
        {/* ================================= */}

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

        {/* ================================= */}
        {/* TOPICS */}
        {/* ================================= */}

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
            Separate topics with commas.
          </small>
        </div>

        {/* ================================= */}
        {/* CONSTRAINTS */}
        {/* ================================= */}

        <div style={fieldStyle}>
          <label>
            <strong>Constraints</strong>
          </label>

          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            rows="5"
            style={inputStyle}
          />

          <small>
            Write each constraint on a new line.
          </small>
        </div>

        {/* ================================= */}
        {/* STARTER CODE */}
        {/* ================================= */}

        <div style={fieldStyle}>
          <label>
            <strong>Starter Code</strong>
          </label>

          <textarea
            name="starterCode"
            value={formData.starterCode}
            onChange={handleChange}
            rows="10"
            style={{
              ...inputStyle,
              fontFamily: "monospace",
            }}
          />
        </div>

        {/* ================================= */}
        {/* EXAMPLES */}
        {/* ================================= */}

        <div style={sectionStyle}>
          <h2>Examples</h2>

          <p style={mutedTextStyle}>
            These examples are visible to users
            on the problem page.
          </p>

          {examples.map(
            (example, index) => (
              <div
                key={index}
                style={cardStyle}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>
                    Example {index + 1}
                  </h3>

                  {examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeExample(index)
                      }
                      style={
                        deleteButtonStyle
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Input */}

                <div style={fieldStyle}>
                  <label>
                    <strong>
                      Input
                    </strong>
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
                    rows="3"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Output */}

                <div style={fieldStyle}>
                  <label>
                    <strong>
                      Output
                    </strong>
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
                    rows="3"
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Explanation */}

                <div style={fieldStyle}>
                  <label>
                    <strong>
                      Explanation
                    </strong>
                  </label>

                  <textarea
                    value={
                      example.explanation
                    }
                    onChange={(e) =>
                      handleExampleChange(
                        index,
                        "explanation",
                        e.target.value
                      )
                    }
                    rows="4"
                    placeholder="Explain the example..."
                    style={inputStyle}
                  />
                </div>
              </div>
            )
          )}

          <button
            type="button"
            onClick={addExample}
            style={addButtonStyle}
          >
            + Add Example
          </button>
        </div>

        {/* ================================= */}
        {/* TEST CASES */}
        {/* ================================= */}

        <div style={sectionStyle}>
          <h2>Test Cases</h2>

          <p style={mutedTextStyle}>
            These test cases are used to
            evaluate submitted code.
          </p>

          {testCases.map(
            (testCase, index) => (
              <div
                key={index}
                style={cardStyle}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>
                    Test Case {index + 1}
                  </h3>

                  {testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeTestCase(index)
                      }
                      style={
                        deleteButtonStyle
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Input */}

                <div style={fieldStyle}>
                  <label>
                    <strong>
                      Input
                    </strong>
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
                    required
                    style={inputStyle}
                  />
                </div>

                {/* Hidden */}

                <label
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
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
            )
          )}

          <button
            type="button"
            onClick={addTestCase}
            style={addButtonStyle}
          >
            + Add Test Case
          </button>
        </div>

        {/* ================================= */}
        {/* SAVE */}
        {/* ================================= */}

        <div
          style={{
            marginTop: "35px",
            marginBottom: "50px",
          }}
        >
          <button
            type="submit"
            disabled={updating}
            style={{
              ...submitButtonStyle,
              opacity: updating ? 0.7 : 1,
              cursor: updating
                ? "not-allowed"
                : "pointer",
            }}
          >
            {updating
              ? "Updating Problem..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

// =============================================
// STYLES
// =============================================

const containerStyle = {
  padding: "30px",
  maxWidth: "900px",
  margin: "auto",
};

const loadingStyle = {
  padding: "40px",
  textAlign: "center",
};

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

const sectionStyle = {
  marginTop: "35px",
};

const cardStyle = {
  border: "1px solid #d1d5db",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  background: "#fafafa",
};

const mutedTextStyle = {
  color: "#666",
};

const errorStyle = {
  marginTop: "15px",
  padding: "12px",
  borderRadius: "8px",
  background: "#fee2e2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
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

export default EditProblem;
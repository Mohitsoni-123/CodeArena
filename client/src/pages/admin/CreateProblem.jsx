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

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...testCases];

    updatedTestCases[index][field] = value;

    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
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

    setTestCases(
      testCases.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const problemData = {
        title: formData.title,
        description: formData.description,
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

        testCases,
      };

      await api.post("/problems", problemData);

      alert("Problem created successfully 🎉");

      navigate("/admin/problems");

    } catch (error) {
      console.error("Create Problem Error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to create problem"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1>Create New Problem</h1>

      <p>Add a new coding problem to CodeArena.</p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        {/* TITLE */}
        <div style={fieldStyle}>
          <label>Problem Title</label>

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

        {/* DESCRIPTION */}
        <div style={fieldStyle}>
          <label>Description</label>

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

        {/* DIFFICULTY */}
        <div style={fieldStyle}>
          <label>Difficulty</label>

          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* TOPICS */}
        <div style={fieldStyle}>
          <label>Topics</label>

          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="Array, Hash Table, Two Pointer"
            style={inputStyle}
          />

          <small>Separate topics using commas.</small>
        </div>

        {/* CONSTRAINTS */}
        <div style={fieldStyle}>
          <label>Constraints</label>

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

          <small>Write each constraint on a new line.</small>
        </div>

        {/* STARTER CODE */}
        <div style={fieldStyle}>
          <label>Starter Code</label>

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

        {/* TEST CASES */}
        <div style={{ marginTop: "30px" }}>
          <h2>Test Cases</h2>

          {testCases.map((testCase, index) => (
            <div
              key={index}
              style={{
                border: "1px solid gray",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <h3>Test Case {index + 1}</h3>

              <div style={fieldStyle}>
                <label>Input</label>

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

              <div style={fieldStyle}>
                <label>Expected Output</label>

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
                  style={inputStyle}
                />
              </div>

              <label>
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
                />

                {" "}Hidden Test Case
              </label>

              <br />
              <br />

              <button
                type="button"
                onClick={() => removeTestCase(index)}
                style={deleteButtonStyle}
              >
                Remove Test Case
              </button>
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

        <br />

        <button
          type="submit"
          disabled={loading}
          style={submitButtonStyle}
        >
          {loading
            ? "Creating Problem..."
            : "Create Problem"}
        </button>

      </form>
    </div>
  );
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
  border: "1px solid gray",
  fontSize: "15px",
};

const addButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
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
  cursor: "pointer",
  fontSize: "16px",
};

export default CreateProblem;
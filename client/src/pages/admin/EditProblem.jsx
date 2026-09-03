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

  const [testCases, setTestCases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing problem
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);

        const problem = response.data.problem;

        setFormData({
          title: problem.title || "",
          description: problem.description || "",
          difficulty: problem.difficulty || "Easy",
          topics: problem.topics?.join(", ") || "",
          constraints: problem.constraints?.join("\n") || "",
          starterCode: problem.starterCode || "",
        });

        setTestCases(
          problem.testCases?.map((testCase) => ({
            input: testCase.input || "",
            expectedOutput: testCase.expectedOutput || "",
            isHidden: testCase.isHidden || false,
          })) || []
        );
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    setTestCases((prev) =>
      prev.map((testCase, i) =>
        i === index
          ? { ...testCase, [field]: value }
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
      setUpdating(true);
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

      await api.put(`/problems/${id}`, problemData);

      alert("Problem updated successfully 🎉");

      navigate("/admin/problems");
    } catch (error) {
      console.error("Update Problem Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update problem"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <h2>Loading problem...</h2>;
  }

  if (error && !formData.title) {
    return <h2>{error}</h2>;
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1>Edit Problem</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <div style={fieldStyle}>
          <label>Problem Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
            style={inputStyle}
          />
        </div>

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

        <div style={fieldStyle}>
          <label>Topics</label>

          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="Array, Hash Table"
            style={inputStyle}
          />

          <small>Separate topics with commas.</small>
        </div>

        <div style={fieldStyle}>
          <label>Constraints</label>

          <textarea
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
            rows="5"
            style={inputStyle}
          />

          <small>Write each constraint on a new line.</small>
        </div>

        <div style={fieldStyle}>
          <label>Starter Code</label>

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
                  required
                  style={inputStyle}
                />
              </div>

              <label style={{ marginTop: "15px" }}>
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
          disabled={updating}
          style={submitButtonStyle}
        >
          {updating
            ? "Updating Problem..."
            : "Save Changes"}
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

export default EditProblem;
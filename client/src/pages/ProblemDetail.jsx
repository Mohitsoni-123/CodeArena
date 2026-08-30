import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProblemDetail() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //code editor states
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const [stdin, setStdin] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${id}`);

        setProblem(response.data.problem);

        setCode(response.data.problem.starterCode || "");
      } catch (error) {
        console.error("Fetch Problem Error:", error);
        setError("Failed to fetch problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRunCode = async () => {
    try {
      setRunning(true);
      setOutput("");

      const response = await api.post("/submissions/run", {
        language,
        code,
        stdin,
      });

      setOutput(
        response.data.output ||
          response.data.stdout ||
          "Code executed successfully",
      );
    } catch (error) {
      console.error("Run Code Error:", error);

      setOutput(error.response?.data?.message || "Failed to run code");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmissionResult(null);

      const response = await api.post("/submissions", {
        problemId: problem._id,
        language,
        code,
      });

      setSubmissionResult(response.data);
    } catch (error) {
      console.error("Submit Error:", error);

      setSubmissionResult({
        error: error.response?.data?.message || "Failed to submit solution",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <h2>Loading problem...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!problem) {
    return <h2>Problem not found</h2>;
  }

  return (
    <div>
      <h1>{problem.title}</h1>

      <p>
        <strong>Difficulty:</strong> {problem.difficulty}
      </p>

      <p>
        <strong>Topics:</strong> {problem.topics?.join(", ")}
      </p>

      <hr />

      <h2>Description</h2>
      <p>{problem.description}</p>

      <h2>Constraints</h2>

      <ul>
        {problem.constraints?.map((constraint, index) => (
          <li key={index}>{constraint}</li>
        ))}
      </ul>

      <hr />

      <h2>Code Editor</h2>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      <br />
      <br />

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows="20"
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: "16px",
          padding: "15px",
          boxSizing: "border-box",
        }}
      />

      <h3>Custom Input</h3>

      <textarea
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        placeholder="Enter input here..."
        rows="5"
        style={{
          width: "100%",
          padding: "10px",
          fontFamily: "monospace",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <button onClick={handleRunCode} disabled={running}>
        {running ? "Running..." : "Run Code"}
      </button>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginLeft: "10px",
        }}
      >
        {submitting ? "Submitting..." : "Submit Solution"}
      </button>

      {submissionResult && (
        <div style={{ marginTop: "20px" }}>
          <h3>Submission Result</h3>

          {submissionResult.error ? (
            <p>{submissionResult.error}</p>
          ) : (
            <>
              <p>
                <strong>Status:</strong> {submissionResult.status}
              </p>

              <p>
                <strong>Passed Test Cases:</strong>{" "}
                {submissionResult.passedTestCases} /{" "}
                {submissionResult.totalTestCases}
              </p>
            </>
          )}
        </div>
      )}

      {output && (
        <div style={{ marginTop: "20px" }}>
          <h3>Output</h3>

          <pre
            style={{
              padding: "15px",
              border: "1px solid gray",
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </pre>
        </div>
      )}

      {/* <h2>Starter Code</h2>

            <pre>
                <code>{problem.starterCode}</code>
            </pre> */}
    </div>
  );
}

export default ProblemDetail;

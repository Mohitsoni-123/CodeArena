import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProblemDetail() {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setSubmissionResult(null);

      const response = await api.post("/submissions/run", {
        language,
        code,
        stdin,
      });

      const data = response.data;

      if (data.error) {
        setOutput(`${data.status || "Execution Error"}\n\n${data.error}`);
      } else {
        setOutput(data.output || "No output");
      }
    } catch (error) {
      console.error("Run Code Error:", error);

      setOutput(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to run code",
      );
    } finally {
      setRunning(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-400";

      case "Wrong Answer":
        return "text-red-400";

      case "Compilation Error":
        return "text-yellow-400";

      case "Runtime Error":
        return "text-red-400";

      case "Time Limit Exceeded":
        return "text-orange-400";

      default:
        return "text-gray-400";
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

      const backendError = error.response?.data?.error;

      let errorMessage = "Failed to submit solution";

      if (typeof backendError === "string") {
        errorMessage = backendError;
      } else if (backendError?.message) {
        errorMessage = backendError.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setSubmissionResult({
        status: error.response?.data?.status || "Submission Failed",

        error: errorMessage,

        passedTestCases: error.response?.data?.passedTestCases || 0,

        totalTestCases: error.response?.data?.totalTestCases || 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="problem-detail-page loading-page">
        <h2>Loading problem...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="problem-detail-page loading-page">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="problem-detail-page loading-page">
        <h2>Problem not found</h2>
      </div>
    );
  }

  return (
    <div className="problem-detail-page">
      {/* Problem Header */}

      <div className="problem-detail-header">
        <div>
          <p className="page-tag">CODING CHALLENGE</p>

          <h1>{problem.title}</h1>

          <div className="problem-meta">
            <span
              className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}
            >
              {problem.difficulty}
            </span>

            <div className="topics">
              {problem.topics?.map((topic, index) => (
                <span className="topic-tag" key={index}>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="problem-workspace">
        {/* Left Side - Problem */}

        <div className="problem-panel">
          <section className="problem-section">
            <h2>Description</h2>

            <p className="problem-description">{problem.description}</p>
          </section>

          {problem.constraints?.length > 0 && (
            <section className="problem-section">
              <h2>Constraints</h2>

              <ul className="constraints-list">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </section>
          )}

          {problem.example?.length > 0 && (
            <section className="problem-section">
              <h2>Examples</h2>

              <div className="examples-list">
                {problem.example.map((example, index) => (
                  <div className="example-card" key={index}>
                    <h3>Example {index + 1}</h3>

                    <div className="example-content">
                      <div className="example-item">
                        <span>Input</span>

                        <pre>{example.input}</pre>
                      </div>

                      <div className="example-item">
                        <span>Output</span>

                        <pre>{example.output}</pre>
                      </div>

                      {example.explanation && (
                        <div className="example-item">
                          <span>Explanation</span>

                          <p>{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Side - Editor */}

        <div className="editor-panel">
          <div className="editor-header">
            <div className="editor-title">
              <span className="editor-dot"></span>
              Code Editor
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-editor"
            spellCheck="false"
          />

          <div className="input-section">
            <div className="input-label">
              <h3>Custom Input</h3>
              <span>Optional</span>
            </div>

            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input here..."
              rows="5"
              className="custom-input"
              spellCheck="false"
            />
          </div>

          <div className="editor-actions">
            <button
              className="run-btn"
              onClick={handleRunCode}
              disabled={running}
            >
              {running ? "Running..." : "▶ Run Code"}
            </button>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Solution →"}
            </button>
          </div>

          {/* Output */}

          {output && (
            <div className="output-section">
              <h3>Output</h3>

              <pre className="output-box">{output}</pre>
            </div>
          )}

          {/* Submission Result */}

          {submissionResult && (
            <div className="mt-6 rounded-xl border border-gray-700 bg-gray-900 p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Submission Result
                  </h3>

                  <p
                    className={`mt-1 text-xl font-bold ${getStatusClass(
                      submissionResult.status,
                    )}`}
                  >
                    {submissionResult.status || "Unknown"}
                  </p>
                </div>

                {submissionResult.passedTestCases !== undefined && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Test Cases</p>

                    <p className="text-lg font-semibold text-white">
                      {submissionResult.passedTestCases} /{" "}
                      {submissionResult.totalTestCases}
                    </p>
                  </div>
                )}
              </div>

              {/* Error */}
              {submissionResult.error && (
                <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <p className="mb-2 font-semibold text-red-400">Error</p>

                  <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-red-300">
                    {submissionResult.error}
                  </pre>
                </div>
              )}

              {/* Test Cases */}
              {submissionResult.testCaseResults?.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-white">Test Cases</h4>

                  <div className="space-y-2">
                    {submissionResult.testCaseResults.map((testCase, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={
                              testCase.passed
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {testCase.passed ? "✓" : "✗"}
                          </span>

                          <span className="text-gray-200">
                            Test Case {index + 1}
                          </span>
                        </div>

                        <span
                          className={
                            testCase.passed ? "text-green-400" : "text-red-400"
                          }
                        >
                          {testCase.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Runtime / Memory */}
              {(submissionResult.runtime !== undefined ||
                submissionResult.memory !== undefined) && (
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {submissionResult.runtime !== undefined && (
                    <div className="rounded-lg bg-gray-800 p-4">
                      <p className="text-sm text-gray-400">Runtime</p>

                      <p className="mt-1 font-semibold text-white">
                        {submissionResult.runtime || 0}
                      </p>
                    </div>
                  )}

                  {submissionResult.memory !== undefined && (
                    <div className="rounded-lg bg-gray-800 p-4">
                      <p className="text-sm text-gray-400">Memory</p>

                      <p className="mt-1 font-semibold text-white">
                        {submissionResult.memory || 0}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;

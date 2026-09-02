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

            const response = await api.post("/submissions/run", {
                language,
                code,
                stdin,
            });

            setOutput(
                response.data.output ||
                response.data.stdout ||
                "Code executed successfully"
            );

        } catch (error) {
            console.error("Run Code Error:", error);

            setOutput(
                error.response?.data?.message ||
                "Failed to run code"
            );
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
                error:
                    error.response?.data?.message ||
                    "Failed to submit solution",
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
                    <p className="page-tag">
                        CODING CHALLENGE
                    </p>

                    <h1>{problem.title}</h1>

                    <div className="problem-meta">

                        <span
                            className={`difficulty-badge ${problem.difficulty?.toLowerCase()}`}
                        >
                            {problem.difficulty}
                        </span>

                        <div className="topics">
                            {problem.topics?.map((topic, index) => (
                                <span
                                    className="topic-tag"
                                    key={index}
                                >
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

                        <p className="problem-description">
                            {problem.description}
                        </p>
                    </section>

                    {problem.constraints?.length > 0 && (
                        <section className="problem-section">
                            <h2>Constraints</h2>

                            <ul className="constraints-list">
                                {problem.constraints.map(
                                    (constraint, index) => (
                                        <li key={index}>
                                            {constraint}
                                        </li>
                                    )
                                )}
                            </ul>
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
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                            className="language-select"
                        >
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="python">Python</option>
                            <option value="javascript">
                                JavaScript
                            </option>
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
                            {running
                                ? "Running..."
                                : "▶ Run Code"}
                        </button>

                        <button
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Solution →"}
                        </button>

                    </div>

                    {/* Output */}

                    {output && (
                        <div className="output-section">

                            <h3>Output</h3>

                            <pre className="output-box">
                                {output}
                            </pre>

                        </div>
                    )}

                    {/* Submission Result */}

                    {submissionResult && (
                        <div className="submission-result">

                            <h3>Submission Result</h3>

                            {submissionResult.error ? (
                                <p className="result-error">
                                    {submissionResult.error}
                                </p>
                            ) : (
                                <div className="result-info">

                                    <div>
                                        <span>Status</span>

                                        <strong
                                            className={
                                                submissionResult.status ===
                                                "Accepted"
                                                    ? "status-accepted"
                                                    : "status-wrong"
                                            }
                                        >
                                            {submissionResult.status}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Passed</span>

                                        <strong>
                                            {submissionResult.passedTestCases}
                                            {" / "}
                                            {submissionResult.totalTestCases}
                                        </strong>
                                    </div>

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
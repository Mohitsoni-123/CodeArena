import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const SubmissionDetail = () => {
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.get(`/submissions/${id}`);

        setSubmission(response.data.submission);
      } catch (error) {
        console.error("Fetch Submission Error:", error);

        setError("Failed to fetch submission");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  const getStatusClass = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "accepted") {
      return "accepted";
    }

    if (normalizedStatus === "wrong answer") {
      return "wrong-answer";
    }

    if (normalizedStatus === "runtime error") {
      return "runtime-error";
    }

    if (normalizedStatus === "compilation error") {
      return "compilation-error";
    }

    return "pending";
  };

  const formatLanguage = (language) => {
    const languages = {
      cpp: "C++",
      c: "C",
      python: "Python",
      javascript: "JavaScript",
    };

    return languages[language] || language;
  };

  if (loading) {
    return (
      <div className="submission-detail-page loading-page">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Loading submission...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submission-detail-page loading-page">
        <div className="error-state">
          <h2>Something went wrong</h2>

          <p>{error}</p>

          <Link to="/submissions" className="back-to-problems">
            ← Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="submission-detail-page loading-page">
        <div className="error-state">
          <h2>Submission not found</h2>

          <Link to="/submissions" className="back-to-problems">
            ← Back to Submissions
          </Link>
        </div>
      </div>
    );
  }
  return (
    // <div style={{ padding: "30px" }}>
    //         <h1>Submission Details</h1>

    //         <h2>
    //             {submission.problem?.title || "Problem"}
    //         </h2>

    //         <p>
    //             <strong>Status:</strong>{" "}
    //             {submission.status}
    //         </p>

    //         <p>
    //             <strong>Language:</strong>{" "}
    //             {submission.language}
    //         </p>

    //         <p>
    //             <strong>Test Cases Passed:</strong>{" "}
    //             {submission.testCasesPassed} /{" "}
    //             {submission.totalTestCases}
    //         </p>

    //         <p>
    //             <strong>Runtime:</strong>{" "}
    //             {submission.runtime} ms
    //         </p>

    //         <p>
    //             <strong>Memory:</strong>{" "}
    //             {submission.memory} KB
    //         </p>

    //         {submission.error && (
    //             <div>
    //                 <h3>Error</h3>

    //                 <pre>
    //                     {submission.error}
    //                 </pre>
    //             </div>
    //         )}

    //         <h2>Submitted Code</h2>

    //         <pre
    //             style={{
    //                 border: "1px solid gray",
    //                 padding: "20px",
    //                 overflowX: "auto",
    //                 whiteSpace: "pre-wrap"
    //             }}
    //         >
    //             <code>{submission.code}</code>
    //         </pre>
    // </div>

    <div className="submission-detail-page">
      {/* Header */}
      <div className="submission-detail-header">
        <div className="submission-header-content">
          <div>
            <Link to="/submissions" className="back-link">
              ← Back to My Submissions
            </Link>
            <p className="page-tag">SUBMISSION DETAILS</p>
            <h1>{submission.problem?.title || "Problem"}</h1>
            <div className="submission-meta">
              <span
                className={`status-badge ${getStatusClass(submission.status)}`}
              >
                {submission.status}
              </span>
              <span className="language-badge">
                {formatLanguage(submission.language)}
              </span>
            </div>
          </div>

          <Link to="/problems" className="solve-more-btn">
            + Solve More
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="submission-detail-container">
        {/* Statistics */}
        <div className="submission-stats">
          <div className="stat-card">
            <span className="stat-label">Test Cases</span>
            <strong>
              {submission.testCasesPassed || 0}
              <span>
                {" / "}
                {submission.totalTestCases || 0}
              </span>
            </strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Runtime</span>

            <strong>
              {submission.runtime ?? 0}
              <span> ms</span>
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Memory</span>

            <strong>
              {submission.memory ?? 0}
              <span> KB</span>
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Submitted</span>

            <strong className="date-stat">
              {submission.createdAt
                ? new Date(submission.createdAt).toLocaleString()
                : "N/A"}
            </strong>
          </div>
        </div>

        {/* Error */}

        {submission.error && (
          <div className="submission-error-box">
            <div className="submission-error-header">
              <span>⚠</span>
              <h2>Execution Error</h2>
            </div>

            <pre>{submission.error}</pre>
          </div>
        )}

        {/* Submitted Code */}

        <div className="submitted-code-card">
          <div className="submitted-code-header">
            <div>
              <span className="code-status-dot"></span>
              Submitted Code
            </div>

            <span>{formatLanguage(submission.language)}</span>
          </div>

          <pre className="submitted-code-box">
            <code>{submission.code}</code>
          </pre>
        </div>

        {/* Bottom Actions */}

        <div className="submission-actions">
          <Link to="/submissions" className="secondary-action-btn">
            ← All Submissions
          </Link>

          {submission.problem?._id && (
            <Link
              to={`/problems/${submission.problem._id}`}
              className="primary-action-btn"
            >
              Try Problem Again →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;

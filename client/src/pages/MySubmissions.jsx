import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/submissions/my");

        setSubmissions(response.data.submissions || []);
      } catch (error) {
        console.error("Fetch Submissions Error:", error);
        setError("Failed to fetch submission");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

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
      <div className="submissions-page loading-page">
        <div className="loading-content">
          <div className="spinner"></div>
          <h2>Loading submissions...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="submissions-page loading-page">
        <div className="error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <Link to="/problems" className="back-to-problems">
            ← Go to Problems
          </Link>
        </div>
      </div>
    );
  }
  return (
    // <div style={{ padding: "30px" }}>
    //   <h1>My Submissions</h1>
    //   {submissions.length === 0 ? (
    //     <p>No submissions found.</p>
    //   ) : (
    //     <table
    //       style={{
    //         width: "100%",
    //         borderCollapse: "collapse",
    //         marginTop: "20px",
    //       }}
    //     >
    //       <thead>
    //         <tr>
    //           <th style={{ border: "1px solid gray", padding: "10px" }}>
    //             Problem
    //           </th>
    //           <th style={{ border: "1px solid gray", padding: "10px" }}>
    //             Language
    //           </th>

    //           <th style={{ border: "1px solid gray", padding: "10px" }}>
    //             Status
    //           </th>
    //           <th style={{ border: "1px solid gray", padding: "10px" }}>
    //             Test Cases
    //           </th>
    //           <th style={{ border: "1px solid gray", padding: "10px" }}>
    //             Submitted At
    //           </th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {submissions.map((submission) => (
    //           <tr key={submission._id}>
    //             <td style={{ border: "1px solid gray", padding: "10px" }}>
    //               <Link to={`/submissions/${submission._id}`}>
    //                 {submission.problem?.title || "Deleted Problem"}
    //               </Link>
    //             </td>

    //             <td style={{ border: "1px solid gray", padding: "10px" }}>
    //               {submission.language}
    //             </td>

    //             <td style={{ border: "1px solid gray", padding: "10px" }}>
    //               {submission.status}
    //             </td>

    //             <td style={{ border: "1px solid gray", padding: "10px" }}>
    //               {submission.testCasesPassed || 0} /{" "}
    //               {submission.totalTestCases || 0}
    //             </td>

    //             <td style={{ border: "1px solid gray", padding: "10px" }}>
    //               {new Date(submission.createdAt).toLocaleString()}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   )}
    // </div>

    <div className="submissions-page">
      <div className="submissions-header">
        <div>
          <p className="page-tag">SUBMISSION HISTORY</p>
          <h1>My Submissions</h1>
          <p>Track your coding solutions and monitor your progress</p>
        </div>

        <Link to="/problems" className="solve-more-btn">
          + Solve More Problems
        </Link>
      </div>
      <div className="submissions-container">
        {submissions.length === 0 ? (
          <div className="empty-submissions">
            <div className="empty-icon">&lt;/&gt;</div>
            <h2>No submissions yet</h2>

            <p>
              Start solving coding problems and your submissions will appear
              here.
            </p>
            <Link to="/problems" className="start-solving-btn">
              Start Solving →
            </Link>
          </div>
        ) : (
          <div className="submissions-card">
            <div className="submissions-card-header">
              <div>
                <h2>All Submissions</h2>
                <p>
                  {submissions.length} submission
                  {submissions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Test Cases</th>
                    <th>Submitted At</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission._id}>
                      <td>
                        <div className="problem-name-cell">
                          <span className="code-icon">{"</>"}</span>
                          <strong>
                            {submission.problem?.title || "Deleted Problem"}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="language-badge">
                          {formatLanguage(submission.language)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            submission.status,
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>

                      <td>
                        <div className="testcase-result">
                          <strong>{submission.testCasesPassed || 0}</strong>

                          <span>/ {submission.totalTestCases || 0}</span>
                        </div>
                      </td>

                      <td className="date-cell">
                        {submission.createdAt
                          ? new Date(submission.createdAt).toLocaleString()
                          : "N/A"}
                      </td>

                      <td>
                        <Link
                          to={`/submissions/${submission._id}`}
                          className="view-details-btn"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;

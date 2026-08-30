import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import api from "../services/api";

const SubmissionDetail = () => {
    const { id } = useParams();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await api.get(
                    `/submissions/${id}`
                );

                setSubmission(response.data.submission);
            } catch (error) {
                console.error(
                    "Fetch Submission Error:",
                    error
                );

                setError("Failed to fetch submission");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id]);

    if (loading) {
        return <h2>Loading submission...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!submission) {
        return <h2>Submission not found</h2>;
    }
  return (
    <div style={{ padding: "30px" }}>
            <h1>Submission Details</h1>

            <h2>
                {submission.problem?.title || "Problem"}
            </h2>

            <p>
                <strong>Status:</strong>{" "}
                {submission.status}
            </p>

            <p>
                <strong>Language:</strong>{" "}
                {submission.language}
            </p>

            <p>
                <strong>Test Cases Passed:</strong>{" "}
                {submission.testCasesPassed} /{" "}
                {submission.totalTestCases}
            </p>

            <p>
                <strong>Runtime:</strong>{" "}
                {submission.runtime} ms
            </p>

            <p>
                <strong>Memory:</strong>{" "}
                {submission.memory} KB
            </p>

            {submission.error && (
                <div>
                    <h3>Error</h3>

                    <pre>
                        {submission.error}
                    </pre>
                </div>
            )}

            <h2>Submitted Code</h2>

            <pre
                style={{
                    border: "1px solid gray",
                    padding: "20px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap"
                }}
            >
                <code>{submission.code}</code>
            </pre>
        </div>
  )
}

export default SubmissionDetail

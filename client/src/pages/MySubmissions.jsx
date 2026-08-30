import { useEffect, useState } from "react";

import api from "../services/api";
const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(()=>{
        const fetchSubmissions = async () => {
            try {
                const response = await api.get("/submissions/my");

                setSubmissions(response.data.submissions || []);
            } catch (error) {
                console.error(
                    "Fetch Submissions Error:", 
                    error
                );
                setError("Failed to fetch submission");
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (loading) {
        return <h2>Loading submissions...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }
  return (
    <div style={{ padding: "30px" }}>
            <h1>My Submissions</h1>

            {submissions.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px"
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid gray", padding: "10px" }}>
                                Problem
                            </th>

                            <th style={{ border: "1px solid gray", padding: "10px" }}>
                                Language
                            </th>

                            <th style={{ border: "1px solid gray", padding: "10px" }}>
                                Status
                            </th>

                            <th style={{ border: "1px solid gray", padding: "10px" }}>
                                Test Cases
                            </th>

                            <th style={{ border: "1px solid gray", padding: "10px" }}>
                                Submitted At
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {submissions.map((submission) => (
                            <tr key={submission._id}>
                                <td style={{ border: "1px solid gray", padding: "10px" }}>
                                    {submission.problem?.title || "Deleted Problem"}
                                </td>

                                <td style={{ border: "1px solid gray", padding: "10px" }}>
                                    {submission.language}
                                </td>

                                <td style={{ border: "1px solid gray", padding: "10px" }}>
                                    {submission.status}
                                </td>

                                <td style={{ border: "1px solid gray", padding: "10px" }}>
                                    {submission.testCasesPassed || 0} /{" "}
                                    {submission.totalTestCases || 0}
                                </td>

                                <td style={{ border: "1px solid gray", padding: "10px" }}>
                                    {new Date(
                                        submission.createdAt
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
  )
}

export default MySubmissions

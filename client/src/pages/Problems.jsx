import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await api.get("/problems");

                setProblems(response.data.problems || []);
            } catch (error) {
                console.error("Fetch Problems Error:", error);
                setError("Failed to fetch problems");
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    if (loading) {
        return <h2>Loading problems...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Coding Problems</h1>

            {problems.length === 0 ? (
                <p>No problems available.</p>
            ) : (
                problems.map((problem) => (
                    <div
                        key={problem._id}
                        style={{
                            border: "1px solid gray",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "10px"
                        }}
                    >
                        <h2>{problem.title}</h2>

                        <p>
                            <strong>Difficulty:</strong>{" "}
                            {problem.difficulty}
                        </p>

                        <p>
                            <strong>Topics:</strong>{" "}
                            {problem.topics?.join(", ")}
                        </p>

                        <Link to={`/problems/${problem._id}`}>
                            Solve Problem →
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}

export default Problems;
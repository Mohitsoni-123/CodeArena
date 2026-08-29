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

    const [output, setOutput]

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
                <strong>Difficulty:</strong>{" "}
                {problem.difficulty}
            </p>

            <p>
                <strong>Topics:</strong>{" "}
                {problem.topics?.join(", ")}
            </p>

            <hr />

            <h2>Description</h2>
            <p>{problem.description}</p>

            <h2>Constraints</h2>

            <ul>
                {problem.constraints?.map((constraint, index) => (
                    <li key={index}>
                        {constraint}
                    </li>
                ))}
            </ul>

            <hr />

            <h2>Code Editor</h2>

            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
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
                    boxSizing: "border-box"
                }}
            />


            {/* <h2>Starter Code</h2>

            <pre>
                <code>{problem.starterCode}</code>
            </pre> */}
        </div>
    );
}

export default ProblemDetail;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Problems() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");

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

    const filteredProblems = problems.filter((problem) => {
        const matchesSearch =
            problem.title
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            problem.topics?.some((topic) =>
                topic.toLowerCase().includes(search.toLowerCase())
            );

        const matchesDifficulty =
            difficulty === "All" ||
            problem.difficulty === difficulty;

        return matchesSearch && matchesDifficulty;
    });

    if (loading) {
        return (
            <div className="problems-page">
                <h2>Loading problems...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="problems-page">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        // <div>
        //     <h1>Coding Problems</h1>

        //     {problems.length === 0 ? (
        //         <p>No problems available.</p>
        //     ) : (
        //         problems.map((problem) => (
        //             <div
        //                 key={problem._id}
        //                 style={{
        //                     border: "1px solid gray",
        //                     padding: "20px",
        //                     marginBottom: "15px",
        //                     borderRadius: "10px"
        //                 }}
        //             >
        //                 <h2>{problem.title}</h2>

        //                 <p>
        //                     <strong>Difficulty:</strong>{" "}
        //                     {problem.difficulty}
        //                 </p>

        //                 <p>
        //                     <strong>Topics:</strong>{" "}
        //                     {problem.topics?.join(", ")}
        //                 </p>

        //                 <Link to={`/problems/${problem._id}`}>
        //                     Solve Problem →
        //                 </Link>
        //             </div>
        //         ))
        //     )}
        // </div>


        <div className="problems-page">
            <div className="problems-header">
                <div>
                    <p className="page-tag">
                        CODE. PRACTICE. IMPROVE.
                    </p>

                    <h1>Coding Problems</h1>
                    <p>
                        Practice Problem and improve your problem-solving skills
                    </p>
                </div>

                <div className="problem-count">
                    <span>{filteredProblems.length}</span>
                    <p>Problems</p>
                </div>
            </div>
            {/* Search and Filter */}
            <div className="problem-controls">
                <input
                    type="text"
                    placeholder="🔍 Search problems..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className="search-input"
                />

                <select
                    value={difficulty}
                    onChange={(e)=>setDifficulty(e.target.value)}
                    className="difficulty-filter"
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Problems List */}
            {
                filteredProblems.length === 0 ? (
                    <div className="no-problems">
                        <h3>No problems found 😕</h3>
                        <p>
                            Try changing your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="problems-grid">
                        {
                            filteredProblems.map((problem, index)=>(
                                <div className="problem-card" key={problem._id}>
                                    <div className="problem-top">
                                        <span className="problem-number">
                                            #{index + 1}
                                        </span>
                                        <span
                                            className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                    <h2>{problem.title}</h2>
                                    <div className="topics">
                                        {
                                            problem.topics?.map((topic, index)=>(
                                                <span
                                                    className="topic-tag"
                                                    key={index}
                                                >{topic}</span>
                                            ))
                                        }
                                    </div>
                                    <Link
                                        to={`/problems/${problem._id}`}
                                        className="solve-btn"
                                    >
                                        Solve Problem →
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>

    );
}

export default Problems;
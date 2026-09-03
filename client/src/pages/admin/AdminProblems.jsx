import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const response = await api.get("/problems");

      setProblems(response.data.problems || []);
    } catch (error) {
      console.error("Fetch Problems Error:", error);

      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/problems/${id}`);

      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== id)
      );

      alert("Problem deleted successfully");
    } catch (error) {
      console.error("Delete Problem Error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete problem"
      );
    }
  };

  if (loading) {
    return <h2>Loading problems...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Manage Problems</h1>

          <p>
            Total Problems: {problems.length}
          </p>
        </div>

        <Link
          to="/admin/problems/create"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          + Create Problem
        </Link>
      </div>

      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Difficulty</th>
              <th style={thStyle}>Topics</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem) => (
              <tr key={problem._id}>
                <td style={tdStyle}>
                  {problem.title}
                </td>

                <td style={tdStyle}>
                  {problem.difficulty}
                </td>

                <td style={tdStyle}>
                  {problem.topics?.join(", ")}
                </td>

                <td style={tdStyle}>
                  <Link
                    to={`/admin/problems/${problem._id}/edit`}
                    style={{
                      marginRight: "15px",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    ✏️ Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(
                        problem._id,
                        problem.title
                      )
                    }
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid gray",
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid gray",
  padding: "12px",
};

export default AdminProblems;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");

        setStats(response.data);
      } catch (error) {
        console.error("Fetch Admin Stats Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to fetch dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard 👨‍💼</h1>

      <p>Manage your CodeArena platform from one place.</p>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>👥 Total Users</h3>
          <h1>{stats.totalUsers}</h1>
        </div>

        <div style={cardStyle}>
          <h3>📝 Total Problems</h3>
          <h1>{stats.totalProblems}</h1>
        </div>

        <div style={cardStyle}>
          <h3>📤 Total Submissions</h3>
          <h1>{stats.totalSubmissions}</h1>
        </div>

        <div style={cardStyle}>
          <h3>✅ Accepted Submissions</h3>
          <h1>{stats.acceptedSubmissions}</h1>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <Link
            to="/admin/problems/create"
            style={primaryButtonStyle}
          >
            ➕ Create New Problem
          </Link>

          <Link
            to="/admin/problems"
            style={secondaryButtonStyle}
          >
            📝 Manage Problems
          </Link>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "25px",
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const primaryButtonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
};

const secondaryButtonStyle = {
  background: "#111827",
  color: "white",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
};

export default AdminDashboard;
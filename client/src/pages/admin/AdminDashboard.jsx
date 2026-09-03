import React from 'react'
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <p>Welcome to CodeArena Admin Panel 👨‍💼</p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/admin/problems"
          style={{
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          <h2>📝 Manage Problems</h2>
          <p>Create, update and delete coding problems.</p>
        </Link>

        <Link
          to="/admin/problems/create"
          style={{
            padding: "20px",
            border: "1px solid gray",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          <h2>➕ Create Problem</h2>
          <p>Add a new coding problem with test cases.</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard

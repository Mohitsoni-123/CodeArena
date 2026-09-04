import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (searchValue) {
      navigate(
        `/problems?search=${encodeURIComponent(searchValue)}`
      );
    } else {
      navigate("/problems");
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to={user?.role === "admin" ? "/admin" : "/"} className="logo">
        CodeArena
      </Link>

      <div className="nav-links">

        {/* ================= ADMIN NAVBAR ================= */}
        {token && user?.role === "admin" ? (
          <>
            <NavLink
              to="/admin"
              end
              className={navLinkClass}
            >
              <span>📊</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/problems"
              end
              className={navLinkClass}
            >
              <span>📝</span>
              Problems
            </NavLink>

            <NavLink
              to="/admin/problems/create"
              className={navLinkClass}
            >
              <span>➕</span>
              Create Problem
            </NavLink>

            {/* Admin Profile */}
            <div className="admin-profile">
              <div className="admin-avatar">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="admin-info">
                <span className="admin-name">
                  {user?.name || "Admin"}
                </span>

                <span className="admin-role">
                  Administrator
                </span>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : token ? (

          /* ================= USER NAVBAR ================= */
          <>
            <NavLink
              to="/problems"
              className={navLinkClass}
            >
              Problems
            </NavLink>

            <NavLink
              to="/store"
              className={navLinkClass}
            >
              🛍 Store
            </NavLink>

            <form
              className="search-box"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="streak">
              🔥 <span>{user?.streak || 0}</span>
            </div>

            <NavLink
              to="/premium"
              className="premium-btn"
            >
              ⭐ Premium
            </NavLink>

            <NavLink
              to="/submissions"
              className={navLinkClass}
            >
              My Submissions
            </NavLink>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (

          /* ================= GUEST NAVBAR ================= */
          <>
            <NavLink
              to="/problems"
              className={navLinkClass}
            >
              Problems
            </NavLink>

            <NavLink
              to="/store"
              className={navLinkClass}
            >
              🛍 Store
            </NavLink>

            <form
              className="search-box"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <NavLink
              to="/premium"
              className="premium-btn"
            >
              ⭐ Premium
            </NavLink>

            <NavLink
              to="/login"
              className={navLinkClass}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="register-btn"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
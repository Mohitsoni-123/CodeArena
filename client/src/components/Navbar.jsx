import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom"

const Navbar = () => {
    const token = localStorage.getItem("token");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleLogout = ()=>{
        localStorage.removeItem("token");
        window.location.href = "/login";
    };
    const handleSearch = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    if (searchValue) {
      navigate(`/problems?search=${encodeURIComponent(searchValue)}`);
    } else {
      navigate("/problems");
    }
  };
  return (
    <nav className="navbar">
      
      {/* Logo */}
      <Link to="/" className="logo">
        CodeArena
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/problems">Problems</Link>

        {/* Store */}
        <Link to="/store">🛍 Store</Link>

        {/* Search */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* Streak */}
        <div className="streak">
          🔥 <span>0</span>
        </div>

        {/* Premium */}
        <Link to="/premium" className="premium-btn">
          ⭐ Premium
        </Link>

        {token ? (
          <>
            <Link to="/submissions">My Submissions</Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = token && user?.role === "admin";

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
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

    setMobileOpen(false);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
      isActive
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const isProblemsPage = location.pathname.startsWith("/problems");

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4">

          {/* ================= LOGO ================= */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            onClick={closeMobile}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <span className="font-mono text-sm font-black">
                &lt;/&gt;
              </span>
            </div>

            <div className="hidden sm:block">
              <div className="text-lg font-black tracking-tight text-slate-900">
                CodeArena
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Code. Learn. Compete.
              </div>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden items-center gap-1 lg:flex">

            {/* ================= ADMIN ================= */}
            {isAdmin ? (
              <>
                <NavLink
                  to="/admin"
                  end
                  className={navLinkClass}
                >
                  <span>▦</span>
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/problems"
                  className={navLinkClass}
                >
                  <span>☷</span>
                  Problems
                </NavLink>

                <NavLink
                  to="/admin/problems/create"
                  className={navLinkClass}
                >
                  <span>＋</span>
                  Create Problem
                </NavLink>

                {/* Divider */}
                <div className="mx-3 h-8 w-px bg-slate-200" />

                {/* Admin Profile */}
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>

                  <div className="hidden xl:block">
                    <p className="max-w-[120px] truncate text-sm font-bold text-slate-800">
                      {user?.name || "Admin"}
                    </p>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                      Administrator
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* ================= USER / GUEST ================= */}

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
                  <span>🛍</span>
                  Store
                </NavLink>

                {/* Search */}
                <form
                  onSubmit={handleSearch}
                  className="ml-2 hidden xl:block"
                >
                  <div
                    className={`flex w-64 items-center rounded-xl border bg-slate-50 px-3 transition ${
                      isProblemsPage
                        ? "border-slate-300 bg-white"
                        : "border-slate-200"
                    }`}
                  >
                    <span className="text-sm text-slate-400">
                      ⌕
                    </span>

                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      className="w-full bg-transparent px-2 py-2.5 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </form>

                {/* Streak */}
                {token && (
                  <div className="ml-2 flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2">
                    <span className="text-sm">🔥</span>

                    <span className="text-sm font-black text-orange-600">
                      {user?.streak || 0}
                    </span>
                  </div>
                )}

                {/* Premium */}
                <NavLink
                  to="/premium"
                  className={({ isActive }) =>
                    `ml-1 rounded-xl px-3 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-amber-100 text-amber-700"
                        : "text-amber-600 hover:bg-amber-50"
                    }`
                  }
                >
                  ⭐ Premium
                </NavLink>

                {token ? (
                  <>
                    <NavLink
                      to="/submissions"
                      className={navLinkClass}
                    >
                      My Submissions
                    </NavLink>

                    <div className="ml-2 h-8 w-px bg-slate-200" />

                    {/* User Avatar */}
                    <div
                      title={user?.name || "User"}
                      className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white"
                    >
                      {user?.name?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="ml-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className={navLinkClass}
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="ml-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <span className="text-xl">×</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div className="border-t border-slate-100 py-4 lg:hidden">
            <div className="flex flex-col gap-2">

              {/* Mobile Admin */}
              {isAdmin ? (
                <>
                  <div className="mb-2 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-black text-white">
                      {user?.name?.charAt(0).toUpperCase() ||
                        "A"}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {user?.name || "Admin"}
                      </p>

                      <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                        Administrator
                      </p>
                    </div>
                  </div>

                  <NavLink
                    to="/admin"
                    end
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    ▦ Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/problems"
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    ☷ Problems
                  </NavLink>

                  <NavLink
                    to="/admin/problems/create"
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    ＋ Create Problem
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="mt-2 rounded-xl border border-red-200 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    ↪ Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/problems"
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    <span>⌘</span>
                    Problems
                  </NavLink>

                  <NavLink
                    to="/store"
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    🛍 Store
                  </NavLink>

                  {/* Mobile Search */}
                  <form
                    onSubmit={handleSearch}
                    className="my-1"
                  >
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                      <span className="text-sm text-slate-400">
                        ⌕
                      </span>

                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        className="w-full bg-transparent px-2 py-3 text-sm font-medium outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </form>

                  <NavLink
                    to="/premium"
                    onClick={closeMobile}
                    className={mobileNavLinkClass}
                  >
                    ⭐ Premium
                  </NavLink>

                  {token ? (
                    <>
                      {/* Mobile User Info */}
                      <div className="my-1 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white">
                            {user?.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {user?.name || "User"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {user?.email || "CodeArena User"}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-black text-orange-600">
                          🔥 {user?.streak || 0}
                        </div>
                      </div>

                      <NavLink
                        to="/submissions"
                        onClick={closeMobile}
                        className={mobileNavLinkClass}
                      >
                        ◉ My Submissions
                      </NavLink>

                      <button
                        onClick={handleLogout}
                        className="mt-1 rounded-xl border border-red-200 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        ↪ Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        onClick={closeMobile}
                        className={mobileNavLinkClass}
                      >
                        → Login
                      </NavLink>

                      <NavLink
                        to="/register"
                        onClick={closeMobile}
                        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                      >
                        Create Account →
                      </NavLink>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
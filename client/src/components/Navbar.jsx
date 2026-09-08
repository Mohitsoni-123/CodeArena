import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);

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
      navigate(`/problems?search=${encodeURIComponent(searchValue)}`);
    } else {
      navigate("/problems");
    }

    setMobileOpen(false);
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `group relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-white/10 text-white shadow-lg shadow-violet-500/10"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? "border border-violet-500/20 bg-violet-500/10 text-violet-300"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const isProblemsPage = location.pathname.startsWith("/problems");

  return (
    <>
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        {/* Top Glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />

        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-4">

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <Link
              to={isAdmin ? "/admin" : "/"}
              onClick={closeMobile}
              className="group flex shrink-0 items-center gap-3"
            >
              {/* Logo Icon */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-violet-600/30 opacity-0 blur-md transition duration-300 group-hover:opacity-100" />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-violet-500/30">
                  <span className="font-mono text-sm font-black">
                    {"</>"}
                  </span>
                </div>
              </div>

              {/* Logo Text */}
              <div className="hidden sm:block">
                <div className="bg-gradient-to-r from-white via-violet-200 to-indigo-300 bg-clip-text text-lg font-black tracking-tight text-transparent">
                  CodeArena
                </div>

                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Code. Learn. Compete.
                </div>
              </div>
            </Link>

            {/* ================================================= */}
            {/* DESKTOP NAV */}
            {/* ================================================= */}

            <div className="hidden items-center gap-1 lg:flex">

              {/* ================= ADMIN ================= */}

              {isAdmin ? (
                <>
                  <NavLink
                    to="/admin"
                    end
                    className={navLinkClass}
                  >
                    <span className="text-violet-400">▦</span>
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/admin/problems"
                    className={navLinkClass}
                  >
                    <span className="text-violet-400">☷</span>
                    Problems
                  </NavLink>

                  <NavLink
                    to="/admin/problems/create"
                    className={navLinkClass}
                  >
                    <span className="text-violet-400">＋</span>
                    Create Problem
                  </NavLink>

                  <div className="mx-3 h-8 w-px bg-white/10" />

                  {/* Admin Profile */}

                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-900/20">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>

                    <div className="hidden xl:block">
                      <p className="max-w-[110px] truncate text-xs font-bold text-white">
                        {user?.name || "Admin"}
                      </p>

                      <p className="text-[9px] font-bold uppercase tracking-wider text-violet-400">
                        Administrator
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="ml-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-bold text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* ================= USER NAV ================= */}

                  <NavLink
                    to="/problems"
                    className={navLinkClass}
                  >
                    <span className="text-violet-400">⌘</span>
                    Problems
                  </NavLink>

                  {/* Store */}

                  <button
                    onClick={() => setStoreOpen(true)}
                    className="group inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      🏪
                    </span>
                    Store
                  </button>

                  {/* Search */}

                  <form
                    onSubmit={handleSearch}
                    className="ml-2 hidden xl:block"
                  >
                    <div className="group flex w-[190px] items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 transition-all duration-200 focus-within:border-violet-500/40 focus-within:bg-white/[0.06] focus-within:shadow-lg focus-within:shadow-violet-900/10">
                      <span className="text-sm text-slate-500 transition group-focus-within:text-violet-400">
                        ⌕
                      </span>

                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent px-2 py-2.5 text-xs font-medium text-white outline-none placeholder:text-slate-600"
                      />

                      <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                        /
                      </span>
                    </div>
                  </form>

                  {/* Streak */}

                  {token && (
                    <div className="group ml-1 inline-flex items-center gap-2 rounded-xl border border-orange-500/10 bg-orange-500/5 px-3 py-2 text-sm font-bold text-orange-400 transition hover:border-orange-500/20 hover:bg-orange-500/10">
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        🔥
                      </span>

                      <span>{user?.streak || 0}</span>
                    </div>
                  )}

                  {/* Premium */}

                  <button
                    onClick={() => setPremiumOpen(true)}
                    className="group relative ml-1 inline-flex items-center gap-2 overflow-hidden rounded-xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-3 py-2 text-sm font-black text-amber-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-900/20"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative transition-transform duration-200 group-hover:rotate-12">
                      ✨
                    </span>

                    <span className="relative">Premium</span>
                  </button>

                  {/* My Submissions */}

                  {token && (
                    <NavLink
                      to="/submissions"
                      className={navLinkClass}
                    >
                      <span className="text-violet-400">◉</span>
                      My Submissions
                    </NavLink>
                  )}

                  {/* Divider */}

                  <div className="ml-2 h-8 w-px bg-white/10" />

                  {/* User */}

                  {token ? (
                    <>
                      <div
                        title={user?.name || "User"}
                        className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-900/20"
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      <button
                        onClick={handleLogout}
                        className="ml-1 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
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
                        className="ml-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20"
                      >
                        Register
                      </NavLink>
                    </>
                  )}
                </>
              )}
            </div>

            {/* ================================================= */}
            {/* MOBILE MENU BUTTON */}
            {/* ================================================= */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <span className="text-xl">×</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>

          {/* ================================================= */}
          {/* MOBILE MENU */}
          {/* ================================================= */}

          {mobileOpen && (
            <div className="border-t border-white/10 py-4 lg:hidden">
              <div className="flex flex-col gap-2">

                {isAdmin ? (
                  <>
                    {/* Admin Profile */}

                    <div className="mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-black text-white shadow-lg shadow-violet-900/30">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                      </div>

                      <div>
                        <p className="font-bold text-white">
                          {user?.name || "Admin"}
                        </p>

                        <p className="text-xs font-bold uppercase tracking-wider text-violet-400">
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
                      <span className="text-violet-400">▦</span>
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/admin/problems"
                      onClick={closeMobile}
                      className={mobileNavLinkClass}
                    >
                      <span className="text-violet-400">☷</span>
                      Problems
                    </NavLink>

                    <NavLink
                      to="/admin/problems/create"
                      onClick={closeMobile}
                      className={mobileNavLinkClass}
                    >
                      <span className="text-violet-400">＋</span>
                      Create Problem
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="mt-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                    >
                      ↪ Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Problems */}

                    <NavLink
                      to="/problems"
                      onClick={closeMobile}
                      className={mobileNavLinkClass}
                    >
                      <span className="text-violet-400">⌘</span>
                      Problems
                    </NavLink>

                    {/* Store */}

                    <button
                      onClick={() => {
                        setStoreOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <span>🏪</span>
                      Store
                    </button>

                    {/* Mobile Search */}

                    <form
                      onSubmit={handleSearch}
                      className="my-1"
                    >
                      <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] px-3 focus-within:border-violet-500/40">
                        <span className="text-sm text-slate-500">
                          ⌕
                        </span>

                        <input
                          type="text"
                          placeholder="Search problems..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full bg-transparent px-2 py-3 text-sm font-medium text-white outline-none placeholder:text-slate-600"
                        />
                      </div>
                    </form>

                    {/* Streak */}

                    {token && (
                      <div className="flex items-center justify-between rounded-xl border border-orange-500/10 bg-orange-500/5 px-4 py-3 text-sm font-bold text-orange-400">
                        <span>🔥 Daily Streak</span>
                        <span>{user?.streak || 0} days</span>
                      </div>
                    )}

                    {/* Premium */}

                    <button
                      onClick={() => {
                        setPremiumOpen(true);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-left text-sm font-black text-amber-300 transition hover:bg-amber-500/10"
                    >
                      <span>✨</span>
                      Premium
                    </button>

                    {/* User */}

                    {token ? (
                      <>
                        <div className="my-1 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-black text-white">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {user?.name || "User"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {user?.email || "CodeArena User"}
                            </p>
                          </div>
                        </div>

                        <NavLink
                          to="/submissions"
                          onClick={closeMobile}
                          className={mobileNavLinkClass}
                        >
                          <span className="text-violet-400">◉</span>
                          My Submissions
                        </NavLink>

                        <button
                          onClick={handleLogout}
                          className="mt-1 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10"
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
                          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:from-violet-500 hover:to-indigo-500"
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

      {/* ========================================================= */}
      {/* PREMIUM MODAL */}
      {/* ========================================================= */}

      {premiumOpen && (
        <div
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
          onClick={() => setPremiumOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/50"
          >
            {/* Glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative p-6 sm:p-8">

              {/* Header */}

              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-black text-amber-300">
                    ✨ PREMIUM
                  </div>

                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                    Upgrade your
                    <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                      {" "}
                      coding journey
                    </span>
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Unlock premium features and level up your CodeArena
                    experience.
                  </p>
                </div>

                <button
                  onClick={() => setPremiumOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Features */}

              <div className="mt-7 space-y-3">
                {[
                  ["∞", "Unlimited Practice", "Solve without limits"],
                  ["⚡", "Advanced Problems", "Exclusive premium problems"],
                  ["◈", "Detailed Analytics", "Track your coding progress"],
                  ["🏆", "Exclusive Contests", "Compete with top coders"],
                ].map(([icon, title, description]) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-violet-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-300">
                      {icon}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        {title}
                      </p>

                      <p className="text-xs text-slate-500">
                        {description}
                      </p>
                    </div>

                    <span className="ml-auto text-sm text-emerald-400">
                      ✓
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing */}

              <div className="mt-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Monthly
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-black">
                        ₹199
                      </span>

                      <span className="text-sm text-slate-500">
                        /month
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                    Best Value
                  </span>
                </div>
              </div>

              {/* CTA */}

              <button
                onClick={() => {}}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
              >
                Upgrade to Premium ✨
              </button>

              <p className="mt-3 text-center text-[11px] text-slate-600">
                Payment integration coming soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STORE MODAL */}
      {/* ========================================================= */}

      {storeOpen && (
        <div
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => setStoreOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 text-white shadow-2xl shadow-black/50"
          >
            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="relative p-6 sm:p-8">

              {/* Header */}

              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 text-2xl">🏪</div>

                  <h2 className="text-2xl font-black">
                    CodeArena Store
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Customize your coding experience.
                  </p>
                </div>

                <button
                  onClick={() => setStoreOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>

              {/* Balance */}

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your Balance
                  </p>

                  <p className="mt-1 text-xl font-black text-amber-300">
                    🪙 1,250 CodeCoins
                  </p>
                </div>

                <span className="text-2xl">💰</span>
              </div>

              {/* Items */}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["🎨", "Coding Theme Pack", "Premium editor themes", "300"],
                  ["⚡", "2× XP Boost", "Double your earned XP", "500"],
                  ["🏆", "Elite Profile Badge", "Show your coding status", "750"],
                  ["🛡️", "Streak Shield", "Protect your streak", "600"],
                ].map(([icon, title, description, price]) => (
                  <div
                    key={title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-xl">
                        {icon}
                      </div>

                      <span className="text-xs font-black text-amber-300">
                        🪙 {price}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {description}
                    </p>

                    <button
                      onClick={() => {}}
                      className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-black text-slate-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                    >
                      Get Item
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-[11px] text-slate-600">
                Store purchases are currently UI-only.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
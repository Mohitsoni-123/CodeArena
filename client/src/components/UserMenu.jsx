import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Moon, Palette, Sun, User } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// --------------------------------------------------
// THEME (localStorage me save hota hai, <html> par class lagti hai)
// --------------------------------------------------

const getInitialTheme = () => {
  try {
    return localStorage.getItem("theme") || "dark";
  } catch {
    return "dark";
  }
};

const MenuLink = ({ to, icon: Icon, label, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
  >
    <Icon size={17} className="text-slate-500" />

    <span className="flex-1">{label}</span>

    {badge > 0 && (
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
        {badge > 9 ? "9+" : badge}
      </span>
    )}
  </Link>
);

// --------------------------------------------------
// MAIN COMPONENT
//
// Props:
//   user         -> { name, email }
//   onLogout     -> logout function
//   unreadCount  -> notifications ki sankhya (optional)
// --------------------------------------------------

const UserMenu = ({ user, onLogout, unreadCount = 0 }) => {
  const { token } = useAuth();

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [unread, setUnread] = useState(0);

  // prop se count aaye to wo, warna server se laya hua
  const badge = unreadCount || unread;

  const wrapperRef = useRef(null);

  const name = user?.name || "User";
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  // unread notifications ka count (har 60 sec + jab Notifications page kuch badle)
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchUnread = async () => {
      try {
        const response = await api.get("/notifications/unread-count");

        if (!cancelled) setUnread(response.data.unreadCount || 0);
      } catch {
        /* count na mile to badge nahi dikhega */
      }
    };

    fetchUnread();

    const timer = setInterval(fetchUnread, 60000);

    window.addEventListener("notifications:changed", fetchUnread);

    return () => {
      cancelled = true;
      clearInterval(timer);
      window.removeEventListener("notifications:changed", fetchUnread);
    };
  }, [token]);

  // bahar click ya Esc dabane par band
  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // theme apply + save
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;

    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-900/20 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      >
        {initial}

        {badge > 0 && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-blue-500" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-2 text-white shadow-2xl shadow-black/40"
        >
          {/* User info */}
          <div className="mb-1 flex items-center gap-3 px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-bold text-slate-200">
              {initial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>

              {user?.email && (
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              )}
            </div>
          </div>

          <div className="my-1 h-px bg-white/[0.07]" />

          <MenuLink
            to="/profile"
            icon={User}
            label="Profile"
            onClick={() => setOpen(false)}
          />

          <MenuLink
            to="/notifications"
            icon={Bell}
            label="Notifications"
            badge={badge}
            onClick={() => setOpen(false)}
          />

          {/* Theme toggle */}
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300">
            <Palette size={17} className="text-slate-500" />

            <span className="flex-1">Theme</span>

            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label="Toggle dark theme"
              onClick={toggleTheme}
              className="relative h-7 w-14 rounded-full border border-white/10 bg-black/40 transition"
            >
              <span
                className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-900 transition-all ${
                  theme === "dark" ? "left-[30px]" : "left-0.5"
                }`}
              >
                {theme === "dark" ? <Moon size={13} /> : <Sun size={13} />}
              </span>
            </button>
          </div>

          <div className="my-1 h-px bg-white/[0.07]" />

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Flame,
  Info,
  Megaphone,
  Trash2,
} from "lucide-react";
import api from "../services/api";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const timeAgo = (value) => {
  const seconds = Math.floor((Date.now() - new Date(value)) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const typeConfig = {
  success: {
    icon: CheckCircle2,
    box: "bg-emerald-500/10 text-emerald-400",
  },
  streak: {
    icon: Flame,
    box: "bg-orange-500/10 text-orange-400",
  },
  warning: {
    icon: AlertTriangle,
    box: "bg-amber-500/10 text-amber-400",
  },
  system: {
    icon: Megaphone,
    box: "bg-violet-500/10 text-violet-400",
  },
  info: {
    icon: Info,
    box: "bg-sky-500/10 text-sky-400",
  },
};

// Navbar ke badge ko refresh karne ke liye
const notifyChanged = () =>
  window.dispatchEvent(new Event("notifications:changed"));

// --------------------------------------------------
// PAGE
// --------------------------------------------------

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/notifications?limit=100");

        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Unable to load notifications.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const visible =
    filter === "unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  // ---------------- ACTIONS ----------------

  const markRead = async (id) => {
    // pehle UI badlo, phir server
    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
    );

    try {
      await api.patch(`/notifications/${id}/read`);
      notifyChanged();
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleOpen = async (item) => {
    if (!item.isRead) await markRead(item._id);

    if (item.link) navigate(item.link);
  };

  const handleMarkAll = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    try {
      await api.patch("/notifications/read-all");
      notifyChanged();
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    setNotifications((prev) => prev.filter((item) => item._id !== id));

    try {
      await api.delete(`/notifications/${id}`);
      notifyChanged();
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    setNotifications([]);

    try {
      await api.delete("/notifications");
      notifyChanged();
    } catch (err) {
      console.error("Clear notifications error:", err);
    }
  };

  // ---------------- UI ----------------

  return (
    <main className="min-h-screen bg-[#111113] text-white">
      <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6">
        {/* Header */}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>

            <p className="mt-2 text-sm text-slate-500">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }.`
                : "You're all caught up."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>

            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        </div>

        {/* Filter tabs */}

        <div className="mt-6 inline-flex rounded-xl border border-white/[0.08] bg-[#18181b] p-1">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                filter === tab.key
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#151517]">
          {loading && (
            <div className="divide-y divide-white/[0.05]">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex animate-pulse gap-4 p-5">
                  <div className="h-10 w-10 rounded-xl bg-white/5" />

                  <div className="flex-1">
                    <div className="h-4 w-48 rounded bg-white/5" />
                    <div className="mt-3 h-3 w-72 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-16 text-center">
              <p className="font-bold">Unable to load notifications</p>

              <p className="mt-2 text-sm text-slate-500">{error}</p>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-600">
                {filter === "unread" ? <BellOff size={24} /> : <Bell size={24} />}
              </div>

              <p className="mt-4 text-base font-bold">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Solve problems and build streaks to get updates here.
              </p>
            </div>
          )}

          {!loading && !error && visible.length > 0 && (
            <ul className="divide-y divide-white/[0.05]">
              {visible.map((item) => {
                const config = typeConfig[item.type] || typeConfig.info;
                const Icon = config.icon;

                return (
                  <li key={item._id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpen(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleOpen(item);
                      }}
                      className={`group flex cursor-pointer items-start gap-4 p-5 transition hover:bg-white/[0.025] ${
                        item.isRead ? "" : "bg-violet-500/[0.04]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.box}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={`truncate text-sm ${
                              item.isRead
                                ? "font-medium text-slate-300"
                                : "font-bold text-white"
                            }`}
                          >
                            {item.title}
                          </p>

                          {!item.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                          )}
                        </div>

                        {item.message && (
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.message}
                          </p>
                        )}

                        <p className="mt-1.5 text-[11px] text-slate-600">
                          {timeAgo(item.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDelete(e, item._id)}
                        aria-label="Delete notification"
                        className="shrink-0 rounded-lg p-2 text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Notifications;

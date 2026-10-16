import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Flame,
  KeyRound,
  ListChecks,
  Pencil,
  Percent,
  X,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "—";

const timeAgo = (value) => {
  const seconds = Math.floor((Date.now() - new Date(value)) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const statusColor = (status) =>
  status === "Accepted" ? "text-emerald-400" : "text-rose-400";

const difficultyBars = [
  { key: "Easy", color: "bg-emerald-400", text: "text-emerald-400" },
  { key: "Medium", color: "bg-amber-400", text: "text-amber-400" },
  { key: "Hard", color: "bg-red-400", text: "text-red-400" },
];

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50";

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-2xl border border-white/[0.08] bg-[#18181b] p-5">
    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
      <Icon size={15} className={tone} />
      {label}
    </div>

    <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
  </div>
);

// --------------------------------------------------
// PAGE
// --------------------------------------------------

const Profile = () => {
  const { updateUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // name edit
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  // password
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/users/me/profile");

        setData(response.data);
        setNameInput(response.data.user.name);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ---------------- NAME ----------------

  const handleSaveName = async () => {
    const name = nameInput.trim();

    if (name.length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }

    try {
      setNameSaving(true);
      setNameError("");

      const response = await api.put("/users/me", { name });

      setData((prev) => ({
        ...prev,
        user: { ...prev.user, name: response.data.user.name },
      }));

      // AuthContext me updateUser ho to navbar ka naam bhi turant badal jayega
      updateUser?.({ name: response.data.user.name });

      setEditing(false);
    } catch (err) {
      setNameError(err?.response?.data?.message || "Unable to update name.");
    } finally {
      setNameSaving(false);
    }
  };

  // ---------------- PASSWORD ----------------

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordMessage({ type: "", text: "" });

      await api.put("/users/me/password", { currentPassword, newPassword });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully.",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err?.response?.data?.message || "Unable to change password.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  // ---------------- STATES ----------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111113] text-white">
        <div className="mx-auto max-w-[1100px] animate-pulse space-y-5 px-4 py-10">
          <div className="h-40 rounded-3xl bg-white/5" />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 rounded-2xl bg-white/5" />
            ))}
          </div>

          <div className="h-64 rounded-3xl bg-white/5" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111113] px-4 text-white">
        <div className="text-center">
          <p className="text-lg font-bold">Unable to load profile</p>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold hover:bg-violet-500"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const { user, stats, recentSubmissions } = data;

  // ---------------- UI ----------------

  return (
    <main className="min-h-screen bg-[#111113] text-white">
      <div className="mx-auto max-w-[1100px] space-y-6 px-4 py-10 sm:px-6">
        {/* ============ HEADER CARD ============ */}

        <section className="rounded-3xl border border-white/[0.08] bg-[#18181b] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 text-3xl font-black text-white shadow-lg shadow-violet-900/30">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              {editing ? (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveName();
                        if (e.key === "Escape") {
                          setEditing(false);
                          setNameInput(user.name);
                          setNameError("");
                        }
                      }}
                      autoFocus
                      maxLength={50}
                      className={`${inputClass} max-w-xs py-2.5`}
                    />

                    <button
                      onClick={handleSaveName}
                      disabled={nameSaving}
                      aria-label="Save name"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-50"
                    >
                      <Check size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setEditing(false);
                        setNameInput(user.name);
                        setNameError("");
                      }}
                      aria-label="Cancel"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {nameError && (
                    <p className="mt-2 text-xs text-rose-400">{nameError}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.name}
                  </h1>

                  <button
                    onClick={() => setEditing(true)}
                    aria-label="Edit name"
                    className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              )}

              <p className="mt-1 truncate text-sm text-slate-400">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold capitalize text-violet-300">
                  {user.role}
                </span>

                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-slate-400">
                  Member since {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ STATS ============ */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={CheckCircle2}
            label="Problems Solved"
            value={`${stats.solvedCount} / ${stats.totalProblems}`}
            tone="text-emerald-400"
          />

          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${user.streak || 0} days`}
            tone="text-orange-400"
          />

          <StatCard
            icon={ListChecks}
            label="Submissions"
            value={stats.totalSubmissions}
            tone="text-violet-400"
          />

          <StatCard
            icon={Percent}
            label="Acceptance Rate"
            value={`${stats.acceptanceRate}%`}
            tone="text-sky-400"
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ============ SOLVED BY DIFFICULTY ============ */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#18181b] p-6">
            <h2 className="text-base font-bold">Solved by Difficulty</h2>

            <div className="mt-6 space-y-5">
              {difficultyBars.map(({ key, color, text }) => {
                const solved = stats.solved[key] || 0;
                const total = stats.total[key] || 0;

                return (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className={`font-semibold ${text}`}>{key}</span>

                      <span className="text-slate-400">
                        {solved} / {total}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-500`}
                        style={{
                          width: `${total ? (solved / total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ============ RECENT SUBMISSIONS ============ */}

          <section className="rounded-3xl border border-white/[0.08] bg-[#18181b] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Recent Submissions</h2>

              <Link
                to="/submissions"
                className="text-xs font-semibold text-violet-400 transition hover:text-violet-300"
              >
                View all
              </Link>
            </div>

            {recentSubmissions.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                No submissions yet.{" "}
                <Link to="/problems" className="text-violet-400">
                  Solve your first problem
                </Link>
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-white/[0.06]">
                {recentSubmissions.map((submission) => (
                  <li key={submission._id}>
                    <Link
                      to={
                        submission.problem?._id
                          ? `/problems/${submission.problem._id}`
                          : "/problems"
                      }
                      className="flex items-center justify-between gap-3 py-3 transition hover:opacity-80"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-200">
                          {submission.problem?.title || "Deleted problem"}
                        </p>

                        <p className="mt-0.5 text-[11px] uppercase text-slate-600">
                          {submission.language} · {timeAgo(submission.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-semibold ${statusColor(
                          submission.status,
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* ============ CHANGE PASSWORD ============ */}

        <section className="rounded-3xl border border-white/[0.08] bg-[#18181b] p-6">
          <div className="flex items-center gap-2">
            <KeyRound size={17} className="text-violet-400" />

            <h2 className="text-base font-bold">Change Password</h2>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="mt-5 grid max-w-xl gap-4"
          >
            <input
              type="password"
              placeholder="Current password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, currentPassword: e.target.value })
              }
              className={inputClass}
              required
            />

            <input
              type="password"
              placeholder="New password (min 6 characters)"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
              className={inputClass}
              required
            />

            <input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              className={inputClass}
              required
            />

            {passwordMessage.text && (
              <p
                className={`text-sm ${
                  passwordMessage.type === "success"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {passwordMessage.text}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Profile;

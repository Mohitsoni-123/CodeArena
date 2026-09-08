import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Code2,
  FilePlus2,
  FileText,
  LayoutDashboard,
  ListChecks,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import api from "../../services/api";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  iconBg,
}) => {
  return (
    <div className="group rounded-2xl border border-white/10 bg-[#0d1118] p-5 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-white/15 hover:bg-[#10151e]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {value.toLocaleString()}
          </h2>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 ${iconBg}`}
        >
          <Icon size={20} className={iconClass} />
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-600">
        {description}
      </p>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="h-36 animate-pulse rounded-2xl border border-white/5 bg-[#0d1118]" />
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalSubmissions: 0,
    acceptedSubmissions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/stats");

      setStats({
        totalUsers: Number(response.data.totalUsers) || 0,
        totalProblems: Number(response.data.totalProblems) || 0,
        totalSubmissions: Number(response.data.totalSubmissions) || 0,
        acceptedSubmissions:
          Number(response.data.acceptedSubmissions) || 0,
      });
    } catch (err) {
      console.error("Fetch Admin Stats Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const acceptanceRate =
    stats.totalSubmissions > 0
      ? Math.round(
          (stats.acceptedSubmissions / stats.totalSubmissions) * 100
        )
      : 0;

  const rejectedSubmissions = Math.max(
    stats.totalSubmissions - stats.acceptedSubmissions,
    0
  );

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a0f] text-white">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="animate-pulse">
            <div className="h-6 w-28 rounded-lg bg-white/10" />
            <div className="mt-4 h-10 w-72 rounded-lg bg-white/10" />
            <div className="mt-3 h-5 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <SkeletonCard key={item} />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="h-80 rounded-2xl bg-[#0d1118] lg:col-span-2" />
              <div className="h-80 rounded-2xl bg-[#0d1118]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070a0f] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#0d1118] p-7 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
            <XCircle size={25} className="text-red-400" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchStats}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-white">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              <ShieldCheck size={13} />
              Admin Control Center
            </div>

            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              <LayoutDashboard className="hidden text-cyan-400 sm:block" />
              Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Monitor CodeArena activity, manage coding problems and
              track platform performance.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-white"
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>

        {/* ================= STATS ================= */}

        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            description="Registered CodeArena users"
            icon={Users}
            iconClass="text-cyan-400"
            iconBg="bg-cyan-400/10"
          />

          <StatCard
            title="Total Problems"
            value={stats.totalProblems}
            description="Coding challenges available"
            icon={FileText}
            iconClass="text-violet-400"
            iconBg="bg-violet-400/10"
          />

          <StatCard
            title="Submissions"
            value={stats.totalSubmissions}
            description="Total code submissions"
            icon={Code2}
            iconClass="text-amber-400"
            iconBg="bg-amber-400/10"
          />

          <StatCard
            title="Accepted"
            value={stats.acceptedSubmissions}
            description={`${acceptanceRate}% overall acceptance rate`}
            icon={CheckCircle2}
            iconClass="text-emerald-400"
            iconBg="bg-emerald-400/10"
          />
        </section>

        {/* ================= MAIN GRID ================= */}

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* PLATFORM PERFORMANCE */}

          <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-5 shadow-xl shadow-black/10 sm:p-6 lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" />

                  <h2 className="text-lg font-bold text-white">
                    Platform Performance
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-600">
                  Current CodeArena platform statistics.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live Data
              </div>
            </div>

            <div className="mt-8 space-y-7">

              {/* Users */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-cyan-400" />

                    <span className="text-sm font-medium text-slate-400">
                      Users
                    </span>
                  </div>

                  <span className="text-sm font-bold text-white">
                    {stats.totalUsers.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-full rounded-full bg-cyan-400/70" />
                </div>
              </div>

              {/* Problems */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-violet-400" />

                    <span className="text-sm font-medium text-slate-400">
                      Problems
                    </span>
                  </div>

                  <span className="text-sm font-bold text-white">
                    {stats.totalProblems.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-full rounded-full bg-violet-400/70" />
                </div>
              </div>

              {/* Submissions */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={15} className="text-amber-400" />

                    <span className="text-sm font-medium text-slate-400">
                      Submissions
                    </span>
                  </div>

                  <span className="text-sm font-bold text-white">
                    {stats.totalSubmissions.toLocaleString()}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-full rounded-full bg-amber-400/70" />
                </div>
              </div>

              {/* Acceptance Rate */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />

                    <span className="text-sm font-medium text-slate-400">
                      Acceptance Rate
                    </span>
                  </div>

                  <span className="text-sm font-bold text-emerald-400">
                    {acceptanceRate}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                    style={{ width: `${acceptanceRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Submission Breakdown */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400"
                  />

                  <span className="text-xs font-semibold text-slate-500">
                    Accepted Submissions
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-emerald-400">
                  {stats.acceptedSubmissions.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />

                  <span className="text-xs font-semibold text-slate-500">
                    Other Submissions
                  </span>
                </div>

                <p className="mt-2 text-2xl font-black text-red-400">
                  {rejectedSubmissions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ================= QUICK ACTIONS ================= */}

          <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-5 shadow-xl shadow-black/10 sm:p-6">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" />

              <h2 className="text-lg font-bold text-white">
                Quick Actions
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-600">
              Manage CodeArena quickly.
            </p>

            <div className="mt-6 space-y-3">

              <Link
                to="/admin/problems/create"
                className="group flex items-center justify-between rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/10">
                    <FilePlus2 size={17} />
                  </span>

                  Create Problem
                </span>

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/admin/problems"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                    <ListChecks size={17} />
                  </span>

                  Manage Problems
                </span>

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/problems"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/5 hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                    <Code2 size={17} />
                  </span>

                  View Problems
                </span>

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* System Status */}

            <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    System Active
                  </p>

                  <p className="mt-0.5 text-xs text-slate-600">
                    All admin services operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PLATFORM SUMMARY ================= */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0d1118] p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Activity size={17} className="text-cyan-400" />

                <h3 className="font-bold text-white">
                  CodeArena Administration
                </h3>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Keep your coding problems organized and monitor platform
                activity from one centralized admin dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Users
                </p>

                <p className="mt-1 text-lg font-black text-white">
                  {stats.totalUsers}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Problems
                </p>

                <p className="mt-1 text-lg font-black text-white">
                  {stats.totalProblems}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Acceptance
                </p>

                <p className="mt-1 text-lg font-black text-emerald-400">
                  {acceptanceRate}%
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 pb-4 pt-8 text-xs text-slate-700">
          <Code2 size={13} />
          CodeArena Admin Panel
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
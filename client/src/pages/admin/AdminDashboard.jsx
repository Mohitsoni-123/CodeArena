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

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

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

  useEffect(() => {
    fetchStats();
  }, []);

  const acceptedRate =
    stats.totalSubmissions > 0
      ? Math.round(
          (stats.acceptedSubmissions / stats.totalSubmissions) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-64 rounded-lg bg-slate-200" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-72 rounded-2xl bg-white lg:col-span-2" />
            <div className="h-72 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-red-800">
                  Unable to load dashboard
                </h2>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>

              <button
                onClick={fetchStats}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      description: "Registered users",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      title: "Total Problems",
      value: stats.totalProblems,
      icon: "📝",
      description: "Coding problems",
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
    },
    {
      title: "Submissions",
      value: stats.totalSubmissions,
      icon: "📤",
      description: "Total submissions",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
    {
      title: "Accepted",
      value: stats.acceptedSubmissions,
      icon: "✓",
      description: `${acceptedRate}% acceptance rate`,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Admin Panel
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Manage and monitor your CodeArena platform.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span>↻</span>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {card.value.toLocaleString()}
                  </h2>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.iconBg} ${card.iconText}`}
                >
                  {card.icon}
                </div>
              </div>

              <p className="mt-4 text-xs font-medium text-slate-400">
                {card.description}
              </p>
            </div>
          ))}
        </section>

        {/* Main Content */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Platform Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Platform Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current CodeArena platform statistics
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                Live Data
              </div>
            </div>

            <div className="mt-7 space-y-6">

              {/* Users */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Users
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalUsers}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-full rounded-full bg-blue-500" />
                </div>
              </div>

              {/* Problems */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Problems
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalProblems}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-full rounded-full bg-violet-500" />
                </div>
              </div>

              {/* Submissions */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Submissions
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalSubmissions}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-full rounded-full bg-amber-500" />
                </div>
              </div>

              {/* Accepted */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Accepted Submissions
                  </span>

                  <span className="text-sm font-bold text-emerald-600">
                    {acceptedRate}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${acceptedRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quickly manage your platform.
            </p>

            <div className="mt-6 space-y-3">

              <Link
                to="/admin/problems/create"
                className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                    +
                  </span>
                  Create Problem
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/admin/problems"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    📝
                  </span>
                  Manage Problems
                </span>

                <span>→</span>
              </Link>

              <Link
                to="/problems"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    👀
                  </span>
                  View Problems
                </span>

                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom Info */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                CodeArena Administration
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Keep your problems, users and submissions organized from the
                admin panel.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              System Active
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
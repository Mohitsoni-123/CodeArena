import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/submissions/my");

      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error("Fetch Submissions Error:", error);

      setError(
        error.response?.data?.message || "Failed to fetch submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getStatusConfig = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === "accepted") {
      return {
        label: "Accepted",
        className:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
      };
    }

    if (normalized === "wrong answer") {
      return {
        label: "Wrong Answer",
        className: "bg-red-50 text-red-700 border border-red-200",
        dot: "bg-red-500",
      };
    }

    if (normalized === "compilation error") {
      return {
        label: "Compilation Error",
        className: "bg-orange-50 text-orange-700 border border-orange-200",
        dot: "bg-orange-500",
      };
    }

    if (normalized === "runtime error") {
      return {
        label: "Runtime Error",
        className: "bg-purple-50 text-purple-700 border border-purple-200",
        dot: "bg-purple-500",
      };
    }

    if (normalized === "time limit exceeded") {
      return {
        label: "Time Limit",
        className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        dot: "bg-yellow-500",
      };
    }

    return {
      label: status || "Pending",
      className: "bg-slate-50 text-slate-700 border border-slate-200",
      dot: "bg-slate-500",
    };
  };

  const getLanguageConfig = (language) => {
    const languages = {
      cpp: {
        label: "C++",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      c: {
        label: "C",
        className: "bg-slate-50 text-slate-700 border-slate-200",
      },
      python: {
        label: "Python",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      javascript: {
        label: "JavaScript",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
    };

    return (
      languages[language] || {
        label: language || "Unknown",
        className: "bg-slate-50 text-slate-700 border-slate-200",
      }
    );
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Hard: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      configs[difficulty] ||
      "bg-slate-50 text-slate-600 border-slate-200"
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const problemTitle =
        submission.problem?.title?.toLowerCase() || "";

      const matchesSearch = problemTitle.includes(
        search.toLowerCase().trim()
      );

      const matchesStatus =
        statusFilter === "All" ||
        submission.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, search, statusFilter]);

  const stats = useMemo(() => {
    const accepted = submissions.filter(
      (submission) => submission.status === "Accepted"
    ).length;

    const wrongAnswer = submissions.filter(
      (submission) => submission.status === "Wrong Answer"
    ).length;

    const errors = submissions.filter(
      (submission) =>
        submission.status === "Compilation Error" ||
        submission.status === "Runtime Error" ||
        submission.status === "Time Limit Exceeded"
    ).length;

    return {
      total: submissions.length,
      accepted,
      wrongAnswer,
      errors,
    };
  }, [submissions]);

  const acceptanceRate =
    stats.total > 0
      ? Math.round((stats.accepted / stats.total) * 100)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 animate-pulse">
            <div className="h-3 w-36 rounded bg-slate-200" />
            <div className="mt-3 h-9 w-64 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 rounded bg-slate-200" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-6 h-20 animate-pulse rounded-2xl border border-slate-200 bg-white" />

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchSubmissions}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Submission History
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              My Submissions
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Track your coding solutions, review results and monitor
              your progress.
            </p>
          </div>

          <Link
            to="/problems"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <span>+</span>
            Solve Problems
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Submissions
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-slate-900">
                {stats.total}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ↗
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Accepted
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-emerald-600">
                {stats.accepted}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                ✓
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wrong Answers
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-red-600">
                {stats.wrongAnswer}
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                ×
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Acceptance Rate
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-violet-600">
                {acceptanceRate}%
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                %
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        {submissions.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by problem name..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 lg:w-56"
              >
                <option value="All">All Status</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Compilation Error">
                  Compilation Error
                </option>
                <option value="Runtime Error">Runtime Error</option>
                <option value="Time Limit Exceeded">
                  Time Limit Exceeded
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Empty State */}
        {submissions.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 font-mono text-2xl font-black text-slate-500">
              {"</>"}
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No submissions yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start solving coding problems and your submissions,
              results and statistics will appear here.
            </p>

            <Link
              to="/problems"
              className="mt-7 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Start Solving →
            </Link>
          </div>
        )}

        {/* No Filter Results */}
        {submissions.length > 0 &&
          filteredSubmissions.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="text-4xl">🔎</div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No matching submissions
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* Desktop Table */}
        {filteredSubmissions.length > 0 && (
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Submission Results
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing {filteredSubmissions.length} of{" "}
                    {submissions.length} submissions
                  </p>
                </div>

                <button
                  onClick={fetchSubmissions}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100 bg-slate-50/70">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Problem
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Language
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tests
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Performance
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.map((submission) => {
                    const status = getStatusConfig(submission.status);
                    const language = getLanguageConfig(
                      submission.language
                    );

                    return (
                      <tr
                        key={submission._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-black text-slate-600">
                              {"</>"}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-bold text-slate-900">
                                {submission.problem?.title ||
                                  "Deleted Problem"}
                              </p>

                              {submission.problem?.difficulty && (
                                <span
                                  className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${getDifficultyConfig(
                                    submission.problem.difficulty
                                  )}`}
                                >
                                  {submission.problem.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${language.className}`}
                          >
                            {language.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold ${status.className}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-800">
                            {submission.testCasesPassed || 0}
                          </span>

                          <span className="text-sm text-slate-400">
                            {" "}
                            / {submission.totalTestCases || 0}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="text-xs text-slate-500">
                            <p>
                              <span className="font-semibold text-slate-700">
                                {submission.runtime ?? 0} ms
                              </span>
                            </p>

                            <p className="mt-1">
                              {submission.memory ?? 0} KB
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="whitespace-nowrap text-xs text-slate-500">
                            {formatDate(submission.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            to={`/submissions/${submission._id}`}
                            className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-900 hover:text-white"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {filteredSubmissions.length > 0 && (
          <div className="mt-6 space-y-4 lg:hidden">
            {filteredSubmissions.map((submission) => {
              const status = getStatusConfig(submission.status);
              const language = getLanguageConfig(
                submission.language
              );

              return (
                <div
                  key={submission._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-black text-slate-600">
                        {"</>"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {submission.problem?.title ||
                            "Deleted Problem"}
                        </h3>

                        {submission.problem?.difficulty && (
                          <span
                            className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${getDifficultyConfig(
                              submission.problem.difficulty
                            )}`}
                          >
                            {submission.problem.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Language
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-md border px-2 py-1 text-xs font-bold ${language.className}`}
                      >
                        {language.label}
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Test Cases
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {submission.testCasesPassed || 0} /{" "}
                        {submission.totalTestCases || 0}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Runtime
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {submission.runtime ?? 0} ms
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Memory
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {submission.memory ?? 0} KB
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      {formatDate(submission.createdAt)}
                    </p>

                    <Link
                      to={`/submissions/${submission._id}`}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
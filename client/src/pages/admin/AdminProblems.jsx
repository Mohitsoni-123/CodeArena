import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CirclePlus,
  Code2,
  FileCode2,
  Filter,
  ListFilter,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import api from "../../services/api";

const AdminProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/problems");

      setProblems(response.data.problems || []);
    } catch (error) {
      console.error("Fetch Problems Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch problems"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/problems/${id}`);

      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== id)
      );
    } catch (error) {
      console.error("Delete Problem Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete problem"
      );
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        problem.title?.toLowerCase().includes(query) ||
        problem.topics?.some((topic) =>
          topic.toLowerCase().includes(query)
        );

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  const totalProblems = problems.length;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === "Easy"
  ).length;

  const mediumProblems = problems.filter(
    (problem) => problem.difficulty === "Medium"
  ).length;

  const hardProblems = problems.filter(
    (problem) => problem.difficulty === "Hard"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
  };

  const getDifficultyConfig = (level) => {
    if (level === "Easy") {
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    }

    if (level === "Medium") {
      return {
        text: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        dot: "bg-amber-400",
      };
    }

    if (level === "Hard") {
      return {
        text: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        dot: "bg-rose-400",
      };
    }

    return {
      text: "text-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      dot: "bg-slate-400",
    };
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#080b12] text-white">
        <div className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="h-4 w-32 rounded bg-slate-800" />
                <div className="h-9 w-72 rounded-lg bg-slate-800" />
                <div className="h-4 w-96 max-w-full rounded bg-slate-800" />
              </div>

              <div className="h-12 w-44 rounded-xl bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl border border-slate-800 bg-[#0d111a]"
                />
              ))}
            </div>

            <div className="h-20 rounded-2xl border border-slate-800 bg-[#0d111a]" />

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a]">
              <div className="space-y-5 p-6">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-14 rounded-xl bg-slate-800/70"
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#080b12] p-4 text-white sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">

          <div className="w-full rounded-3xl border border-rose-500/20 bg-[#0d111a] p-8 text-center shadow-2xl shadow-black/20">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
              <AlertCircle className="h-8 w-8 text-rose-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Unable to load problems
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
              onClick={fetchProblems}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#080b12] text-white">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

        {/* ================= HEADER ================= */}

        <section className="mb-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Admin Control Center
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                Problems
              </div>

              <div className="flex items-start gap-4">

                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 sm:flex">
                  <Code2 className="h-7 w-7 text-blue-400" />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    Manage Problems
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                    Create, organize and maintain coding challenges
                    available across CodeArena.
                  </p>
                </div>

              </div>
            </div>

            <Link
              to="/admin/problems/create"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <CirclePlus className="h-5 w-5" />
              Create Problem
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* Total */}

          <div className="group rounded-2xl border border-slate-800 bg-[#0d111a] p-5 transition hover:border-slate-700 hover:bg-[#10151f]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total
                </p>

                <p className="mt-3 text-3xl font-black tracking-tight">
                  {totalProblems}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Coding problems
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <FileCode2 className="h-5 w-5 text-blue-400" />
              </div>

            </div>
          </div>

          {/* Easy */}

          <div className="group rounded-2xl border border-slate-800 bg-[#0d111a] p-5 transition hover:border-emerald-500/20 hover:bg-[#10151f]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Easy
                </p>

                <p className="mt-3 text-3xl font-black tracking-tight text-emerald-400">
                  {easyProblems}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Beginner friendly
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

            </div>
          </div>

          {/* Medium */}

          <div className="group rounded-2xl border border-slate-800 bg-[#0d111a] p-5 transition hover:border-amber-500/20 hover:bg-[#10151f]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Medium
                </p>

                <p className="mt-3 text-3xl font-black tracking-tight text-amber-400">
                  {mediumProblems}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Intermediate
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>

            </div>
          </div>

          {/* Hard */}

          <div className="group rounded-2xl border border-slate-800 bg-[#0d111a] p-5 transition hover:border-rose-500/20 hover:bg-[#10151f]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Hard
                </p>

                <p className="mt-3 text-3xl font-black tracking-tight text-rose-400">
                  {hardProblems}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Advanced
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>

            </div>
          </div>

        </section>

        {/* ================= FILTER BAR ================= */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-[#0d111a] p-4 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-xl">

              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder="Search by problem title or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-800 bg-[#080b12] pl-11 pr-11 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

            </div>

            {/* Filters */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Filter className="h-4 w-4" />
                Difficulty
              </div>

              <div className="flex flex-wrap gap-2">

                {["All", "Easy", "Medium", "Hard"].map((level) => {
                  const active = difficulty === level;

                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                          : "border-slate-800 bg-[#080b12] text-slate-500 hover:border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}

              </div>

            </div>

          </div>

          {/* Filter info */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ListFilter className="h-4 w-4" />

              Showing
              <span className="font-bold text-slate-300">
                {filteredProblems.length}
              </span>
              of
              <span className="font-bold text-slate-300">
                {totalProblems}
              </span>
              problems
            </div>

            {(search || difficulty !== "All") && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-blue-400 transition hover:text-blue-300"
              >
                Clear filters
              </button>
            )}

          </div>

        </section>

        {/* ================= EMPTY STATE ================= */}

        {filteredProblems.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-800 bg-[#0d111a] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60">
              <Search className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-200">
              No problems found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              No problems match your current search or difficulty
              filter.
            </p>

            {(search || difficulty !== "All") && (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                Clear Filters
              </button>
            )}

          </section>
        ) : (
          <>

            {/* ================= DESKTOP TABLE ================= */}

            <section className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0d111a] shadow-2xl shadow-black/10 md:block">

              {/* Table header */}

              <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">

                <div>
                  <h2 className="text-sm font-bold text-slate-200">
                    Problem Library
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage all coding challenges
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-[#080b12] px-3 py-1.5 text-xs font-bold text-slate-400">
                  {filteredProblems.length} results
                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-800 bg-[#0a0e16]">

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Problem
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Difficulty
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Topics
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/70">

                    {filteredProblems.map((problem) => {
                      const config = getDifficultyConfig(
                        problem.difficulty
                      );

                      return (
                        <tr
                          key={problem._id}
                          className="group transition hover:bg-white/[0.015]"
                        >

                          {/* Problem */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#080b12] text-xs font-black text-slate-500 transition group-hover:border-blue-500/20 group-hover:text-blue-400">
                                <FileCode2 className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-slate-200 transition group-hover:text-white">
                                  {problem.title}
                                </p>

                                <p className="mt-1 font-mono text-[10px] text-slate-600">
                                  #{problem._id.slice(-8)}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Difficulty */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.bg} ${config.border} ${config.text}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                              />
                              {problem.difficulty}
                            </span>

                          </td>

                          {/* Topics */}

                          <td className="px-6 py-5">

                            <div className="flex max-w-lg flex-wrap gap-1.5">

                              {problem.topics?.length ? (
                                problem.topics.map(
                                  (topic, index) => (
                                    <span
                                      key={`${topic}-${index}`}
                                      className="rounded-lg border border-slate-800 bg-[#080b12] px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition group-hover:text-slate-400"
                                    >
                                      {topic}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-xs text-slate-600">
                                  No topics
                                </span>
                              )}

                            </div>

                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <Link
                                to={`/admin/problems/${problem._id}/edit`}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080b12] px-3.5 py-2.5 text-xs font-bold text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Link>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    problem._id,
                                    problem.title
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080b12] px-3.5 py-2.5 text-xs font-bold text-slate-500 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </section>

            {/* ================= MOBILE CARDS ================= */}

            <section className="space-y-3 md:hidden">

              {filteredProblems.map((problem) => {
                const config = getDifficultyConfig(
                  problem.difficulty
                );

                return (
                  <article
                    key={problem._id}
                    className="rounded-2xl border border-slate-800 bg-[#0d111a] p-4 shadow-xl shadow-black/10"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-[#080b12]">
                          <FileCode2 className="h-4 w-4 text-blue-400" />
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate text-sm font-bold text-slate-200">
                            {problem.title}
                          </h3>

                          <p className="mt-1 font-mono text-[10px] text-slate-600">
                            #{problem._id.slice(-8)}
                          </p>

                        </div>

                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${config.bg} ${config.border} ${config.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />
                        {problem.difficulty}
                      </span>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">

                      {problem.topics?.length ? (
                        problem.topics.map((topic, index) => (
                          <span
                            key={`${topic}-${index}`}
                            className="rounded-lg border border-slate-800 bg-[#080b12] px-2.5 py-1 text-[10px] font-semibold text-slate-500"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600">
                          No topics
                        </span>
                      )}

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4">

                      <Link
                        to={`/admin/problems/${problem._id}/edit`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#080b12] py-2.5 text-xs font-bold text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            problem._id,
                            problem.title
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#080b12] py-2.5 text-xs font-bold text-slate-500 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>

                    </div>

                  </article>
                );
              })}

            </section>

          </>
        )}

      </main>
    </div>
  );
};

export default AdminProblems;
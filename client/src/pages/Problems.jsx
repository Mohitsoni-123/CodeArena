import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Problems = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") || "All",
  );

  const [sortBy, setSortBy] = useState("number");

  const [page, setPage] = useState(1);

  const problemsPerPage = 10;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/problems");

        const data = response.data;

        if (Array.isArray(data)) {
          setProblems(data);
        } else if (Array.isArray(data?.problems)) {
          setProblems(data.problems);
        } else if (Array.isArray(data?.data)) {
          setProblems(data.data);
        } else {
          setProblems([]);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load problems.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (difficulty !== "All") {
      params.difficulty = difficulty;
    }

    setSearchParams(params, { replace: true });
    setPage(1);
  }, [search, difficulty, setSearchParams]);
  const [solvedProblems, setSolvedProblems] = useState(new Set());

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      if (!token) {
        setSolvedProblems(new Set());
        return;
      }

      try {
        const response = await api.get("/submissions/my");

        const submissions = response.data?.submissions || [];

        const acceptedProblems = new Set();

        submissions.forEach((submission) => {
          if (submission.status !== "Accepted") return;

          const problemId =
            submission.problem?._id ||
            submission.problem?.id ||
            submission.problem;

          const problemVersion = submission.problemVersion;

          if (problemId && problemVersion) {
            acceptedProblems.add(`${String(problemId)}-${problemVersion}`);
          }
        });

        setSolvedProblems(acceptedProblems);
      } catch (error) {
        console.error("Fetch solved problems error:", error);
        setSolvedProblems(new Set());
      }
    };

    fetchSolvedProblems();
  }, [token]);

  const filteredProblems = useMemo(() => {
    let result = [...problems];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((problem) => {
        const title = problem.title?.toLowerCase() || "";

        const topics = Array.isArray(problem.topics)
          ? problem.topics.join(" ").toLowerCase()
          : "";

        return title.includes(searchValue) || topics.includes(searchValue);
      });
    }

    if (difficulty !== "All") {
      result = result.filter((problem) => problem.difficulty === difficulty);
    }

    if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    if (sortBy === "difficulty") {
      const order = {
        Easy: 1,
        Medium: 2,
        Hard: 3,
      };

      result.sort(
        (a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0),
      );
    }

    return result;
  }, [problems, search, difficulty, sortBy]);

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const startIndex = (page - 1) * problemsPerPage;

  const visibleProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage,
  );

  const getDifficultyStyle = (level) => {
    if (level === "Easy") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (level === "Medium") {
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    }

    return "border-red-500/20 bg-red-500/10 text-red-400";
  };

  const getAcceptance = (problem) => {
    if (problem.acceptance !== undefined && problem.acceptance !== null) {
      return `${problem.acceptance}%`;
    }

    return "—";
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
    setSortBy("number");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ================= HEADER ================= */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1500px] px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Practice Arena
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                Problems
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Practice algorithms, improve your problem-solving skills, and
                become a stronger developer.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
                <p className="text-xl font-black text-white">
                  {problems.length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Problems
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 px-5 py-3 text-center">
                <p className="text-xl font-black text-emerald-400">
                  {solvedProblems.size}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Solved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 shadow-xl shadow-black/10 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row">
            {/* Search */}

            <div className="group flex flex-1 items-center rounded-xl border border-white/10 bg-slate-900/70 px-4 transition focus-within:border-violet-500/40 focus-within:bg-slate-900">
              <span className="text-lg text-slate-600 group-focus-within:text-violet-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by problem name or topic..."
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-700"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-slate-600 transition hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Difficulty */}

            <div className="flex rounded-xl border border-white/10 bg-slate-900/70 p-1">
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 ${
                    difficulty === level
                      ? "bg-violet-500/15 text-violet-300 shadow-sm"
                      : "text-slate-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Sort */}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-400 outline-none transition focus:border-violet-500/40"
            >
              <option value="number">Sort: Default</option>
              <option value="title">Sort: Title</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>
          </div>

          {/* Active filters */}

          {(search || difficulty !== "All") && (
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-xs text-slate-600">
                Showing{" "}
                <span className="font-bold text-slate-400">
                  {filteredProblems.length}
                </span>{" "}
                matching problems
              </p>

              <button
                onClick={clearFilters}
                className="text-xs font-bold text-violet-400 transition hover:text-violet-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ================= PROBLEM LIST ================= */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 shadow-2xl shadow-black/10">
          {/* Table Header */}

          <div className="hidden grid-cols-[70px_minmax(0,1fr)_140px_110px_100px] border-b border-white/10 bg-white/[0.025] px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600 md:grid">
            <span>#</span>
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
            <span className="text-right">Status</span>
          </div>

          {/* Loading */}

          {loading && (
            <div className="divide-y divide-white/5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="animate-pulse px-5 py-5 md:px-6">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5" />

                    <div className="flex-1">
                      <div className="h-4 w-48 rounded bg-white/5" />
                      <div className="mt-2 h-3 w-32 rounded bg-white/5" />
                    </div>

                    <div className="h-7 w-20 rounded-lg bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-xl">
                ⚠
              </div>

              <h2 className="mt-5 text-lg font-black">
                Unable to load problems
              </h2>

              <p className="mt-2 text-sm text-slate-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-xs font-black text-white transition hover:bg-violet-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loading && !error && filteredProblems.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl">
                ⌕
              </div>

              <h2 className="mt-5 text-lg font-black">No problems found</h2>

              <p className="mt-2 text-sm text-slate-600">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Problems */}

          {!loading && !error && visibleProblems.length > 0 && (
            <div className="divide-y divide-white/5">
              {visibleProblems.map((problem, index) => {
                const problemId = String(problem._id || problem.id);
                const solved = solvedProblems.has(
                  `${problemId}-${problem.version || 1}`,
                );
                const problemNumber = startIndex + index + 1;

                return (
                  <Link
                    key={problem._id || problem.id}
                    to={`/problems/${problem._id || problem.id}`}
                    className="group block px-5 py-5 transition duration-200 hover:bg-white/[0.035] md:px-6"
                  >
                    {/* Desktop */}

                    <div className="hidden grid-cols-[70px_minmax(0,1fr)_140px_110px_100px] items-center md:grid">
                      {/* Number */}

                      <div>
                        {solved ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-black text-emerald-400">
                            ✓
                          </div>
                        ) : (
                          <span className="font-mono text-sm text-slate-600">
                            {problemNumber}
                          </span>
                        )}
                      </div>

                      {/* Title */}

                      <div className="min-w-0 pr-6">
                        <h3 className="truncate text-sm font-bold text-slate-200 transition group-hover:text-violet-300">
                          {problem.title}
                        </h3>

                        {problem.topics?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {problem.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] font-semibold text-slate-600"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Difficulty */}

                      <div>
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-1.5 text-[10px] font-black ${getDifficultyStyle(
                            problem.difficulty,
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Acceptance */}

                      <div className="font-mono text-xs text-slate-600">
                        {getAcceptance(problem)}
                      </div>

                      {/* Status */}

                      <div className="text-right">
                        {solved ? (
                          <span className="text-xs font-bold text-emerald-400">
                            Solved
                          </span>
                        ) : (
                          <span className="text-xs text-slate-700">
                            Unsolved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mobile */}

                    <div className="flex items-start gap-3 md:hidden">
                      <div className="shrink-0 pt-0.5">
                        {solved ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-black text-emerald-400">
                            ✓
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-xs text-slate-600">
                            {problemNumber}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold leading-6 text-slate-200 group-hover:text-violet-300">
                            {problem.title}
                          </h3>

                          <span
                            className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-black ${getDifficultyStyle(
                              problem.difficulty,
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        {problem.topics?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {problem.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] text-slate-600"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-[10px] font-semibold text-slate-700">
                          <span>Acceptance: {getAcceptance(problem)}</span>

                          {solved && (
                            <span className="text-emerald-400">✓ Solved</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= PAGINATION ================= */}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Page <span className="font-bold text-slate-400">{page}</span> of{" "}
              <span className="font-bold text-slate-400">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Problems;

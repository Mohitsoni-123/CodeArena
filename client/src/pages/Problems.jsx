import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const practiceTabs = [
  {
    label: "Company Asked",
    icon: (
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 7h3M8 11h3M8 15h3M14 7h2M14 11h2M14 15h2" />
      </svg>
    ),
  },
  {
    label: "Pattern Based",
    icon: (
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    label: "Asked Frequency",
    icon: (
      <svg
        className="h-[18px] w-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12h4l3-7 4 14 3-7h4" />
      </svg>
    ),
  },
];

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

  const [solvedProblems, setSolvedProblems] = useState(new Set());

  const [activeCategory, setActiveCategory] = useState("All");
  const [activePracticeTab, setActivePracticeTab] = useState("Pattern Based");

  const problemsPerPage = 10;

  // ================= FETCH PROBLEMS =================

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

  // ================= URL FILTERS =================

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

  // ================= FETCH SOLVED PROBLEMS =================

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

          if (problemId) {
            acceptedProblems.add(String(problemId));
          }
        });

        setSolvedProblems(acceptedProblems);
      } catch (err) {
        console.error("Fetch solved problems error:", err);
        setSolvedProblems(new Set());
      }
    };

    fetchSolvedProblems();
  }, [token]);

  // ================= PROGRESS =================

  const totalProblems = problems.length;

  const solvedCount = problems.filter((problem) =>
    solvedProblems.has(String(problem._id || problem.id)),
  ).length;

  const progressPercentage =
    totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  const easyProblems = problems.filter(
    (problem) => problem.difficulty === "Easy",
  );

  const mediumProblems = problems.filter(
    (problem) => problem.difficulty === "Medium",
  );

  const hardProblems = problems.filter(
    (problem) => problem.difficulty === "Hard",
  );

  const countSolved = (list) =>
    list.filter((problem) =>
      solvedProblems.has(String(problem._id || problem.id)),
    ).length;

  // ================= FILTER & SORT =================

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

    if (activeCategory !== "All") {
      result = result.filter(
        (problem) => problem.difficulty === activeCategory,
      );
    }

    if (activePracticeTab === "Company Asked") {
      result = result.filter(
        (problem) =>
          Array.isArray(problem.companyTags) && problem.companyTags.length > 0,
      );
    }

    if (activePracticeTab === "Asked Frequency") {
      result.sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
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
  }, [problems, search, difficulty, sortBy, activeCategory, activePracticeTab]);

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const startIndex = (page - 1) * problemsPerPage;

  const visibleProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage,
  );

  // ================= HELPERS =================

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
    setActiveCategory("All");
    setSortBy("number");
    setActivePracticeTab("Pattern Based");
    setPage(1);
  };

  // ================= UI =================

  return (
    <main className="min-h-screen bg-[#111113] text-white">
      {/* ================= DASHBOARD HEADER ================= */}

      <section className="border-b border-white/[0.08]">
        <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* LEFT SIDE */}

            <div>
              {/* BREADCRUMB */}
              

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                DSA Practice Set
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Build your problem-solving skills with DSA practice organized by
                topic and pattern. Work through challenging problems
                and prepare for coding interviews.
              </p>

              {/* PRACTICE TABS (no onClick) */}

              <div
                role="tablist"
                aria-label="Practice type"
                className="mt-7 inline-flex max-w-full flex-wrap items-center rounded-xl border border-white/10 bg-[#141416] p-1"
              >
                {practiceTabs.map((tab, index) => (
                  <div key={tab.label} className="flex items-center">
                    {index !== 0 && <span className="h-5 w-px bg-white/10" />}

                    <button
                      type="button"
                      className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-200"
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: PROGRESS CARD */}

            <div>
              <p className="mb-3 text-sm font-medium text-slate-400">
                Your Progress
              </p>

              <div className="rounded-3xl border border-white/[0.08] bg-[#18181b] p-5 sm:p-6">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-bold tracking-tight">
                    {progressPercentage}%
                  </span>

                  <span className="pb-1 text-sm text-slate-500">
                    {solvedCount} / {totalProblems} problems solved
                  </span>
                </div>

                {/* PROGRESS BAR */}

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* DIFFICULTY PROGRESS */}

                <div className="mt-7 grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Basic",
                      list: easyProblems,
                      color: "bg-emerald-400",
                    },
                    {
                      label: "Core",
                      list: mediumProblems,
                      color: "bg-amber-400",
                    },
                    { label: "Pro", list: hardProblems, color: "bg-red-400" },
                  ].map(({ label, list, color }) => (
                    <div key={label}>
                      <p className="text-xs text-slate-500">{label}</p>

                      <p className="mt-2 text-sm font-semibold">
                        {countSolved(list)} / {list.length}
                      </p>

                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${color}`}
                          style={{
                            width: `${
                              list.length
                                ? (countSolved(list) / list.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROBLEMS CONTENT ================= */}

      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* FILTER TOOLBAR */}

        <div className="rounded-2xl border border-white/[0.08] bg-[#18181b]/70 p-3 sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            {/* SEARCH */}

            <div className="flex flex-1 items-center rounded-xl border border-white/[0.08] bg-[#111827]/80 px-4 transition focus-within:border-violet-500/50">
              <svg
                className="h-5 w-5 shrink-0 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-lg text-slate-500 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* DIFFICULTY */}

            <div className="flex flex-wrap rounded-xl border border-white/[0.08] bg-[#111827]/80 p-1">
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setDifficulty(level);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    difficulty === level
                      ? "bg-violet-500/20 text-violet-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#111827] px-4 py-3 text-xs font-semibold text-slate-300 outline-none focus:border-violet-500/50"
            >
              <option value="number">Sort: Default</option>
              <option value="title">Sort: Title</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>
          </div>

          {/* RESULT COUNT */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {filteredProblems.length}
              </span>{" "}
              problems
            </p>

            {(search ||
              difficulty !== "All" ||
              activeCategory !== "All" ||
              activePracticeTab !== "Pattern Based") && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-violet-400 transition hover:text-violet-300"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* ================= PROBLEMS TABLE ================= */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1020]/80">
          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[65px_minmax(0,1fr)_130px_120px_100px] border-b border-white/[0.08] bg-white/[0.025] px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 md:grid">
            <span>#</span>
            <span>Problem</span>
            <span>Difficulty</span>
            <span>Acceptance</span>
            <span className="text-right">Status</span>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="divide-y divide-white/[0.05]">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="animate-pulse px-5 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5" />

                    <div className="flex-1">
                      <div className="h-4 w-48 rounded bg-white/5" />
                      <div className="mt-3 h-3 w-32 rounded bg-white/5" />
                    </div>

                    <div className="h-7 w-16 rounded-lg bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="px-6 py-16 text-center">
              <div className="text-3xl">⚠️</div>

              <h2 className="mt-4 text-lg font-bold">
                Unable to load problems
              </h2>

              <p className="mt-2 text-sm text-slate-500">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-xs font-bold hover:bg-violet-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading && !error && filteredProblems.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="text-4xl text-slate-600">⌕</div>

              <h2 className="mt-4 text-lg font-bold">No problems found</h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another search or change the filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-white/10 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-white/5"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* PROBLEM ROWS */}

          {!loading && !error && visibleProblems.length > 0 && (
            <div className="divide-y divide-white/[0.05]">
              {visibleProblems.map((problem, index) => {
                const problemId = String(problem._id || problem.id);

                const solved = solvedProblems.has(problemId);

                const problemNumber = startIndex + index + 1;

                return (
                  <Link
                    key={problemId}
                    to={`/problems/${problemId}`}
                    className="group block px-5 py-5 transition hover:bg-white/[0.025] md:px-6"
                  >
                    {/* DESKTOP ROW */}

                    <div className="hidden grid-cols-[65px_minmax(0,1fr)_130px_120px_100px] items-center md:grid">
                      {/* NUMBER / SOLVED */}

                      <div>
                        {solved ? (
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-emerald-400">
                            ✓
                          </span>
                        ) : (
                          <span className="font-mono text-sm text-slate-500">
                            {problemNumber}
                          </span>
                        )}
                      </div>

                      {/* TITLE / TOPICS */}

                      <div className="min-w-0 pr-5">
                        <h3 className="truncate text-sm font-semibold text-slate-200 transition group-hover:text-violet-300">
                          {problem.title}
                        </h3>

                        {Array.isArray(problem.topics) &&
                          problem.topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {problem.topics.slice(0, 4).map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] text-slate-500"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* DIFFICULTY */}

                      <div>
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-1.5 text-[10px] font-bold ${getDifficultyStyle(
                            problem.difficulty,
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* ACCEPTANCE */}

                      <div className="font-mono text-xs text-slate-500">
                        {getAcceptance(problem)}
                      </div>

                      {/* STATUS */}

                      <div className="text-right">
                        {solved ? (
                          <span className="text-xs font-semibold text-emerald-400">
                            Solved
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">
                            Unsolved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MOBILE ROW */}

                    <div className="flex items-start gap-3 md:hidden">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-xs text-slate-400">
                        {solved ? (
                          <span className="font-bold text-emerald-400">✓</span>
                        ) : (
                          problemNumber
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold leading-6 text-slate-200 group-hover:text-violet-300">
                            {problem.title}
                          </h3>

                          <span
                            className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-bold ${getDifficultyStyle(
                              problem.difficulty,
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        {Array.isArray(problem.topics) &&
                          problem.topics.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {problem.topics.slice(0, 3).map((topic) => (
                                <span
                                  key={topic}
                                  className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] text-slate-500"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                          <span>Acceptance: {getAcceptance(problem)}</span>

                          {solved && (
                            <span className="font-semibold text-emerald-400">
                              ✓ Solved
                            </span>
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
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Page <span className="font-semibold text-white">{page}</span> of{" "}
              <span className="font-semibold text-white">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}

        <div className="mt-10 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-xs text-slate-600">
            Keep practicing. Every problem makes you better.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Problems;

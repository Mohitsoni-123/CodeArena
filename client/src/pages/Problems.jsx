import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Problems() {
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

  const stats = useMemo(() => {
    return {
      total: problems.length,
      easy: problems.filter(
        (problem) => problem.difficulty === "Easy"
      ).length,
      medium: problems.filter(
        (problem) => problem.difficulty === "Medium"
      ).length,
      hard: problems.filter(
        (problem) => problem.difficulty === "Hard"
      ).length,
    };
  }, [problems]);

  const getDifficultyClasses = (level) => {
    if (level === "Easy") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (level === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-4 w-44 rounded bg-slate-200" />

          <div className="mt-4 h-10 w-72 rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="mt-8 h-20 rounded-2xl bg-white shadow-sm" />

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-64 rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load problems
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={fetchProblems}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ============================
            HEADER
        ============================ */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-700">
              <span>⚡</span>
              CODE • PRACTICE • IMPROVE
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Coding Problems
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Sharpen your problem-solving skills by solving
              carefully designed coding challenges.
            </p>
          </div>

          {/* RESULT COUNT */}

          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Showing
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900">
                {filteredProblems.length}
              </span>

              <span className="pb-1 text-sm font-medium text-slate-500">
                of {problems.length} problems
              </span>
            </div>
          </div>
        </div>

        {/* ============================
            STATS
        ============================ */}

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                📚
              </div>

              <span className="text-xs font-bold text-slate-400">
                TOTAL
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-slate-900">
              {stats.total}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              All problems
            </p>
          </div>

          {/* EASY */}

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                🟢
              </div>

              <span className="text-xs font-bold text-emerald-600">
                EASY
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-slate-900">
              {stats.easy}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Beginner friendly
            </p>
          </div>

          {/* MEDIUM */}

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg">
                🟡
              </div>

              <span className="text-xs font-bold text-amber-600">
                MEDIUM
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-slate-900">
              {stats.medium}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Intermediate level
            </p>
          </div>

          {/* HARD */}

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-lg">
                🔴
              </div>

              <span className="text-xs font-bold text-red-600">
                HARD
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-slate-900">
              {stats.hard}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Advanced level
            </p>
          </div>
        </div>

        {/* ============================
            SEARCH + FILTER
        ============================ */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by problem title or topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* FILTER */}

            <div className="lg:w-56">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="All">
                  All Difficulties
                </option>

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>
          </div>

          {/* ACTIVE FILTER INFO */}

          {(search || difficulty !== "All") && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">

              <span className="text-xs font-semibold text-slate-400">
                Active filters:
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                >
                  Search: "{search}" ×
                </button>
              )}

              {difficulty !== "All" && (
                <button
                  type="button"
                  onClick={() => setDifficulty("All")}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700"
                >
                  {difficulty} ×
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setDifficulty("All");
                }}
                className="ml-auto text-xs font-bold text-red-500 hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ============================
            EMPTY STATE
        ============================ */}

        {filteredProblems.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              🔎
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No problems found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any problems matching your
              current search or difficulty filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setDifficulty("All");
              }}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* ============================
                PROBLEM GRID
            ============================ */}

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* CARD TOP */}

                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
                      #{String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getDifficultyClasses(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* CARD BODY */}

                  <div className="flex flex-1 flex-col p-5">

                    <h2 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900 transition group-hover:text-blue-600">
                      {problem.title}
                    </h2>

                    {/* TOPICS */}

                    <div className="mt-4 flex min-h-[52px] flex-wrap content-start gap-2">
                      {problem.topics?.length > 0 ? (
                        problem.topics.map((topic, topicIndex) => (
                          <span
                            key={`${topic}-${topicIndex}`}
                            className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No topics specified
                        </span>
                      )}
                    </div>

                    {/* DIVIDER */}

                    <div className="my-5 h-px bg-slate-100" />

                    {/* SOLVE BUTTON */}

                    <Link
                      to={`/problems/${problem._id}`}
                      className="mt-auto flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-blue-600"
                    >
                      <span>
                        Solve Problem
                      </span>

                      <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Problems;
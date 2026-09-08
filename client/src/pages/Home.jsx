import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* ================= HERO ================= */}

      <section className="relative">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -left-40 top-40 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 top-60 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1500px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* LEFT */}

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
              The coding platform for developers
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Master
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {" "}Coding.
              </span>

              <br />

              Build Your
              <span className="text-slate-400">
                {" "}Future.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Solve coding problems, sharpen your DSA skills, track your
              progress and become a better developer — one problem at a time.
            </p>

            {/* Buttons */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/problems"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-900/30 transition duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20"
              >
                Start Solving
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/problems"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.07] hover:text-white"
              >
                Explore Problems
                <span>⌘</span>
              </Link>
            </div>

            {/* Trust */}

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Beginner Friendly
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Multiple Difficulties
              </span>

              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Track Progress
              </span>
            </div>
          </div>

          {/* RIGHT CODE CARD */}

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-violet-600/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-xl">

              {/* Window Header */}

              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>

                <span className="font-mono text-[10px] text-slate-600">
                  solution.cpp
                </span>

                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-400">
                  C++
                </span>
              </div>

              {/* Code */}

              <div className="p-5 font-mono text-xs leading-7 sm:p-7 sm:text-sm">
                <div>
                  <span className="text-violet-400">#include</span>{" "}
                  <span className="text-emerald-300">
                    &lt;bits/stdc++.h&gt;
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-violet-400">using</span>{" "}
                  <span className="text-blue-300">namespace</span>{" "}
                  <span className="text-white">std;</span>
                </div>

                <div className="mt-4">
                  <span className="text-violet-400">int</span>{" "}
                  <span className="text-blue-300">main</span>
                  <span className="text-white">() {"{"}</span>
                </div>

                <div className="pl-5">
                  <span className="text-violet-400">int</span>{" "}
                  <span className="text-white">n;</span>
                </div>

                <div className="pl-5">
                  <span className="text-blue-300">cin</span>
                  <span className="text-white"> &gt;&gt; n;</span>
                </div>

                <div className="pl-5">
                  <span className="text-violet-400">long long</span>{" "}
                  <span className="text-white">sum = 0;</span>
                </div>

                <div className="pl-5">
                  <span className="text-violet-400">for</span>{" "}
                  <span className="text-white">(</span>
                  <span className="text-violet-400">int</span>{" "}
                  <span className="text-white">i = 0; i &lt; n; i++)</span> {"{"}
                </div>

                <div className="pl-10">
                  <span className="text-blue-300">cin</span>
                  <span className="text-white"> &gt;&gt; x;</span>
                </div>

                <div className="pl-10">
                  <span className="text-white">sum += x;</span>
                </div>

                <div className="pl-5">
                  <span className="text-white">{"}"}</span>
                </div>

                <div className="pl-5">
                  <span className="text-blue-300">cout</span>
                  <span className="text-white"> &lt;&lt; sum;</span>
                </div>

                <div>
                  <span className="text-white">{"}"}</span>
                </div>
              </div>

              {/* Result */}

              <div className="border-t border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Test Result
                    </p>

                    <p className="mt-1 text-sm font-bold text-emerald-400">
                      ✓ Accepted
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-slate-600">
                      Runtime
                    </p>

                    <p className="font-mono text-xs font-bold text-slate-400">
                      42 ms
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}

            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-8">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                Problems Solved
              </p>

              <p className="mt-1 text-xl font-black text-white">
                25+
              </p>
            </div>

            <div className="absolute -right-3 -top-5 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:-right-8">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                Success Rate
              </p>

              <p className="mt-1 text-xl font-black text-emerald-400">
                94%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ["25+", "Coding Problems"],
            ["3", "Difficulty Levels"],
            ["5+", "Programming Topics"],
            ["24/7", "Practice Anytime"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-r border-white/10 px-5 py-8 text-center last:border-r-0"
            >
              <p className="text-2xl font-black text-white sm:text-3xl">
                {value}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="relative mx-auto max-w-[1500px] px-4 py-24 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">
            Why CodeArena
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need to
            <span className="text-slate-500"> become better.</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            A focused environment designed to help developers practice,
            improve and track their coding journey.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {[
            [
              "⌘",
              "Curated Problems",
              "Practice carefully selected coding problems across multiple difficulty levels.",
            ],
            [
              "⚡",
              "Fast Execution",
              "Run your solutions and instantly see whether your approach works.",
            ],
            [
              "◈",
              "Progress Tracking",
              "Keep track of solved problems, submissions and your coding streak.",
            ],
            [
              "◉",
              "Multiple Languages",
              "Write solutions using the programming language you are comfortable with.",
            ],
            [
              "🏆",
              "Improve Your Skills",
              "Build stronger problem-solving and algorithmic thinking skills.",
            ],
            [
              "🔒",
              "Secure Platform",
              "Protected authentication and role-based access keep the platform secure.",
            ],
          ].map(([icon, title, description]) => (
            <div
              key={title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/20 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-violet-950/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-500/10 text-xl text-violet-300 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/15">
                {icon}
              </div>

              <h3 className="mt-5 text-base font-black">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WORKFLOW ================= */}

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[1500px] px-4 py-24 sm:px-6 lg:px-8">

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">
                Simple Workflow
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Learn by
                <span className="text-slate-500"> solving.</span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Stop watching tutorials endlessly. Pick a problem, think
                about the solution, write your code and learn from the result.
              </p>

              <Link
                to="/problems"
                className="mt-7 inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-black text-violet-300 transition hover:bg-violet-500/15"
              >
                Browse Problems →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                ["01", "Choose a Problem", "Pick a problem based on your skill level."],
                ["02", "Understand the Logic", "Read the description, examples and constraints."],
                ["03", "Write Your Solution", "Use the built-in coding workspace."],
                ["04", "Submit & Improve", "Check your result and improve your approach."],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/20 hover:bg-white/[0.05]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 font-mono text-xs font-black text-violet-300">
                    {number}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white">
                      {title}
                    </h3>

                    <p className="mt-1 text-xs leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-transparent" />

        <div className="relative mx-auto max-w-[1000px] px-4 py-24 text-center sm:px-6">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-2xl">
            ⚡
          </div>

          <h2 className="mt-6 text-3xl font-black sm:text-5xl">
            Your next level starts
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}with one problem.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Start practicing today and turn every accepted submission into
            progress.
          </p>

          <Link
            to="/problems"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-900/30 transition hover:-translate-y-1 hover:from-violet-500 hover:to-indigo-500"
          >
            Start Coding
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
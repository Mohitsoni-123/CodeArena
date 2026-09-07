import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute top-20 -right-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[calc(100vh-72px)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">

            {/* Hero Content */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500" />
                Practice. Code. Improve.
              </div>

              <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Master Coding.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  One Problem at a Time.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
                Practice coding problems, write better solutions, run your
                code instantly, and track your progress — all in one powerful
                coding platform.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start Coding
                  <span>→</span>
                </Link>

                <Link
                  to="/submissions"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  View Submissions
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-2xl font-black text-slate-900">100+</p>
                  <p className="text-xs font-medium text-slate-500">
                    Coding Problems
                  </p>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-black text-slate-900">4</p>
                  <p className="text-xs font-medium text-slate-500">
                    Languages
                  </p>
                </div>

                <div className="h-10 w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-black text-slate-900">24/7</p>
                  <p className="text-xs font-medium text-slate-500">
                    Practice
                  </p>
                </div>
              </div>
            </div>

            {/* Code Editor Card */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-indigo-500/10 to-blue-500/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#0b1120] shadow-2xl shadow-slate-900/15">

                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <span className="text-xs font-medium text-slate-500">
                    solution.cpp
                  </span>

                  <span className="text-xs text-slate-500">
                    C++
                  </span>
                </div>

                {/* Code */}
                <div className="overflow-x-auto p-5 sm:p-7">
                  <pre className="font-mono text-xs leading-7 sm:text-sm">
                    <code>
                      <span className="text-purple-400">#include</span>{" "}
                      <span className="text-slate-300">&lt;iostream&gt;</span>
                      {"\n\n"}
                      <span className="text-purple-400">using namespace</span>{" "}
                      <span className="text-blue-300">std</span>;
                      {"\n\n"}
                      <span className="text-purple-400">int</span>{" "}
                      <span className="text-blue-300">main</span>() {"{"}
                      {"\n"}
                      {"  "}
                      <span className="text-purple-400">int</span> a ={" "}
                      <span className="text-orange-300">10</span>;
                      {"\n"}
                      {"  "}
                      <span className="text-purple-400">int</span> b ={" "}
                      <span className="text-orange-300">20</span>;
                      {"\n\n"}
                      {"  "}
                      <span className="text-purple-400">int</span> sum = a + b;
                      {"\n\n"}
                      {"  "}
                      <span className="text-blue-300">cout</span> &lt;&lt; sum;
                      {"\n"}
                      {"  "}
                      <span className="text-purple-400">return</span>{" "}
                      <span className="text-orange-300">0</span>;
                      {"\n"}
                      {"}"}
                    </code>
                  </pre>
                </div>

                {/* Terminal */}
                <div className="border-t border-white/10 bg-black/20 px-5 py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-xs font-semibold text-slate-400">
                      Output
                    </span>
                  </div>

                  <p className="font-mono text-sm text-green-400">
                    30
                  </p>
                </div>

                {/* Bottom status */}
                <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
                  <span className="text-xs text-slate-500">
                    Test Cases
                  </span>

                  <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                    ✓ Accepted
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              WHY CODEARENA?
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to become a better coder
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              A simple and focused environment designed to help you practice,
              experiment, and improve your problem-solving skills.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* Card 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                💻
              </div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Practice Problems
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Solve coding problems across different topics and difficulty
                levels to strengthen your fundamentals.
              </p>

              <Link
                to="/problems"
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700"
              >
                Explore Problems →
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ⚡
              </div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Run Your Code
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Execute your solutions with custom input and instantly see
                whether your code produces the expected output.
              </p>

              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-blue-600">
                Instant Execution
              </span>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                📊
              </div>

              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Track Progress
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Review your submissions, monitor accepted solutions, and keep
                track of your coding journey.
              </p>

              <Link
                to="/submissions"
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-700"
              >
                View Submissions →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-[#f6f8fc] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <span className="text-xs font-bold tracking-[0.2em] text-indigo-600">
              SIMPLE WORKFLOW
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Learn by solving
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg">
                01
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Choose a Problem
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pick a problem based on your preferred topic and difficulty.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-600/20">
                02
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Write & Run Code
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Build your solution and test it with different inputs.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg">
                03
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                Improve Your Skills
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review your submissions and continue solving more problems.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-900/10 sm:px-12">

          <div className="mx-auto max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-indigo-400">
              READY TO CODE?
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Turn problems into progress.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Start solving coding problems today and build the skills you
              need for your next challenge.
            </p>

            <Link
              to="/problems"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Explore Problems
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 sm:px-6 md:flex-row lg:px-8">

          <div>
            <p className="text-sm font-black text-slate-900">
              Code<span className="text-indigo-600">Arena</span>
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Practice. Code. Improve.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
            <Link
              to="/problems"
              className="transition hover:text-indigo-600"
            >
              Problems
            </Link>

            <Link
              to="/submissions"
              className="transition hover:text-indigo-600"
            >
              Submissions
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CodeArena
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Home;
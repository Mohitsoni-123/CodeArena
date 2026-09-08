import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8">

        {/* ================= TOP ================= */}

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}

          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-violet-600/20 blur-md transition group-hover:bg-violet-600/40" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30">
                  <span className="font-mono text-sm font-black">
                    {"</>"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xl font-black tracking-tight">
                  CodeArena
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Code. Learn. Compete.
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
              Practice coding problems, improve your problem-solving skills,
              track your progress and compete with developers.
            </p>

            {/* Social */}

            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-400 transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                GH
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-bold text-slate-400 transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                in
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm font-bold text-slate-400 transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Platform */}

          <div>
            <h3 className="text-sm font-black text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/problems"
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
              >
                Problems
              </Link>

              <Link
                to="/submissions"
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
              >
                My Submissions
              </Link>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Contests
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Leaderboard
              </button>
            </div>
          </div>

          {/* Resources */}

          <div>
            <h3 className="text-sm font-black text-white">
              Resources
            </h3>

            <div className="mt-5 space-y-3">
              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Learn
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Roadmap
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Discussions
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Help Center
              </button>
            </div>
          </div>

          {/* Company */}

          <div>
            <h3 className="text-sm font-black text-white">
              CodeArena
            </h3>

            <div className="mt-5 space-y-3">
              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                About
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Contact
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Privacy
              </button>

              <button
                className="block text-sm text-slate-500 transition hover:translate-x-1 hover:text-violet-300"
                onClick={() => {}}
              >
                Terms
              </button>
            </div>
          </div>
        </div>

        {/* ================= CTA ================= */}

        <div className="mt-14 overflow-hidden rounded-3xl border border-violet-500/10 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-transparent p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  ⚡
                </span>

                <span className="text-xs font-black uppercase tracking-wider text-violet-300">
                  Keep Coding
                </span>
              </div>

              <h3 className="mt-3 text-xl font-black sm:text-2xl">
                Ready to level up your skills?
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Pick a problem and start solving today.
              </p>
            </div>

            <Link
              to="/problems"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
            >
              Start Coding
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CodeArena. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span>Built for developers</span>
            <span className="text-violet-500">•</span>
            <span className="text-violet-400">⚡</span>
            <span>Keep solving.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
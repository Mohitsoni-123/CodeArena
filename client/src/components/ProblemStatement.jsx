import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Lightbulb,
  Lock,
  Sparkles,
  Terminal,
} from "lucide-react";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

// string (new line separated) ya array dono support karta hai
const toList = (value) => {
  const items = Array.isArray(value) ? value : [value];

  return items
    .filter((item) => typeof item === "string")
    .flatMap((item) => item.split(/\r?\n/))
    .map((item) => item.trim())
    .filter(Boolean);
};

// 10^5 -> 10⁵ aur <= -> ≤
const renderMath = (text) =>
  text
    .replace(/<=/g, "≤")
    .replace(/>=/g, "≥")
    .split(/(\^-?\d+)/g)
    .map((part, i) =>
      part.startsWith("^") ? (
        <sup key={i} className="text-[0.7em]">
          {part.slice(1)}
        </sup>
      ) : (
        part
      ),
    );

const difficultyConfig = {
  Easy: {
    text: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  Medium: {
    text: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
  },
  Hard: {
    text: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/20",
    dot: "bg-rose-400",
  },
};

const SectionTitle = ({ children }) => (
  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
    {children}
  </h2>
);

// --------------------------------------------------
// EXAMPLE CARD (input / output / explanation)
// --------------------------------------------------

const ExampleCard = ({ example, index, label = "Sample" }) => (
  <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#080d15]">
    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
      <span className="text-xs font-semibold text-slate-400">
        Example {index + 1}
      </span>

      <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-400">
        {label}
      </span>
    </div>

    <div className="grid divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Input
        </p>

        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-slate-300">
          {example.input}
        </pre>
      </div>

      <div className="p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Output
        </p>

        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/30 p-3 font-mono text-xs leading-6 text-emerald-300">
          {example.output}
        </pre>
      </div>
    </div>

    {example.explanation && (
      <div className="border-t border-white/[0.06] px-4 py-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
          Explanation
        </p>

        <p className="whitespace-pre-line text-xs leading-6 text-slate-400">
          {example.explanation}
        </p>
      </div>
    )}
  </div>
);

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

const ProblemStatement = ({ problem, solved, activeTab, setActiveTab }) => {
  const [openHint, setOpenHint] = useState(null);

  const difficulty =
    difficultyConfig[problem?.difficulty] || difficultyConfig.Easy;

  const examples = Array.isArray(problem.example) ? problem.example : [];
  const constraints = toList(problem.constraints);
  const hints = toList(problem.hints);

  return (
    <section className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b111b] shadow-2xl shadow-black/20">
      {/* ---------------- HEADER ---------------- */}

      <div className="border-b border-white/[0.07] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {problem.title}
          </h1>

          {solved && (
            <CheckCircle2
              size={20}
              className="shrink-0 text-emerald-500"
              aria-label="Solved"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${difficulty.bg} ${difficulty.border} ${difficulty.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dot}`} />
            {problem.difficulty}
          </span>

          {hints.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("description");
                setOpenHint(0);
                document
                  .getElementById("problem-hints")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs text-slate-400 transition hover:text-white"
            >
              <Lightbulb size={12} />
              Hints
            </button>
          )}

          {/* Companies - locked */}
          <span className="flex cursor-not-allowed items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-xs text-slate-400">
            <Building2 size={12} />
            Companies
            <Lock size={11} className="text-blue-500" />
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Sparkles size={13} className="text-indigo-400" />
          Master this problem and improve your problem-solving skills.
        </div>
      </div>

      {/* ---------------- TABS ---------------- */}

      <div className="flex border-b border-white/[0.07] px-5 sm:px-6">
        {[
          { key: "description", label: "Description" },
          { key: "examples", label: "Examples" },
        ].map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-1 py-3.5 text-sm font-medium transition ${
              index !== 0 ? "ml-6" : ""
            } ${
              activeTab === tab.key
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab.label}

            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-indigo-500" />
            )}
          </button>
        ))}
      </div>

      {/* ---------------- CONTENT ---------------- */}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
        {activeTab === "description" ? (
          <div className="space-y-7">
            {/* Problem */}
            <div>
              <SectionTitle>Problem</SectionTitle>

              <p className="whitespace-pre-line text-[15px] leading-7 text-slate-300">
                {problem.description}
              </p>
            </div>

            {/* Examples (with explanation) */}
            {examples.length > 0 && (
              <div>
                <SectionTitle>Examples</SectionTitle>

                <div className="space-y-3">
                  {examples.slice(0, 2).map((example, index) => (
                    <ExampleCard key={index} example={example} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Constraints (bullet list) */}
            {constraints.length > 0 && (
              <div>
                <SectionTitle>Constraints</SectionTitle>

                <ul className="list-disc space-y-2 rounded-xl border border-white/[0.07] bg-black/20 py-4 pl-9 pr-4 marker:text-slate-500">
                  {constraints.map((item, index) => (
                    <li
                      key={index}
                      className="break-words text-sm leading-6 text-slate-300"
                    >
                      {renderMath(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints (accordion) */}
            {hints.length > 0 && (
              <div id="problem-hints">
                <SectionTitle>Hints</SectionTitle>

                <div className="space-y-2">
                  {hints.map((hint, index) => {
                    const isOpen = openHint === index;

                    return (
                      <div
                        key={index}
                        className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenHint(isOpen ? null : index)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/[0.03]"
                        >
                          <span className="flex items-center gap-2">
                            <Lightbulb size={14} className="text-amber-400" />
                            Hint {index + 1}
                          </span>

                          <ChevronDown
                            size={16}
                            className={`text-slate-500 transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <p className="whitespace-pre-line border-t border-white/[0.06] px-4 py-3 text-sm leading-6 text-slate-400">
                            {hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Topics */}
            {problem.topics?.length > 0 && (
              <div>
                <SectionTitle>Topics</SectionTitle>

                <div className="flex flex-wrap gap-2">
                  {problem.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg border border-indigo-500/10 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-white">
                Sample Test Cases
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Run your code against these examples before submitting.
              </p>
            </div>

            {examples.length > 0 ? (
              examples.map((example, index) => (
                <ExampleCard
                  key={index}
                  example={example}
                  index={index}
                  label="Public"
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <Terminal size={28} className="mx-auto mb-3 text-slate-700" />

                <p className="text-sm text-slate-500">
                  No example test cases available.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProblemStatement;

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  History,
  Lock,
  MemoryStick,
  X,
} from "lucide-react";

// --------------------------------------------------
// SMALL HELPERS
// --------------------------------------------------

// Label border ke upar wala input-jaisa box (image jaisa)
const Field = ({ label, value, tone = "text-white" }) => (
  <div className="relative rounded-xl border border-white/[0.08] bg-[#18181b] px-4 pb-3 pt-4">
    <span className="absolute -top-2 left-3 bg-[#141414] px-1 text-[10px] text-slate-500">
      {label}
    </span>

    <pre
      className={`min-h-[20px] whitespace-pre-wrap break-words font-mono text-sm font-semibold ${tone}`}
    >
      {value || " "}
    </pre>
  </div>
);

const isPassed = (result) => result?.passed || result?.status === "Accepted";

const statusStyle = (result) => {
  if (isPassed(result)) return { label: "Accepted", text: "text-emerald-400" };

  return {
    label: result?.status || "Wrong Answer",
    text: "text-rose-400",
  };
};

const CaseChip = ({ active, onClick, children, passed, locked }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
      active
        ? "border-white/15 bg-white/[0.07] text-white"
        : "border-white/[0.06] bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
    }`}
  >
    {passed === true && (
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
    )}
    {passed === false && (
      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
    )}
    {children}
    {locked && <Lock size={10} className="text-slate-500" />}
  </button>
);

const Spinner = ({ text }) => (
  <div className="flex min-h-[170px] flex-col items-center justify-center gap-3">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-white" />
    <p className="text-xs text-slate-500">{text}</p>
  </div>
);

// --------------------------------------------------
// MAIN COMPONENT
// tab: "sample" | "hidden"
// --------------------------------------------------

const ResultsPanel = ({
  examples = [],
  runResults = [],
  summary,
  running,
  submitting,
  tab,
  setTab,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [hiddenIdx, setHiddenIdx] = useState(0);

  // naya submit hone par pehle case se shuru
  useEffect(() => {
    if (summary?.mode === "submit") setHiddenIdx(0);
  }, [summary]);

  // Run karne par panel khul jaye
  useEffect(() => {
    if (running || submitting) setCollapsed(false);
  }, [running, submitting]);

  const sampleResults = summary?.mode === "run" ? runResults : [];
  const submitResults = summary?.mode === "submit" ? runResults : [];

  // ---------------- SAMPLE TAB ----------------

  const renderSample = () => {
    if (examples.length === 0) {
      return (
        <p className="py-10 text-center text-xs text-slate-600">
          No sample test cases available.
        </p>
      );
    }

    const example = examples[sampleIdx] || examples[0];
    const result = sampleResults.find((item) => item.number === sampleIdx + 1);

    return (
      <div className="space-y-4">
        {/* Case chips */}
        <div className="flex flex-wrap items-center gap-2">
          {examples.map((_, index) => {
            const r = sampleResults.find((item) => item.number === index + 1);

            return (
              <CaseChip
                key={index}
                active={sampleIdx === index}
                onClick={() => setSampleIdx(index)}
                passed={r ? isPassed(r) : undefined}
              >
                Case {index + 1}
              </CaseChip>
            );
          })}
        </div>

        {/* Status after run */}
        {result && (
          <p className={`text-lg font-semibold ${statusStyle(result).text}`}>
            {statusStyle(result).label}
          </p>
        )}

        <div>
          <p className="mb-3 text-xs text-slate-500">Input:</p>

          <div className="space-y-3">
            <Field label="Input" value={example.input} />

            {result && (
              <>
                <Field
                  label="Output"
                  value={result.actualOutput}
                  tone={isPassed(result) ? "text-white" : "text-rose-300"}
                />

                <Field
                  label="Expected"
                  value={result.expectedOutput}
                  tone="text-emerald-300"
                />
              </>
            )}

            {result?.error && (
              <div className="rounded-xl border border-rose-400/15 bg-rose-500/[0.04] p-3">
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-5 text-rose-300/80">
                  {typeof result.error === "string"
                    ? result.error
                    : JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------------- HIDDEN TAB ----------------

  const renderHidden = () => {
    if (submitting) return <Spinner text="Running against hidden test cases..." />;

    if (summary?.mode !== "submit") {
      return (
        <div className="flex min-h-[170px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-slate-500">
            <History size={18} />
          </div>

          <p className="text-base font-semibold text-slate-200">
            You haven’t submitted yet
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Submit your code to run against hidden test cases
          </p>
        </div>
      );
    }

    const accepted = summary.status === "Accepted";
    const current = submitResults[hiddenIdx];
    const currentHidden =
      current?.isHidden ||
      current?.input === "Hidden Test Case" ||
      current?.expectedOutput === "Hidden";

    return (
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className={`flex items-center gap-2 text-lg font-semibold ${
                accepted ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {accepted ? <Check size={18} /> : <CircleAlert size={18} />}
              {summary.status}
            </p>

            {summary.total > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                {summary.passed} / {summary.total} test cases passed
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {summary.runtime !== undefined && (
              <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Clock3 size={11} />
                  Runtime
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {summary.runtime} ms
                </p>
              </div>
            )}

            {summary.memory !== undefined && (
              <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <MemoryStick size={11} />
                  Memory
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {summary.memory}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Case chips */}
        {submitResults.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {submitResults.map((item, index) => (
              <CaseChip
                key={index}
                active={hiddenIdx === index}
                onClick={() => setHiddenIdx(index)}
                passed={isPassed(item)}
                locked={
                  item.isHidden ||
                  item.input === "Hidden Test Case" ||
                  item.expectedOutput === "Hidden"
                }
              >
                Case {index + 1}
              </CaseChip>
            ))}
          </div>
        )}

        {/* Selected case */}
        {current && (
          <div className="space-y-3">
            <p className={`text-sm font-semibold ${statusStyle(current).text}`}>
              {statusStyle(current).label}
            </p>

            {currentHidden ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-slate-500">
                <Lock size={13} />
                Hidden test case. Input and output are not shown.
              </div>
            ) : (
              <>
                <Field label="Input" value={current.input} />

                <Field
                  label="Output"
                  value={current.actualOutput}
                  tone={isPassed(current) ? "text-white" : "text-rose-300"}
                />

                <Field
                  label="Expected"
                  value={current.expectedOutput}
                  tone="text-emerald-300"
                />
              </>
            )}

            {current.error && (
              <div className="rounded-xl border border-rose-400/15 bg-rose-500/[0.04] p-3">
                <pre className="whitespace-pre-wrap font-mono text-[11px] leading-5 text-rose-300/80">
                  {typeof current.error === "string"
                    ? current.error
                    : JSON.stringify(current.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ---------------- UI ----------------

  return (
    <div className="border-t border-white/[0.07] bg-[#141414]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4">
        <div className="flex items-center">
          <span className="py-3 text-xs text-slate-500">Test Case</span>

          <ChevronRight size={13} className="mx-3 text-slate-600" />

          <button
            type="button"
            onClick={() => {
              setTab("sample");
              setCollapsed(false);
            }}
            className={`py-3 text-xs font-semibold transition ${
              tab === "sample"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Sample
          </button>

          <span className="mx-4 h-3.5 w-px bg-white/10" />

          <button
            type="button"
            onClick={() => {
              setTab("hidden");
              setCollapsed(false);
            }}
            className={`py-3 text-xs font-semibold transition ${
              tab === "hidden"
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Hidden
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand" : "Collapse"}
          className="rounded-md p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
        >
          <ChevronDown
            size={16}
            className={`transition ${collapsed ? "-rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="max-h-[390px] min-h-[210px] overflow-y-auto p-4">
          {tab === "hidden"
            ? renderHidden()
            : running
              ? <Spinner text="Running sample test cases..." />
              : renderSample()}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;

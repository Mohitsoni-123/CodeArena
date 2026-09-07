import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const SubmissionDetail = () => {
  const { id } = useParams();

  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmission = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/submissions/${id}`);

      setSubmission(response.data.submission);
    } catch (error) {
      console.error("Fetch Submission Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch submission"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  const getStatusConfig = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === "accepted") {
      return {
        label: "Accepted",
        icon: "✓",
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconBg: "bg-emerald-100 text-emerald-600",
        accent: "text-emerald-600",
      };
    }

    if (normalized === "wrong answer") {
      return {
        label: "Wrong Answer",
        icon: "×",
        badge: "bg-red-50 text-red-700 border-red-200",
        iconBg: "bg-red-100 text-red-600",
        accent: "text-red-600",
      };
    }

    if (normalized === "compilation error") {
      return {
        label: "Compilation Error",
        icon: "!",
        badge:
          "bg-orange-50 text-orange-700 border-orange-200",
        iconBg: "bg-orange-100 text-orange-600",
        accent: "text-orange-600",
      };
    }

    if (normalized === "runtime error") {
      return {
        label: "Runtime Error",
        icon: "!",
        badge:
          "bg-purple-50 text-purple-700 border-purple-200",
        iconBg: "bg-purple-100 text-purple-600",
        accent: "text-purple-600",
      };
    }

    if (normalized === "time limit exceeded") {
      return {
        label: "Time Limit Exceeded",
        icon: "⏱",
        badge:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
        iconBg: "bg-yellow-100 text-yellow-600",
        accent: "text-yellow-600",
      };
    }

    return {
      label: status || "Pending",
      icon: "•",
      badge:
        "bg-slate-50 text-slate-700 border-slate-200",
      iconBg: "bg-slate-100 text-slate-600",
      accent: "text-slate-600",
    };
  };

  const getLanguageConfig = (language) => {
    const languages = {
      cpp: {
        label: "C++",
        className:
          "bg-blue-50 text-blue-700 border-blue-200",
      },
      c: {
        label: "C",
        className:
          "bg-slate-50 text-slate-700 border-slate-200",
      },
      python: {
        label: "Python",
        className:
          "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      javascript: {
        label: "JavaScript",
        className:
          "bg-amber-50 text-amber-700 border-amber-200",
      },
    };

    return (
      languages[language] || {
        label: language || "Unknown",
        className:
          "bg-slate-50 text-slate-700 border-slate-200",
      }
    );
  };

  const getDifficultyConfig = (difficulty) => {
    if (difficulty === "Easy") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (difficulty === "Medium") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    if (difficulty === "Hard") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-4 w-44 rounded bg-slate-200" />

          <div className="mt-8 h-10 w-80 rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-6 h-[420px] rounded-2xl border border-slate-200 bg-white" />
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

          <h2 className="mt-5 text-xl font-black text-slate-900">
            Unable to load submission
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={fetchSubmission}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Try Again
            </button>

            <Link
              to="/submissions"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Submissions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 font-mono text-xl font-black text-slate-500">
            ?
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900">
            Submission not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            This submission may have been deleted or is no longer
            available.
          </p>

          <Link
            to="/submissions"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            ← Back to Submissions
          </Link>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(submission.status);
  const language = getLanguageConfig(submission.language);

  const passed =
    submission.testCasesPassed || 0;

  const total =
    submission.totalTestCases || 0;

  const percentage =
    total > 0
      ? Math.round((passed / total) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">

        {/* Top Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/submissions"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
          >
            ← Back to My Submissions
          </Link>

          <Link
            to="/problems"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            + Solve More
          </Link>
        </div>

        {/* Header */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Submission Details
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {submission.problem?.title || "Problem"}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {submission.problem?.difficulty && (
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${getDifficultyConfig(
                      submission.problem.difficulty
                    )}`}
                  >
                    {submission.problem.difficulty}
                  </span>
                )}

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${language.className}`}
                >
                  {language.label}
                </span>

                <span
                  className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${status.badge}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {submission.problem?._id && (
              <Link
                to={`/problems/${submission.problem._id}`}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                View Problem →
              </Link>
            )}
          </div>
        </div>

        {/* Result Banner */}
        <div
          className={`mt-8 rounded-3xl border p-5 shadow-sm sm:p-6 ${
            status.badge
          }`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${status.iconBg}`}
            >
              {status.icon}
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                Submission Result
              </p>

              <h2 className="mt-1 text-xl font-black">
                {status.label}
              </h2>

              <p className="mt-1 text-sm opacity-75">
                {submission.status === "Accepted"
                  ? "Your solution passed all available test cases."
                  : submission.error
                    ? "Your solution could not be executed successfully."
                    : `${passed} of ${total} test cases passed.`}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tests */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Test Cases
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-slate-900">
                {passed}
                <span className="text-lg font-bold text-slate-400">
                  {" "}
                  / {total}
                </span>
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-600">
                ✓
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400">
              {percentage}% passed
            </p>
          </div>

          {/* Runtime */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Runtime
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-slate-900">
                {submission.runtime ?? 0}
                <span className="ml-1 text-sm font-bold text-slate-400">
                  ms
                </span>
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ⚡
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Execution time
            </p>
          </div>

          {/* Memory */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Memory
            </p>

            <div className="mt-3 flex items-end justify-between">
              <p className="text-3xl font-black text-slate-900">
                {submission.memory ?? 0}
                <span className="ml-1 text-sm font-bold text-slate-400">
                  KB
                </span>
              </p>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                ◈
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Memory consumed
            </p>
          </div>

          {/* Submitted */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Submitted
            </p>

            <p className="mt-3 text-sm font-bold leading-6 text-slate-800">
              {formatDate(submission.createdAt)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Submission time
            </p>
          </div>
        </div>

        {/* Error */}
        {submission.error && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-red-100 bg-red-50 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 font-black text-red-600">
                !
              </div>

              <div>
                <h2 className="text-sm font-black text-red-800">
                  Execution Error
                </h2>

                <p className="text-xs text-red-600">
                  Details returned by the execution engine
                </p>
              </div>
            </div>

            <pre className="overflow-x-auto whitespace-pre-wrap break-words bg-[#0b1120] p-5 font-mono text-xs leading-6 text-slate-200 sm:p-6 sm:text-sm">
              {typeof submission.error === "string"
                ? submission.error
                : submission.error?.message ||
                  "Execution failed"}
            </pre>
          </div>
        )}

        {/* Code */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <h2 className="text-sm font-black text-slate-800">
                Submitted Code
              </h2>
            </div>

            <span
              className={`w-fit rounded-lg border px-3 py-1.5 text-xs font-bold ${language.className}`}
            >
              {language.label}
            </span>
          </div>

          <div className="overflow-x-auto bg-[#0b1120]">
            <pre className="min-w-full p-5 font-mono text-xs leading-6 text-slate-200 sm:p-7 sm:text-sm">
              <code>{submission.code || "// No code available"}</code>
            </pre>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-between">
          <Link
            to="/submissions"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← All Submissions
          </Link>

          {submission.problem?._id && (
            <Link
              to={`/problems/${submission.problem._id}`}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              Try Problem Again →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
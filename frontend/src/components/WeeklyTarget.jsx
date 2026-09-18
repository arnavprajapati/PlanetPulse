import { useState } from "react";
import { api } from "../api";

function dayOfWeek(weekStart) {
  if (!weekStart) return null;
  const start = new Date(`${weekStart}T00:00:00`);
  const diffDays = Math.floor((Date.now() - start.getTime()) / 86400000);
  return Math.min(7, Math.max(1, diffDays + 1));
}

export default function WeeklyTarget({ summary, onTargetChanged }) {
  const [draftTarget, setDraftTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!summary) return null;

  const { weeklyTargetKg, targetExceeded, weekTotalKg, weekStart, weekEnd } = summary;
  const day = dayOfWeek(weekStart);
  const pct = weeklyTargetKg > 0 ? Math.min(100, (weekTotalKg / weeklyTargetKg) * 100) : 0;

  async function handleSetTarget(e) {
    e.preventDefault();
    const value = Number(draftTarget);
    if (!Number.isFinite(value) || value <= 0) return;
    setSaving(true);
    setError(null);
    try {
      await api.setTarget(value);
      setDraftTarget("");
      await onTargetChanged();
    } catch (err) {
      setError(err.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Target & Budget</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Weekly Carbon Budget</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Week of {weekStart} – {weekEnd} · <span className="font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">Day {day} of 7</span>
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-end gap-3 mb-5 p-4 sm:p-5 bg-slate-50/60 rounded-xl border border-slate-200/60">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Weekly Usage</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums leading-none">
              {weekTotalKg.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-500">/ {weeklyTargetKg.toFixed(0)} kg CO₂e</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span>{pct.toFixed(0)}% used</span>
        </div>
      </div>

      <div
        className="h-2.5 bg-slate-100 rounded-full mb-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={Number(pct.toFixed(0))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Weekly carbon budget progress"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            targetExceeded ? "bg-amber-500" : "bg-sky-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {targetExceeded ? (
        <div role="status" aria-live="polite" className="mt-4 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 text-amber-900 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true"></span>
          <span>
            <strong className="font-semibold">Target exceeded:</strong> Over by {(weekTotalKg - weeklyTargetKg).toFixed(2)} kg CO₂e.
          </span>
        </div>
      ) : (
        <div role="status" aria-live="polite" className="mt-4 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" aria-hidden="true"></span>
          <span>
            <strong className="font-semibold text-slate-900">On Track:</strong> {(weeklyTargetKg - weekTotalKg).toFixed(2)} kg CO₂e remaining budget this week.
          </span>
        </div>
      )}

      <form className="mt-6 pt-5 border-t border-slate-100" onSubmit={handleSetTarget}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="weekly-target-input" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Update Weekly Target (kg CO₂e)
          </label>
          <div className="flex gap-2.5 items-center flex-col sm:flex-row">
            <input
              id="weekly-target-input"
              name="weeklyTarget"
              type="number"
              min="0.01"
              step="any"
              value={draftTarget}
              onChange={(e) => setDraftTarget(e.target.value)}
              placeholder={`Current target: ${weeklyTargetKg}`}
              aria-label="Weekly target in kg CO2e"
              className="w-full sm:flex-1 h-10 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Update weekly target"
              data-testid="update-target-button"
              disabled={saving || !draftTarget}
              className="h-10 px-5 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-sm w-full sm:w-auto focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
            >
              {saving ? "Saving…" : "Update Target"}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm flex items-center gap-2 text-rose-900 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

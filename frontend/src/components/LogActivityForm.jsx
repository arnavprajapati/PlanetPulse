import { useState, useRef, useEffect } from "react";
import { api } from "../api";

const CATEGORY_COLORS = {
  transport: "#0ea5e9",
  energy: "#f59e0b",
  food: "#10b981",
};

export default function LogActivityForm({ activityTypes, onLogged }) {
  const [type, setType] = useState("car");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selected = activityTypes[type];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const { activity, warning } = await api.logActivity({ type, quantity: Number(quantity), date });
      onLogged(activity);
      setQuantity("");
      setStatus(
        warning
          ? { kind: "warn", message: `Logged (${activity.co2Kg} kg CO₂e) — ${warning}` }
          : { kind: "ok", message: `Logged: ${activity.co2Kg} kg CO₂e` }
      );
    } catch (err) {
      setStatus({ kind: "error", message: err.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all relative">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200/60 px-2.5 py-0.5 rounded-full mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>Log Activity</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Record Emissions</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-0">Track your daily commute, electricity usage, or meals to update your footprint.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">

        <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Activity Type</label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 flex items-center justify-between transition-all font-medium cursor-pointer shadow-sm text-left"
          >
            <span className="flex items-center gap-2 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[selected?.category] || "#0ea5e9" }}
              />
              <span className="font-semibold text-slate-900 truncate">{selected?.label || type}</span>
            </span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${dropdownOpen ? "rotate-180 text-sky-600" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100 min-w-[320px] max-w-[380px] w-max">
              {Object.entries(activityTypes).map(([key, def]) => {
                const isSelected = key === type;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setType(key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-between gap-3 transition-colors text-left cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-sky-50 text-sky-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[def.category] || "#888" }}
                      />
                      <span>{def.label}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded font-normal shrink-0">
                      {def.factor} kg/{def.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Quantity {selected ? <span className="font-mono text-[11px] font-normal text-slate-400 lowercase">({selected.unit})</span> : ""}
          </label>
          <input
            type="number"
            min="0"
            step="any"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={selected?.perUnit ? "e.g. 10" : "e.g. 1"}
            className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-10 px-3.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all font-medium cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={submitting || !quantity}
          className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all cursor-pointer shadow-sm shadow-sky-600/20"
        >
          {submitting ? (
            <span>Logging…</span>
          ) : (
            <>
              <span>Log Activity</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </>
          )}
        </button>
      </div>

      {status && (
        <div
          className={`mt-4 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 border ${
            status.kind === "warn"
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : status.kind === "error"
              ? "bg-rose-50 border-rose-200 text-rose-900"
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              status.kind === "warn"
                ? "bg-amber-500"
                : status.kind === "error"
                ? "bg-rose-500"
                : "bg-sky-500"
            }`}
          />
          <span className="font-medium">{status.message}</span>
        </div>
      )}
    </form>
  );
}

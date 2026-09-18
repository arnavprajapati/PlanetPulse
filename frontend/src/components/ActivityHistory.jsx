import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../api";

const CATEGORY_COLORS = {
  transport: "#0ea5e9",
  energy: "#f59e0b",
  food: "#10b981",
};

const ACTIVITY_ICONS = {
  car: "🚗",
  bus: "🚌",
  flight: "✈️",
  electricity: "⚡",
  veg_meal: "🥗",
  nonveg_meal: "🍗",
};

export default function ActivityHistory({ activityTypes, refreshTrigger }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target)) {
        setTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getActivities({
        type: filterType || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
      });
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterFrom, filterTo]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities, refreshTrigger]);

  function handleResetFilters() {
    setFilterType("");
    setFilterFrom("");
    setFilterTo("");
  }

  const hasActiveFilters = Boolean(filterType || filterFrom || filterTo);
  const totalFilteredCo2 = activities.reduce((acc, cur) => acc + (cur.co2Kg || 0), 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>Activity Log · History</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">History & Filter</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Search and filter all your recorded emissions by activity type and date range.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/60 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Custom Filter Type Dropdown */}
          <div className="flex flex-col gap-1.5 relative" ref={typeDropdownRef}>
            <label htmlFor="filter-type-btn" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Filter by Type
            </label>
            <button
              id="filter-type-btn"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={typeDropdownOpen}
              aria-label={`Filter by Activity Type: ${filterType && activityTypes?.[filterType] ? activityTypes[filterType].label : "All Activity Types"}`}
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 flex items-center justify-between transition-all font-medium cursor-pointer shadow-sm text-left focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
            >
              <span className="flex items-center gap-2 truncate">
                {filterType ? (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[activityTypes?.[filterType]?.category] || "#0ea5e9" }}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                )}
                <span className="truncate">{filterType && activityTypes?.[filterType] ? activityTypes[filterType].label : "All Activity Types"}</span>
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${typeDropdownOpen ? "rotate-180 text-sky-600" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {typeDropdownOpen && (
              <div
                role="listbox"
                aria-label="Filter activity types"
                className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5 min-w-[240px] max-w-[320px] w-max"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={!filterType}
                  onClick={() => {
                    setFilterType("");
                    setTypeDropdownOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 text-left transition-colors cursor-pointer whitespace-nowrap ${
                    !filterType ? "bg-sky-50 text-sky-900 font-semibold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                  <span>All Activity Types</span>
                </button>
                {activityTypes &&
                  Object.entries(activityTypes).map(([k, def]) => {
                    const isSelected = filterType === k;
                    return (
                      <button
                        key={k}
                        role="option"
                        aria-selected={isSelected}
                        type="button"
                        onClick={() => {
                          setFilterType(k);
                          setTypeDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-2 text-left transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected ? "bg-sky-50 text-sky-900 font-semibold" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[def.category] || "#888" }}
                          aria-hidden="true"
                        />
                        <span>{def.label}</span>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-from-date" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              From Date
            </label>
            <input
              id="filter-from-date"
              name="from"
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              aria-label="Filter from date"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all font-medium cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-to-date" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              To Date
            </label>
            <div className="flex gap-2">
              <input
                id="filter-to-date"
                name="to"
                type="date"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                aria-label="Filter to date"
                className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition-all font-medium cursor-pointer"
              />
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  aria-label="Clear active filters"
                  className="px-2.5 h-9 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 transition-colors shrink-0 cursor-pointer"
                  title="Clear filters"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-600">
          <span>
            Showing <strong className="font-semibold text-slate-900">{activities.length}</strong> {activities.length === 1 ? "activity" : "activities"}
          </span>
          {activities.length > 0 && (
            <span className="font-mono text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Total: <strong className="text-slate-900">{totalFilteredCo2.toFixed(2)}</strong> kg CO₂e
            </span>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden="true"></span>
          <span>{error}</span>
        </div>
      )}

      {/* Activities Table */}
      {activities.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-600 m-0">
            {hasActiveFilters
              ? "No activities match the selected filters. Try changing or clearing filters."
              : "No activities logged yet. Record your first activity above!"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs sm:text-sm border-collapse" aria-label="Activity history log" data-testid="activity-history-table">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th scope="col" className="py-2.5 px-3.5">Date</th>
                <th scope="col" className="py-2.5 px-3.5">Activity</th>
                <th scope="col" className="py-2.5 px-3.5">Quantity</th>
                <th scope="col" className="py-2.5 px-3.5 text-right">CO₂e</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {act.date}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[act.category] || "#888" }}
                        aria-hidden="true"
                      />
                      <span className="font-medium text-slate-900">{act.label || act.type}</span>
                      {act.suspicious && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                          ⚠️ high
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-xs text-slate-700">
                    {act.quantity} <span className="text-slate-500 font-sans text-[11px]">{act.unit}</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-xs font-semibold text-slate-900">
                    {act.co2Kg.toFixed(2)} <span className="text-slate-500 font-normal font-sans text-[11px]">kg</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


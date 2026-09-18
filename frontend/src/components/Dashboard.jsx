const CATEGORY_LABELS = {
  transport: "Transport",
  energy: "Energy",
  food: "Food",
};

const CATEGORY_COLORS = {
  transport: "#0ea5e9",
  energy: "#f59e0b",
  food: "#10b981",
};

export default function Dashboard({ footprint }) {
  if (!footprint) return null;

  const { totalKg, activityCount, byCategory } = footprint;
  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(1, ...categories.map(([, v]) => v));

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm transition-all">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>Carbon Overview</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">Total Carbon Footprint</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">Real-time emissions aggregated across all your logged lifestyle activities.</p>
      </div>

      <div className="flex flex-wrap justify-between items-end gap-3 mb-6 p-4 sm:p-5 bg-slate-50/60 rounded-xl border border-slate-200/60">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Emissions</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums leading-none">
              {totalKg.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-500">kg CO₂e</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>{activityCount} {activityCount === 1 ? "activity" : "activities"} logged</span>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
          <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-base">
            📊
          </div>
          <h4 className="text-sm font-semibold text-slate-700 mb-1">No activities logged yet</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto m-0">
            Start logging your daily commutes, electricity use, or meals above to calculate your footprint.
          </p>
        </div>
      ) : (
        <>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Category Breakdown</div>
          <div className="overflow-hidden rounded-xl border border-slate-200/80 mb-5">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Emissions</th>
                  <th className="py-3 px-4 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(([cat, val]) => (
                  <tr key={cat} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                          style={{ backgroundColor: CATEGORY_COLORS[cat] || "#888" }}
                        />
                        <span className="font-medium text-slate-800">{CATEGORY_LABELS[cat] || cat}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 font-medium">
                      {val.toFixed(2)} <span className="text-slate-400 font-sans text-[11px]">kg</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {totalKg ? ((val / totalKg) * 100).toFixed(1) : "0.0"}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {categories.map(([cat, val]) => (
              <div className="flex items-center gap-3 text-xs" key={cat}>
                <span className="w-24 font-medium text-slate-700 truncate">{CATEGORY_LABELS[cat] || cat}</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(val / maxVal) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[cat] || "#888",
                    }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-xs font-medium text-slate-600 tabular-nums">
                  {val.toFixed(1)} kg
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

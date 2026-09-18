import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import LogActivityForm from "./components/LogActivityForm";
import Dashboard from "./components/Dashboard";
import WeeklyTarget from "./components/WeeklyTarget";
import ActivityHistory from "./components/ActivityHistory";

export default function App() {
  const [activityTypes, setActivityTypes] = useState(null);
  const [footprint, setFootprint] = useState(null);
  const [summary, setSummary] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState(null);

  const refreshFootprint = useCallback(async () => {
    try {
      const data = await api.getFootprint();
      setFootprint(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const refreshSummary = useCallback(async () => {
    try {
      const data = await api.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshTrigger((c) => c + 1);
    await Promise.all([refreshFootprint(), refreshSummary()]);
  }, [refreshFootprint, refreshSummary]);

  useEffect(() => {
    api.getActivityTypes().then((d) => setActivityTypes(d.activityTypes)).catch((err) => setError(err.message));
    refreshAll();
  }, [refreshAll]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans antialiased selection:bg-sky-100 selection:text-sky-900">

      <div className="max-w-[940px] mx-auto border-x border-dashed border-gray-200 min-h-screen flex flex-col bg-white">

        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-dashed border-gray-200 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold text-[15px] tracking-tight text-slate-900">
            <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="5" width="18" height="2.5" rx="1.25" />
              <rect x="3" y="10.75" width="14" height="2.5" rx="1.25" />
              <rect x="3" y="16.5" width="18" height="2.5" rx="1.25" />
            </svg>
            <span>PlanetPulse</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => document.getElementById("app-dashboard")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
            >
              <span>Get Started</span>
              <span>→</span>
            </button>
          </div>
        </nav>


        <header className="relative overflow-hidden py-16 sm:py-24 text-center px-6 border-b border-dashed border-gray-200">

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-[520px] h-[280px] bg-sky-400/15 rounded-full blur-3xl opacity-80 translate-y-6 translate-x-8"></div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 mb-4 leading-[1.2]">
              Turn Daily Choices<br />
              Into <span className="text-[#0ea5e9]">Distraction-Free</span> Insights
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6 font-normal">
              Track daily commutes, energy consumption, and meals without recommendations, comments, or distractions.
            </p>
            <div>
              <button
                type="button"
                onClick={() => document.getElementById("app-dashboard")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] active:bg-[#0369a1] text-white text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <span>Get started</span>
                <span className="text-xs font-mono">↗</span>
              </button>
            </div>
          </div>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-dashed border-gray-200 bg-white">
          <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-dashed border-gray-200">
            <h4 className="font-mono text-xs sm:text-[13px] font-semibold text-slate-900 mb-1.5">Distraction-Free Tracking</h4>
            <p className="text-xs text-gray-500 leading-relaxed m-0">No complicated setup or noisy telemetry. Just clean, instant carbon calculation.</p>
          </div>
          <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-dashed border-gray-200">
            <h4 className="font-mono text-xs sm:text-[13px] font-semibold text-slate-900 mb-1.5">Turn Choices Into Metrics</h4>
            <p className="text-xs text-gray-500 leading-relaxed m-0">Log commutes, electricity, and meals to generate real-time CO₂e category analytics.</p>
          </div>
          <div className="p-6 sm:p-7">
            <h4 className="font-mono text-xs sm:text-[13px] font-semibold text-slate-900 mb-1.5">Private & Budget-Tracked</h4>
            <p className="text-xs text-gray-500 leading-relaxed m-0">Set your personal weekly target budget to maintain sustainable habits anytime.</p>
          </div>
        </div>


        {error && (
          <div className="m-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-800 flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}


        <main id="app-dashboard" className="p-6 sm:p-8 flex flex-col gap-6 flex-1 bg-white">
          {activityTypes && <LogActivityForm activityTypes={activityTypes} onLogged={refreshAll} />}

          <Dashboard footprint={footprint} />

          <WeeklyTarget summary={summary} onTargetChanged={refreshAll} />

          <ActivityHistory activityTypes={activityTypes} refreshTrigger={refreshTrigger} />
        </main>


        <footer className="border-t border-dashed border-gray-200 px-6 py-5 text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-3 bg-white font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 font-semibold font-sans">≡ PlanetPulse</span>
            <span>— distraction-free carbon tracking.</span>
          </div>
          <div className="text-[11px] text-gray-400">
            <span>AZIS-2WVCUQ</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

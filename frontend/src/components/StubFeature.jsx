export default function StubFeature({ title, description }) {
  return (
    <div className="bg-slate-50/70 border border-dashed border-slate-300/80 rounded-2xl p-6 sm:p-7">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span>Upcoming Feature · Roadmap</span>
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed m-0">{description}</p>
      </div>
    </div>
  );
}


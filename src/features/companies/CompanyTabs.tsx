import { memo } from "react";
import { Info, Briefcase } from "lucide-react";

export type CompanyTabType = "detalle" | "trabajos" | "info" | "jobs";

interface CompanyTabsProps {
  activeTab: CompanyTabType;
  onTabChange: (tab: CompanyTabType) => void;
  jobsCount: number;
}

export const CompanyTabs = memo(
  ({ activeTab, onTabChange, jobsCount }: CompanyTabsProps) => {
    const isDetalle = activeTab === "detalle" || activeTab === "info";
    const isTrabajos = activeTab === "trabajos" || activeTab === "jobs";

    return (
      <div className="flex items-center gap-2 border-b border-white/10 my-8">
        <button
          type="button"
          onClick={() => onTabChange("detalle")}
          className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer -mb-px ${
            isDetalle
              ? "border-sky-500 text-sky-400"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          aria-selected={isDetalle}
          role="tab"
        >
          <Info className="w-4 h-4" />
          <span>Información de la empresa</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("trabajos")}
          className={`inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer -mb-px ${
            isTrabajos
              ? "border-sky-500 text-sky-400"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          aria-selected={isTrabajos}
          role="tab"
        >
          <Briefcase className="w-4 h-4" />
          <span>Ofertas de trabajo</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isTrabajos
                ? "bg-sky-500/20 text-sky-300"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {jobsCount}
          </span>
        </button>
      </div>
    );
  }
);

CompanyTabs.displayName = "CompanyTabs";

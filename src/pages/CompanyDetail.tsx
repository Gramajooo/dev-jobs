import { useCallback, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import {
  CompanyBreadcrumb,
  CompanyHeader,
  CompanyTabs,
  CompanyInfoTab,
  CompanyJobsTab,
  type CompanyTabType,
} from "../components/CompanyDetail";
import { getAllCompanies, getJobsByIds, getJobsByCompanyId } from "../utils/lookups";

export const CompanyDetail = () => {
  const { id, tab: routeTab } = useParams<{ id: string; tab?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Si se accede mediante ruta path /companies/:id/:tab, normalizamos a la URL con query param
  useEffect(() => {
    if (routeTab && id) {
      const normalizedRouteTab =
        routeTab === "trabajos" || routeTab === "jobs" ? "trabajos" : "detalle";
      navigate(`/companies/${id}?tab=${normalizedRouteTab}`, { replace: true });
    }
  }, [routeTab, id, navigate]);

  const tabParam = searchParams.get("tab");

  const activeTab: CompanyTabType = useMemo(() => {
    if (
      tabParam === "trabajos" ||
      tabParam === "jobs" ||
      routeTab === "trabajos" ||
      routeTab === "jobs"
    ) {
      return "trabajos";
    }
    return "detalle";
  }, [tabParam, routeTab]);

  // Si no hay tab en la URL, aseguramos que marque 'tab=detalle'
  useEffect(() => {
    if (!routeTab && !tabParam) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("tab", "detalle");
          return next;
        },
        { replace: true }
      );
    }
  }, [routeTab, tabParam, setSearchParams]);

  const handleTabChange = useCallback(
    (tab: CompanyTabType) => {
      const normalizedTab =
        tab === "trabajos" || tab === "jobs" ? "trabajos" : "detalle";
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", normalizedTab);
        return next;
      });
    },
    [setSearchParams]
  );

  const company = useMemo(() => {
    if (!id) return undefined;
    const all = getAllCompanies();
    return all.find((c) => c.idCompany === id || c.slug === id);
  }, [id]);

  const companyJobs = useMemo(() => {
    if (!company) return [];
    // Combine jobs from jobIds array or fallback to company identifier match
    const fromIds = getJobsByIds(company.jobIds || []);
    if (fromIds.length > 0) return fromIds;
    return getJobsByCompanyId(company.idCompany);
  }, [company]);

  if (!company) {
    return (
      <main className="flex-1 flex justify-center items-center py-16 px-4">
        <div className="card-surface p-10 text-center max-w-md flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Empresa no encontrada</h2>
          <p className="text-slate-400 text-sm">
            La empresa que buscas no existe o ha sido dada de baja del directorio.
          </p>
          <Link
            to="/companies"
            className="btn-primary inline-flex items-center gap-2 h-11 px-7 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a empresas</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-7">
          <CompanyBreadcrumb companyName={company.name} />
        </div>

        {/* Company Card Surface */}
        <article className="card-surface p-6 sm:p-8 md:p-10">
          <CompanyHeader company={company} />

          <CompanyTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            jobsCount={companyJobs.length}
          />

          {activeTab === "trabajos" ? (
            <CompanyJobsTab
              jobs={companyJobs}
              companyName={company.name}
            />
          ) : (
            <CompanyInfoTab company={company} />
          )}
        </article>
      </div>
    </main>
  );
};

export default CompanyDetail;

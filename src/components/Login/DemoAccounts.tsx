import { Sparkles } from "lucide-react";

export interface DemoAccount {
  label: string;
  email: string;
  pass: string;
}

const DEFAULT_DEMO_ACCOUNTS: DemoAccount[] = [
  { label: "👑 Admin", email: "admin@devjobs.com", pass: "Admin123!" },
  { label: "💼 Reclutador", email: "recruiter@techsolutions.com", pass: "Recruiter123!" },
  { label: "💻 Desarrolladora", email: "laura.garcia@example.com", pass: "Dev12345!" },
];

interface DemoAccountsProps {
  accounts?: DemoAccount[];
  onSelectAccount: (email: string, pass: string) => void;
}

export const DemoAccounts = ({
  accounts = DEFAULT_DEMO_ACCOUNTS,
  onSelectAccount,
}: DemoAccountsProps) => {
  return (
    <div className="bg-blue-500/10 border border-dashed border-blue-500/35 rounded-xl p-3.5">
      <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
        <Sparkles size={14} />
        <span>Cuentas de prueba (Roles RBAC)</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {accounts.map((acc) => (
          <button
            key={acc.email}
            type="button"
            className="bg-[#101922] border border-slate-700 text-slate-300 text-xs py-1 px-2 rounded-md cursor-pointer transition-colors duration-150 hover:bg-slate-800 hover:border-sky-400 hover:text-white"
            onClick={() => onSelectAccount(acc.email, acc.pass)}
          >
            {acc.label}
          </button>
        ))}
      </div>
    </div>
  );
};

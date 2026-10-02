import { memo, type ReactNode } from "react";
import { Share2 } from "lucide-react";
import type { CompanySocialLinks as SocialLinksType } from "../../types/company";

interface CompanySocialLinksProps {
  socialLinks?: SocialLinksType;
  className?: string;
}

interface SocialNetworkConfig {
  key: keyof SocialLinksType;
  label: string;
  hoverClasses: string;
  icon: ReactNode;
}

const SOCIAL_NETWORKS: SocialNetworkConfig[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    hoverClasses:
      "hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    key: "github",
    label: "GitHub",
    hoverClasses:
      "hover:text-white hover:border-white/40 hover:bg-white/10",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    key: "twitter",
    label: "X",
    hoverClasses:
      "hover:text-white hover:border-sky-400/50 hover:bg-sky-500/10",
    icon: (
      <svg
        className="w-4 h-4 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: "dribbble",
    label: "Dribbble",
    hoverClasses:
      "hover:text-[#EA4C89] hover:border-[#EA4C89]/50 hover:bg-[#EA4C89]/10",
    icon: (
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.312c-.28-.06-2.58-.51-5.01-.22-.05-.12-.1-.25-.16-.37a24.16 24.16 0 00-1.2-2.48c3.08-1.29 4.31-2.18 4.44-2.242zm-6.22-2.45a8.497 8.497 0 014.73 1.542c-.17.13-1.35.98-4.32 2.22a28.058 28.058 0 00-3.32-3.15c.92-.4 1.94-.612 2.91-.612zm-4.75 1.48c.84.81 1.94 1.9 3.23 3.12-1.34.42-3.41 1.09-5.75 1.15a8.507 8.507 0 012.52-4.27zm-4.06 6.36c.01-.01.03-.02.04-.02 2.76-.07 5.12-.83 6.64-1.32.32.66.62 1.34.89 2.02-3.95 1.19-7.1 4.29-7.44 4.64a8.487 8.487 0 01-.13-5.32zm8.01 9.77a8.514 8.514 0 01-5.11-1.72c.3-.35 3.09-3.23 6.96-4.47 1.05 2.76 1.48 5.12 1.57 5.64a8.468 8.468 0 01-3.42.55zm5.02-1.5c-.08-.47-.48-2.65-1.48-5.27 2.27-.32 4.27.09 4.54.15a8.544 8.544 0 01-3.06 5.12z"
        />
      </svg>
    ),
  },
];

export const CompanySocialLinks = memo(
  ({ socialLinks, className = "" }: CompanySocialLinksProps) => {
    if (!socialLinks) return null;

    const availableNetworks = SOCIAL_NETWORKS.filter(
      (network) => Boolean(socialLinks[network.key])
    );

    if (availableNetworks.length === 0) return null;

    return (
      <section className={`space-y-3 pt-2 border-t border-white/5 ${className}`.trim()}>
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Share2 className="w-4 h-4 text-sky-400" aria-hidden="true" />
          <span>Redes sociales</span>
        </div>

        <div className="flex items-center gap-2.5">
          {availableNetworks.map((network) => {
            const url = socialLinks[network.key] as string;

            return (
              <a
                key={network.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${network.label} de la empresa`}
                title={network.label}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 bg-slate-800/80 border border-white/10 transition-all duration-200 shadow-sm hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-sky-500 ${network.hoverClasses}`}
              >
                {network.icon}
              </a>
            );
          })}
        </div>
      </section>
    );
  }
);

CompanySocialLinks.displayName = "CompanySocialLinks";

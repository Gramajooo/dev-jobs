import type { ReactNode } from 'react';

interface JobDetailSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export const JobDetailSection = ({
  title,
  description,
  children,
}: JobDetailSectionProps) => {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      {description && (
        <p className="text-base text-slate-300 text-justify leading-relaxed">{description}</p>
      )}
      {children}
    </section>
  );
};

import { CircleCheck } from 'lucide-react';

interface JobDetailListProps {
  items: string[];
}

export const JobDetailList = ({ items }: JobDetailListProps) => {
  return (
    <ul className="flex flex-col gap-3.5 list-none p-0 mt-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2.5 py-1">
          <CircleCheck className="w-7 h-7 text-sky-400 shrink-0" />
          <span className="text-[0.975rem] leading-relaxed text-slate-300 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
};

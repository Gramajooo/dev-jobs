import type { ChangeEvent, ReactNode } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterValues {
  technology: string;
  location: string;
  experienceLevel: string;
  sortBy: string;
  date: string;
  salary: string;
  workSchedule: string;
  modality: string;
}

export interface FilterSelectProps {
  id: string;
  name: string;
  value: string;
  placeholder: string;
  options: FilterOption[];
  icon?: ReactNode;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onClear?: () => void;
  className?: string;
}

export interface FilterFieldConfig {
  id: string;
  name: keyof FilterValues;
  placeholder: string;
  options: FilterOption[];
  icon: ReactNode;
  isDefaultValue?: (value: string) => boolean;
}

export interface SearchFiltersProps {
  filters?: FilterValues;
  onSearch: (filters: FilterValues) => void;
  onReset?: () => void;
}

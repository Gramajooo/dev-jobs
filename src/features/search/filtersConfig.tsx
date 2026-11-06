import {
  ArrowUpDown,
  Calendar,
  Banknote,
  Briefcase,
  Laptop,
  Clock,
  Code,
  MapPin,
} from "lucide-react";
import type { FilterFieldConfig, FilterOption, FilterValues } from "./types";

import sortOptions from "../../data/sortOptions.json";
import dateOptions from "../../data/dateOptions.json";
import salaryOptions from "../../data/salaryOptions.json";
import experienciaOptions from "../../data/experience.json";
import modalityOptions from "../../data/modalityOptions.json";
import workScheduleOptions from "../../data/workScheduleOptions.json";
import tecnologias from "../../data/technologies.json";
import ubicaciones from "../../data/locations.json";

export const locationOptions: FilterOption[] = (
  ubicaciones as { idLocation: string; name: string }[]
).map((loc) => ({
  value: loc.idLocation,
  label: loc.name,
}));

export const DEFAULT_FILTERS: Readonly<FilterValues> = Object.freeze({
  sortBy: "relevance",
  date: "",
  salary: "",
  experienceLevel: "",
  modality: "",
  workSchedule: "",
  technology: "",
  location: "",
});

export const isFilterActive = (
  name: keyof FilterValues,
  value: string,
): boolean => {
  if (!value) return false;
  if (name === "sortBy") return value !== "relevance";
  return true;
};

export const hasAnyFilterActive = (filters?: FilterValues): boolean => {
  if (!filters) return false;
  return Object.entries(filters).some(([key, val]) =>
    isFilterActive(key as keyof FilterValues, val),
  );
};

export const FILTER_CONFIGS: readonly FilterFieldConfig[] = [
  {
    id: "filter-sort-by",
    name: "sortBy",
    placeholder: "Ordenar por",
    options: sortOptions as FilterOption[],
    icon: <ArrowUpDown className="w-4 h-4" />,
    isDefaultValue: (val) => !val || val === "relevance",
  },
  {
    id: "filter-date",
    name: "date",
    placeholder: "Fecha de publicación",
    options: dateOptions as FilterOption[],
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "filter-salary",
    name: "salary",
    placeholder: "Salario mínimo",
    options: salaryOptions as FilterOption[],
    icon: <Banknote className="w-4 h-4" />,
  },
  {
    id: "filter-experience-level",
    name: "experienceLevel",
    placeholder: "Experiencia",
    options: experienciaOptions as FilterOption[],
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    id: "filter-modality",
    name: "modality",
    placeholder: "Modalidad",
    options: modalityOptions as FilterOption[],
    icon: <Laptop className="w-4 h-4" />,
  },
  {
    id: "filter-work-schedule",
    name: "workSchedule",
    placeholder: "Jornada laboral",
    options: workScheduleOptions as FilterOption[],
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: "filter-technology",
    name: "technology",
    placeholder: "Tecnología",
    options: tecnologias as FilterOption[],
    icon: <Code className="w-4 h-4" />,
  },
  {
    id: "filter-location",
    name: "location",
    placeholder: "Ubicación",
    options: locationOptions,
    icon: <MapPin className="w-4 h-4" />,
  },
];

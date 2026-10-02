import type { Job } from "../types/job";
import { getCompanyName, getLocationName } from "./lookups";

/**
 * Normalizes a string by converting to lowercase, removing accents/diacritics,
 * and trimming excess whitespace.
 *
 * Example: "  Programación en MÉXICO!  " -> "programacion en mexico"
 */
export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return "";

  return (
    text
      .toString()
      .toLowerCase()
      // Decompose accented characters (e.g. "ó" -> "o" + combining acute accent)
      .normalize("NFD")
      // Remove all combining diacritical marks (accents, tildes, etc.)
      .replace(/[\u0300-\u036f]/g, "")
      // Replace non-alphanumeric characters (except spaces) with space
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      // Collapse multiple spaces into one and trim
      .replace(/\s+/g, " ")
      .trim()
  );
};

/**
 * Tokenizes a search query into unique normalized terms.
 *
 * Example: "React, Node.js & Senior" -> ["react", "node", "js", "senior"]
 */
export const tokenize = (text: string | null | undefined): string[] => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter(Boolean);
  // Return unique tokens to avoid duplicate checks
  return Array.from(new Set(tokens));
};

/**
 * Extracts and combines all searchable text fields from a job into a single normalized string.
 */
export const getJobSearchableContent = (job: Job): string => {
  const techs = Array.isArray(job.data?.technology)
    ? job.data.technology.join(" ")
    : job.data?.technology || "";

  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities.join(" ")
    : "";

  const requirements = Array.isArray(job.requirements)
    ? job.requirements.join(" ")
    : "";

  const companyName = job.idCompany ? getCompanyName(job.idCompany) : (job.company || "");
  const locationName = job.idLocation ? getLocationName(job.idLocation) : (job.location || "");

  const combined = [
    job.title,
    job.idJob || "",
    job.idCompany || "",
    companyName,
    job.idLocation || "",
    locationName,
    job.description,
    techs,
    job.data?.modality || "",
    job.data?.level || "",
    responsibilities,
    requirements,
    job.aboutCompany || "",
  ].join(" ");

  return normalizeText(combined);
};

/**
 * Evaluates whether a job matches all tokens of a search query.
 */
export const matchesJobTokens = (job: Job, queryTokens: string[]): boolean => {
  if (queryTokens.length === 0) return true;

  const searchableContent = getJobSearchableContent(job);

  // Every token must be included in the normalized searchable content
  return queryTokens.every((token) => searchableContent.includes(token));
};

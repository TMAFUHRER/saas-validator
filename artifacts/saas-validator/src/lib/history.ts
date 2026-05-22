import type { AnalysisRecord } from "./types";

const STORAGE_KEY = "saasvalidator_history";

export function getHistory(): AnalysisRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalysisRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalysis(record: AnalysisRecord): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const updated = [record, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function deleteAnalysis(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

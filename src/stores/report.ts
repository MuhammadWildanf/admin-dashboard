import { create } from "zustand";
import { PaginationType } from "../types/pagination";
import { ReportType } from "../types/report";

type Store = {
  reports: PaginationType<ReportType> | null;
  setReports: (data: PaginationType<ReportType>) => void;
  report: ReportType | null;
  setReport: (data: ReportType | null) => void;
};

export const useReport = create<Store>()((set) => ({
  reports: null,
  setReports: (data: PaginationType<ReportType>) =>
    set((state) => ({
      reports: data,
    })),
  report: null,
  setReport: (data: ReportType | null) =>
    set((state) => ({
      report: data,
    })),
}));

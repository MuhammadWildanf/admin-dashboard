import { TestType } from "./test";

export type ModuleType = {
  id: number;
  name: string;
  price: number;
  psikolog_fee: number;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  detail: {
    modul_id: string | number;
    test: TestType;
  }[];
};

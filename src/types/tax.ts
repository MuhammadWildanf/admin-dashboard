export type TaxType = {
  id: number;
  name: string;
  percent: number | string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  type: "min" | "exclude";
};

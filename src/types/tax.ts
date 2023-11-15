export type TaxType = {
  id: number;
  name: string;
  percent: number | string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  type: "min" | "exclude";
};

export type TaxJournalType = {
  amount: number;
  id: number;
  invoice: {
    id: string;
    invoice_number: string;
    company: {
      id: string;
      name: string;
    } | null;
  } | null;
  percent: number;
  tax: {
    id: number;
    name: string;
  };
  created_at: string;
};

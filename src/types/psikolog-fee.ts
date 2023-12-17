export type PsikologFeeIndexType = {
  id: number;
  activation_code: string;
  module_name: string;
  psikolog_id: string;
  psikolog_name: string;
  psikolog_fee: number;
  participant: {
    name: string;
    birth: string;
    gender: "male" | "female";
    education: string;
  } | null;
  company_name: string | null;
  created_at: string;
  finish_at: string;
  test_session_details_count: number;
  final_report_draft_count: number;
  psikolog_fee_count: number;
  status: "not_finish" | "finish" | "has_report";
};

type PaymentDetail = {
  id: number;
  amount: number;
  activation_code: string;
};

export type PsikologFeeType = {
  id: number;
  payment_code: string;
  amount: number;
  tax: number;
  payment_cuts: number;
  notes: string | null;
  details: PaymentDetail[];
  psikolog: {
    id: string;
    name: string;
  };
  created_at: string; // You may want to use a Date type depending on how you handle dates in your application
  updated_at: string; // You may want to use a Date type depending on how you handle dates in your application
};

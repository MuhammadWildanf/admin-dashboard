import { CompanyType } from "./company";

export type AsesmentType = {
  id: number;
  reg_id: string;
  test_date: string;
  method: string;
  company_id: string;
  company_detail: CompanyType;
  meeting_link: string | null;
  approved_at: string | null;
  approved_by: string | null;
  client: {
    id: string;
    name: string;
  };
  company: CompanyType;
  approved_by_client_at: string | null;
  status: string;
  number_participant: number;
  total_price: number;
  created_at: string;
  updated_at: string;
};

export type AsesmentParticipantType = {
  id: number;
  nik: string;
  assessment_id: string;
  activation_code: string | null;
  confirmed_at: string | null;
  name: string;
  education: string;
  phone: string;
  email: string;
  role: string;
  job_desc: string | null;
  kompetensi: string;
  purpose: string;
  current_position: string | null;
  next_position: string | null;
  notes: string | null;
  price: number;
  product: { id: number | string; name: string };
  created_at: string;
  updated_at: string;
};

export type SellingsType = {
  id: number;
  reg_id: string;
  test_date: string;
  method: string;
  company_id: string;
  company_detail: CompanyType;
  meeting_link: string | null;
  approved_at: string | null;
  approved_by: string | null;
  client: {
    id: string;
    name: string;
  };
  company: CompanyType;
  approved_by_client_at: string | null;
  status: string;
  number_participant: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  invoice: { id: string | number; invoice_number: string };
};

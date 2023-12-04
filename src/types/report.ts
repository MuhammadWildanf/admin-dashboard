export type ReportType = {
  id: string;
  file: string;
  filename: string;
  approved_file: string;
  approved_filename: string;
  activation_code: string;
  notes: string;
  approved_at: string | null;
  approved_by: {
    id: string;
    name: string;
  } | null;
  revised_at: string | null;
  revised_by: {
    id: string;
    name: string;
  } | null;
  revise_note: string | null;
  has_revised_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivationCodeType = {
  id: number;
  code: string;
  start_at: string;
  end_at: string;
  is_used: boolean;
  module_name: string | null;
  participant: string | null;
  psikolog_name: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivationCodeDetailType = {
  activation_code: {
    code: string;
    participant: {
      name: string;
      birth: string;
      gender: "male" | "female" | null;
      education: string;
    } | null;
    module: {
      id: string | number;
      name: string;
    };
    start_at: string;
    finish_at: string;
    status: "proses" | "selesai" | "belum digunakan" | null;
  };
  result: any[];
};

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

export type AccessDataType = {
  code: string;
  created_at: string;
  access: {
    id: number;
    ip: string;
    token: string;
    expired_at: string;
    created_at: string | null;
    updated_at: string;
    is_active: number;
    user_agent: {
      device: boolean;
      browser: {
        name: string;
        version: string;
      };
      platform: {
        name: string;
        version: string;
      };
    };
    ip_detail: {};
  }[];
};

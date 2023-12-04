export type CompanyType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: {
    id: string | number;
    name: string;
    province: {
      id: string | number;
      name: string;
    };
  };
  postal_code: string;
  image: string | null;
  registration_id: string | null;
  clients:
    | {
        id: string;
        name: string;
        nik: string;
        email: string;
        phone: string;
        gender: "male" | "female" | "other"; // Adjust as needed
        role: string;
        is_active: number;
        timezone: string;
        settings: any | null; // Adjust the type based on the actual structure
        created_at: string;
        updated_at: string;
        default_company_id: string;
        pivot: {
          company_id: string;
          client_id: string;
          joined_at: string;
        };
      }[]
    | null;
  npwp: string;
  approved_at: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  registered_by: {
    id: string | number;
    name: string;
  };
};

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

export type ClientType = {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other"; // You can adjust the gender options as needed
  role: "admin" | "user" | "guest"; // You can adjust the role options as needed
  is_active: number; // Assuming 1 means active and 0 means inactive
  timezone: string;
  created_at: string; // You can use Date type if you want to parse this as a Date
  updated_at: string; // You can use Date type if you want to parse this as a Date
  default_company: {
    id: string;
    name: string;
  };
};

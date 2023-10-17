export type UserAdminType = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_active: number;
  timezone: string;
  setting: null | any;
  created_at: string;
  updated_at: string;
};

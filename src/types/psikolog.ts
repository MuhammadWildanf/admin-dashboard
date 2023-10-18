export type PsikologType = {
  id: string;
  fullname: string;
  email: string;
  phone: string | null;
  avatar: string;
  timezone: string;
  created_at: string;
  city: {
    id: string | null;
    name: string | null;
  };
  gender: string | null;
  is_active: number;
  is_approved: number | null;
  email_verified_at: string | null;
  status: string;
};

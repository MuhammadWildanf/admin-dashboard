export type UserPsikologType = {
  id: string;
  fullname: null | string;
  nickname: null | string;
  email: string;
  phone: null | string;
  gender: null | string;
  city: {
    id: number | null;
    name: string | null;
    province?: {
      id: number;
      name: string;
    };
  };
  birth_place: null | string;
  address: null | string;
  postal_code: null | string;
  year_experience: null | number;
  email_verified_at: null | string;
  approved_at: null | string;
  rejected_at: null | string;
  suspended_at: null | string;
  approved_by: {
    id: string;
    name: string;
  } | null;
  rejected_by: null | string;
  suspended_by: null | string;
  is_active: number;
  timezone: string;
  created_at?: string;
  avatar?: string;
  birth_date?: string | null;
  balance?: number;
  rating?: {
    rate: number;
    total: number;
  };
  status?: string;
  activeMembership?: Array<any>;
  specialists?: Array<any>;
  expertises?: Array<any>;
  documents?: Array<any>;
};
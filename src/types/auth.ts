export type GetMeType = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  role: string;
  is_active: boolean;
  timezone: string;
  setting: {} | null;
};

export type NotificationType = {
  new_assessment: number;
  new_companies: number;
};

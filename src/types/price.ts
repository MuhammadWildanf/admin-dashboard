export type PriceType = {
      id: string;
      name: string;
      year_of_experience: string;
      productable_type: string;
      productable_id: string;
      notes: string | null;
      chat_min_price: number;
      chat_max_price: number;
      video_call_min_price: number;
      video_call_max_price: number;
      face2face_min_price: number;
      face2face_max_price: number;
      default_share_profit: number;
      created_at: string;
      updated_at: string;
};

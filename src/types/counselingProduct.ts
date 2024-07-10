export type CounselingProductType = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    image: string | null;
    with_screening: number;
    with_emergency: number;
    counseling_id: string;
    tag: string;
    default_share_profit: number | null;
    screening_modul_id: string | null;
    notes: string;
    create_at: string | null;
    update_at: string | null;
    counseling: {
      id: string;
      name: string;
      description: string | null;
      slug: string;
      image: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    };
    pricings: {
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
    }[];
  };
  
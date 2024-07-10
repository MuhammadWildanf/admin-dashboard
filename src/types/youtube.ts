export type YoutubeType = {
    id: number;
    title: string;
    categories_id: number;
    link: string;
    image: string;
    created_at: string;
    updated_at: string;
    categories: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[];
  };
export type ArticleType = {
    id: number;
    title: string;
    author: string;
    categories_id: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    };
    date: string;
    image: string;
    diskripsi: string;
    created_at: string;
    updated_at: string;
    sub_categories:{
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[];
};


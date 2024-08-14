export type ArticleType = {
    id: number;
    title: string;
    author: string;
    categories_id: string;
    date: string;
    image: string;
    diskripsi: string;
    created_at: string;
    updated_at: string;
    categories: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[];
};
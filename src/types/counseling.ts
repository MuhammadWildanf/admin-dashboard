export type Counseling = {
    id: number;
    psikolog: {
        id: string;
        name: string;
    };
    counseling_service: {
        id: string;
        name: string;
        min_price_chat: number;
        max_price_chat: number;
        min_price_video_call: number;
        max_price_video_call: number;
        min_price_face2face: number;
        max_price_face2face: number;
    };
    chat_price: number | null;
    video_call_price: number | null;
    face2face_price: number | null;
};
export type Booking = {
    id: string;
    status: {
        label: string;
        value: string;
        color: string;
    };
    user: {
        id: string;
        fullname: string;
        nickname: string;
        birth_date: string;
        avatar: string;
        city: {
            id: number;
            name: string;
            label: string;
        };
        timezone: string;
    };
    psikolog: {
        id: string;
        fullname: string;
        gender: string;
        avatar: string;
        city: {
            id: number;
            name: string;
            label: string;
        };
        timezone: string;
    };
    counseling_service: {
        id: string;
        name: string;
    };
    date: string;
    session: {
        id: number;
        day: string;
        start_at: string;
        end_at: string;
    };
    method: {
        slug: string;
        name: string;
    };
    sub_total: string;
    discount: string;
    confirmation: {
        notes: string | null;
        online_link: string | null;
        face2face_location_name: string | null;
        face2face_location_maps: string | null;
        face2face_location_address: string | null;
        created_at: string;
    };
    report: {
        notes: string;
        report_file: string;
        report_url: string;
    } | null;
    grand_total: string;
    invoice_url: string;
    notes: string | null;
    created_at: string;
};

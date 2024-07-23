interface Module {
    id: string;
    name: string;
}

export type assessmentProductType = {
    id: string;
    name: string;
    modul: Module;
    image: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
};
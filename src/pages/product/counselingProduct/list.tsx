import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout.tsx/app";
import { Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useCounselingProduct } from "../../../stores/counselingProduct";
import { FormInput } from "../../../components/forms/input";
import { FormInputRadio } from "../../../components/forms/input-radio";
import { FormTextArea } from "../../../components/forms/input-textarea";
import { useAlert } from "../../../stores/alert";
import { request } from "../../../api/config";
import { getData } from "../../../api/get-data";
import LoadingPage from "../../layout.tsx/loading";
import { Button } from "../../../components/buttons";
import { FormSelectAsync } from "../../../components/forms/input-select";
import { CounselingType } from "../../../types/counselings";


type FormValues = {
    name: string;
    description: string | null;
    slug: string;
    image: FileList | null;
    with_screening: number | null;
    with_emergency: number;
    counseling_id: CounselingType | null;
    tag: string;
    default_share_profit: number | null;
    screening_modul_id: string | null;
    notes: string;
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
        face2face_min_price: number | null;
        face2face_max_price: number | null;
        default_share_profit: number;
    }[];
};

type ErrorForm = {
    name: [] | null;
    description: [] | null;
    slug: [] | null;
    image: [] | null;
    with_screening: [] | null;
    with_emergency: [] | null;
    counseling_id: [] | null;
    tag: [] | null;
    default_share_profit: [] | null;
    screening_modul_id: [] | null;
    notes: [] | null;
    pricings: {
        id: [] | null;
        name: [] | null;
        year_of_experience: [] | null;
        productable_type: [] | null;
        productable_id: [] | null;
        notes: [] | null;
        chat_min_price: [] | null;
        chat_max_price: [] | null;
        video_call_min_price: [] | null;
        video_call_max_price: [] | null;
        face2face_min_price: [] | null;
        face2face_max_price: [] | null;
        default_share_profit: [] | null;
    }[];
};


const screeningOptions = [
    { value: 1, label: "Ya" },
    { value: 0, label: "Tidak" }
];

const emergencyOptions = [
    { value: 1, label: "Ya" },
    { value: 0, label: "Tidak" }
];



const DetailCounselingProduct = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorForm | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useCounselingProduct();
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control, watch } = useForm<FormValues>();
    const name = watch('name');
    const navigate = useNavigate();
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<HTMLDivElement | null>(null);
    const [fileName, setFileName] = useState<string>("");



    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/counseling-products/${id}/id`);
            return data;
        } catch (err: any) {
            console.log(err);
        }
    };

    const handleSave = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        try {
            console.log(data.counseling_id)
            const counselingId = data.counseling_id?.id;
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description ?? "");
            formData.append("slug", data.slug);
            formData.append("with_screening", data.with_screening ? "1" : "0");
            formData.append("with_emergency", data.with_emergency ? "1" : "0");
            formData.append("counseling_id", counselingId?.toString() || '');
            formData.append("tag", data.tag);
            formData.append("default_share_profit", data.default_share_profit?.toString() ?? "0");
            formData.append("screening_modul_id", data.screening_modul_id ?? "");
            formData.append("notes", data.notes);

            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            if (id) {
                await request.post(`/counseling-products/${id}`, formData);
                setMessage("Counseling Products updated!", "success");
            } else {
                await request.post(`/counseling-products/create`, formData);
                setMessage("Counseling Products created!", "success");
            }

            navigate('/product/counseling-products');
        } catch (err: any) {
            if (err.response && err.response.data.errors) {
                setErrors(err.response.data.errors); // Update state with errors
            }
            setMessage(err.response.data.message, "error");
        }
        setErrors(null);
        setLoadingSubmit(false);
    });

    const handleClick = () => {
        if (uploadInputRef.current) {
            uploadInputRef.current.click();
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result as string);
            };
            reader.readAsDataURL(file);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            setValue("image", dataTransfer.files);
            setFileName(file.name);
        } else {
            setPreviewSrc(null);
            setValue("image", null);
            setFileName("");
        }
    };


    const selectCounseling = async (inputValue: string) => {
        let params = {
            q: inputValue,
        };
        const { data } = await request.get("/counselings/counseling", {
            params: params,
        });

        return data.data;
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDetail().then((res) => {
                setDetail(res);
                setValue("name", res.name);
                setValue("description", res.description);
                setValue("slug", res.slug);
                setValue("with_screening", res.with_screening);
                setValue("with_emergency", res.with_emergency);
                setValue("counseling_id", res.counseling_id);
                setValue("tag", res.tag);
                setValue("default_share_profit", res.default_share_profit);
                setValue("screening_modul_id", res.screening_modul_id);
                setValue("notes", res.notes);
                setPreviewSrc(res.image);
                setLoading(false);
            });
        } else {
            setDetail(null);
            reset({
                name: "",
                description: "",
                slug: "",
                with_screening: null,
                with_emergency: 0,
                counseling_id: null,
                tag: "",
                default_share_profit: null,
                screening_modul_id: "",
                notes: "",
                image: null,
            });
        }
    }, [id]);

    useEffect(() => {
        if (name !== undefined) {
            if (name.trim() === "") {
                setValue("slug", "");
            } else {
                const slug = name
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                setValue('slug', slug);
            }
        }
    }, [name, setValue]);



    return (
        <Layout
            withPageTitle
            title={id ? 'Edit Counseling Product' : 'Create Counseling Product'}
            pageTitleContent={<></>}
        >
            <>
                {loading ? (
                    <LoadingPage />
                ) : (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <form>
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-8 md:mb-0">
                                    <FormInput
                                        name="name"
                                        control={control}
                                        label="Nama"
                                        error={errors?.name}
                                    />
                                    <FormTextArea
                                        name="description"
                                        control={control}
                                        label="Description"
                                        error={errors?.description}
                                    />
                                    <FormInput
                                        name="slug"
                                        control={control}
                                        label="Slug"
                                        error={errors?.slug}
                                    />
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <div className="w-full md:w-1/3 px-3">
                                            <FormInputRadio
                                                label="With Screening"
                                                name="with_screening"
                                                control={control}
                                                options={screeningOptions}
                                                required
                                                error={null} // Berikan pesan error jika diperlukan
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <FormInputRadio
                                                label="With Emergency"
                                                name="with_emergency"
                                                control={control}
                                                options={emergencyOptions}
                                                required
                                                error={null} // Berikan pesan error jika diperlukan
                                            />
                                        </div>
                                    </div>
                                    <FormSelectAsync
                                        label="Counseling"
                                        name="counseling_id"
                                        control={control}
                                        loadOption={selectCounseling}
                                        optionLabel={(option: CounselingType) => option.name}
                                        optionValue={(option: CounselingType) => option.id?.toString()}  // Pastikan mengembalikan string ID
                                        error={errors?.counseling_id}
                                    />
                                    <FormInput
                                        name="tag"
                                        control={control}
                                        label="Tag"
                                        error={errors?.tag}
                                    />
                                    <FormInput
                                        name="default_share_profit"
                                        control={control}
                                        label="Default Share Profit"
                                        error={errors?.default_share_profit}
                                    />
                                    <FormInput
                                        name="screening_modul_id"
                                        control={control}
                                        label="Screening Modul"
                                        error={errors?.screening_modul_id}
                                    />
                                    <FormTextArea
                                        name="notes"
                                        control={control}
                                        label="Notes"
                                        error={errors?.notes}
                                    />
                                </div>

                                <div className="w-full md:w-1/2 px-3">
                                    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
                                        <div className="px-4 py-6">
                                            <div
                                                id="image-preview"
                                                className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
                                                onClick={handleClick}
                                                ref={imagePreviewRef}
                                            >
                                                <input
                                                    id="upload"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    ref={uploadInputRef}
                                                />
                                                {previewSrc ? (
                                                    <img src={previewSrc} className="max-h-48 rounded-lg mx-auto" alt="Image preview" />
                                                ) : (
                                                    <label htmlFor="upload" className="cursor-pointer">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="w-8 h-8 text-gray-700 mx-auto mb-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3 16.5v2.25A2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                                            />
                                                        </svg>
                                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                                                        <p className="font-normal text-sm text-gray-400 md:px-6">
                                                            Choose photo size should be less than <b className="text-gray-600">2mb</b>
                                                        </p>
                                                        <p className="font-normal text-sm text-gray-400 md:px-6">
                                                            and should be in <b className="text-gray-600">JPG, PNG, or GIF</b> format.
                                                        </p>
                                                        <span id="filename" className="text-gray-500 bg-gray-200 z-50">
                                                            {fileName}
                                                        </span>
                                                    </label>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <div className="w-full">
                                                    <label className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer">
                                                        <span className="text-center ml-2" onClick={handleClick}>
                                                            Upload
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center justify-end">
                                <Button className="px-8" onClick={handleSave}>
                                    {loadingSubmit ? <Spinner /> : (id ? "Update" : "Create")}
                                </Button>
                            </div>
                        </form>

                    </div>
                )}
            </>
        </Layout>
    );
};

export default DetailCounselingProduct;

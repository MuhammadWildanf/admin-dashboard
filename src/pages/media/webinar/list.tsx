import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout.tsx/app";
import { FileInput, Label } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { useWebinar } from "../../../stores/webinar";
import { FormInput } from "../../../components/forms/input";
import { FormTextArea } from "../../../components/forms/input-textarea";
import { FormSelect, FormSelectAsync } from "../../../components/forms/input-select";
import { SelectOptionType } from "../../../types/form";
import { useAlert } from "../../../stores/alert";
import { request } from "../../../api/config";
import { getData } from "../../../api/get-data";
import { calculateAge, parseDate } from "../../../helper/date";
import moment from "moment";
import LoadingPage from "../../layout.tsx/loading";
import { Button } from "../../../components/buttons";


type FormValues = {
    title: string;
    limit_peserta: number;
    author: string;
    image: FileList | null;
    date: string;
    time_start: string;
    time_end: string;
    media_layanan: string;
    harga_sertifikat: string;
    link: string;
    categories: {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }[];
};

type ErrorForm = {
    title: [] | null;
    limit_peserta: [] | null;
    author: [] | null;
    image: [] | null;
    date: [] | null;
    time_start: [] | null;
    time_end: [] | null;
    media_layanan: [] | null;
    harga_sertifikat: [] | null;
    link: [] | null;
};


const DetailWebinar = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorForm | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useWebinar();
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<HTMLDivElement | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const navigate = useNavigate();


    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/webinar/${id}/id`);
            return data;
        } catch (err: any) {
            console.log(err);
        }
    };


    const handleSave = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("limit_peserta", (data.limit_peserta ?? 0).toString());
            formData.append("author", data.author);
            formData.append("date", data.date);
            formData.append("time_start", data.time_start);
            formData.append("time_end", data.time_end);
            formData.append("media_layanan", data.media_layanan);
            formData.append("harga_sertifikat", data.harga_sertifikat);
            formData.append("link", data.link);
            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            if (id) {
                await request.put(`/webinar/${id}`, formData);
                setMessage("webinar updated!", "success");
            } else {
                await request.post(`/webinar/create`, formData);
                setMessage("webinar created!", "success");
            }

            navigate('/media/webinar');
        } catch (err: any) {
            setErrors(err.response.data.errors);
            console.log(err);
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

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDetail().then((res) => {
                setDetail(res[0]);
                setValue("title", res[0].title);
                setValue("limit_peserta", res[0].limit_peserta?.toString() ?? "0");
                setValue("author", res[0].author);
                setValue("date", res[0].date);
                setValue("time_start", res[0].time_start);
                setValue("time_end", res[0].time_end);
                setValue("media_layanan", res[0].media_layanan);
                setValue("harga_sertifikat", res[0].harga_sertifikat);
                setValue("link", res[0].link);
                setPreviewSrc(res[0].image ?? null);
                setLoading(false);
            });
        } else {
            setDetail(null);
            reset({
                title: "",
                limit_peserta: 0,
                author: "",
                date: "",
                time_start: "",
                time_end: "",
                media_layanan: "",
                harga_sertifikat: "",
                link: "",
                image: null,
            });
        }
    }, [id]);

    return (
        <Layout
            withPageTitle
            title={id ? 'Edit Webinar' : 'Create Webinar'}
            pageTitleContent={<></>}
        >
            <>
                {loading ? (
                    <LoadingPage />
                ) : (
                    <form>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-8 md:mb-0">

                                <FormInput
                                    name="title"
                                    control={control}
                                    label="Title"
                                    error={errors?.title}
                                />
                                <FormInput
                                    name="limit_peserta"
                                    control={control}
                                    label="Limit Peserta"
                                    error={errors?.limit_peserta}
                                />
                                <FormInput
                                    name="author"
                                    control={control}
                                    label="Author"
                                    error={errors?.author}
                                />

                                <div className="flex flex-wrap -mx-3">
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <FormInput
                                            name="time_start"
                                            type="time"
                                            control={control}
                                            label="Time Start"
                                            error={errors?.time_start}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3">
                                        <FormInput
                                            name="time_end"
                                            type="time"
                                            control={control}
                                            label="Time End"
                                            error={errors?.time_end}
                                        />
                                    </div>
                                </div>

                                <FormInput
                                    name="media_layanan"
                                    control={control}
                                    label="Media Layanan"
                                    error={errors?.media_layanan}
                                />
                                <FormInput
                                    name="harga_sertifikat"
                                    control={control}
                                    label="Harga Sertifikat"
                                    error={errors?.harga_sertifikat}
                                />
                                <FormInput
                                    name="link"
                                    control={control}
                                    label="Link"
                                    error={errors?.link}
                                />
                            </div>
                            <div className="-full md:w-1/2 px-3">
                                <FormInput
                                    name="date"
                                    type="date"
                                    control={control}
                                    label="Date"
                                    error={errors?.date}
                                />
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
                )}
            </>
        </Layout>
    );
};

export default DetailWebinar;

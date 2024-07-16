import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { FileInput, Label } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { useWebinar } from "../../stores/webinar";
import { FormInput } from "../../components/forms/input";
import { FormTextArea } from "../../components/forms/input-textarea";
import { FormSelect } from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { useAlert } from "../../stores/alert";
import { request } from "../../api/config";
import { getData } from "../../api/get-data";
import { calculateAge, parseDate } from "../../helper/date";
import moment from "moment";
import LoadingPage from "../layout.tsx/loading";
import { Button } from "../../components/buttons";


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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useWebinar();
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control } = useForm<FormValues>();

    const navigate = useNavigate();


    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/webinar/${id}`);
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
                await request.put(`/webinar/update/${id}`, formData);
                setMessage("webinar updated!", "success");
            } else {
                await request.post(`/webinar/create`, formData);
                setMessage("webinar created!", "success");
            }

            navigate('/webinar');
        } catch (err: any) {
            setErrors(err.response.data.errors);
            console.log(err);
        }
        setErrors(null);
        setLoadingSubmit(false);
    });


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            setValue("image", dataTransfer.files);
        } else {
            setImagePreview(null);
            setValue("image", null);
        }
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDetail().then((res) => {
                setDetail(res);
                setValue("title", res.title);
                setValue("limit_peserta", res.limit_peserta?.toString() ?? "0");
                setValue("author", res.author);
                setValue("date", res.date);
                setValue("time_start", res.time_start);
                setValue("time_end", res.min_purchase);
                setValue("media_layanan", res.media_layanan);
                setValue("harga_sertifikat", res.harga_sertifikat);
                setValue("link", res.link);
                setImagePreview(res.image);
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
                                <div>
                                    <Label className="file-upload-helper-text" value="Upload Image" />
                                </div>
                                <FileInput
                                    id="file-upload-helper-text"
                                    helperText="SVG, PNG, JPG or GIF."
                                    onChange={handleImageChange}
                                    accept=".png, .jpg, .jpeg"
                                />
                                {imagePreview && (
                                    <img
                                        className="mt-2"
                                        src={imagePreview}
                                        alt="Voucher"
                                        width="150px"
                                    />
                                )}
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

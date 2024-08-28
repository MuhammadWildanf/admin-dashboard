import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { FileInput, Label } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { useVoucher } from "../../stores/voucher";
import { FormInput } from "../../components/forms/input";
import { FormTextArea } from "../../components/forms/input-textarea";
import { FormSelect } from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { useAlert } from "../../stores/alert";
import { request } from "../../api/config";
import { getData } from "../../api/get-data";
import moment from "moment";
import LoadingPage from "../layout.tsx/loading";
import { Button } from "../../components/buttons";


type FormValues = {
    code: string;
    description: string;
    amount: string;
    discount_type: SelectOptionType | undefined;
    expiry_date: string;
    user_type: SelectOptionType | undefined;
    max_discount: string;
    min_purchase: string;
    terms_conditions: string;
    for: string;
    usage_limit: string;
    claim_type: SelectOptionType | undefined;
    usage_count: string;
    image: FileList | null;
};

type ErrorForm = {
    code: [] | null;
    description: [] | null;
    amount: [] | null;
    discount_type: [] | null;
    expiry_date: [] | null;
    user_type: [] | null;
    max_discount: [] | null;
    min_purchase: [] | null;
    terms_conditions: [] | null;
    for: [] | null;
    usage_limit: [] | null;
    claim_type: [] | null;
    usage_count: [] | null;
    image: [] | null;
};


const DetailVoucher = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorForm | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useVoucher();
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<HTMLDivElement | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control } = useForm<FormValues>();

    const navigate = useNavigate();


    const discountTypes = [
        { label: "Fixed", value: "fixed" },
        { label: "Percentage", value: "percentage" },
    ];

    const userTypes = [
        { label: "User", value: "user" },
        { label: "Psikolog", value: "psikolog" },
    ];

    const claimTypes = [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" },
    ];

    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/voucher/${id}`);
            return data;
        } catch (err: any) {
            console.log(err);
        }
    };

    const handleSave = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        try {
            const formData = new FormData();
            formData.append("code", data.code);
            formData.append("description", data.description);
            formData.append("amount", data.amount);
            formData.append(
                "discount_type",
                String(data.discount_type?.value ?? "")
            );
            formData.append("expiry_date", data.expiry_date);
            formData.append("user_type", String(data.user_type?.value ?? ""));
            formData.append("max_discount", data.max_discount);
            formData.append("min_purchase", data.min_purchase);
            formData.append("terms_conditions", data.terms_conditions);
            formData.append("for", data.for);
            formData.append("usage_limit", data.usage_limit);
            formData.append(
                "claim_type",
                String(data.claim_type?.value ?? "")
            );
            formData.append("usage_count", data.usage_count);

            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            if (id) {
                formData.append("_method", "PUT");
                await request.post(`/voucher/update/${id}`, formData);
                setMessage("Voucher updated!", "success");
            } else {
                await request.post(`/voucher/create`, formData);
                setMessage("Voucher created!", "success");
            }

            navigate('/voucher');
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
                setDetail(res);
                setValue("code", res.code);
                setValue("description", res.description);
                setValue("amount", res.amount);
                setValue(
                    "discount_type",
                    discountTypes.find((type) => type.value === res.discount_type)
                );
                setValue("expiry_date", res.expiry_date);
                setValue(
                    "user_type",
                    userTypes.find((type) => type.value === res.user_type)
                );
                setValue("max_discount", res.max_discount);
                setValue("min_purchase", res.min_purchase);
                setValue("terms_conditions", res.terms_conditions);
                setValue("for", res.for);
                setValue("usage_limit", res.usage_limit?.toString() ?? "");
                setValue(
                    "claim_type",
                    claimTypes.find((type) => type.value === res.claim_type)
                );
                setValue("usage_count", res.usage_count.toString());
                setPreviewSrc(res.image);
                setLoading(false);
            });
        } else {
            setDetail(null);
            reset({
                code: "",
                description: "",
                amount: "",
                discount_type: undefined,
                expiry_date: "",
                user_type: undefined,
                max_discount: "",
                min_purchase: "",
                terms_conditions: "",
                for: "",
                usage_limit: "",
                claim_type: undefined,
                usage_count: "",
                image: null,
            });
        }
    }, [id]);

    return (
        <Layout
            withPageTitle
            title={id ? 'Edit Voucher' : 'Create Voucher'}
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
                                    name="code"
                                    control={control}
                                    label="Kode"
                                    error={errors?.code}
                                />
                                <FormTextArea
                                    name="description"
                                    control={control}
                                    label="Description"
                                    error={errors?.description}
                                />
                                <FormTextArea
                                    name="terms_conditions"
                                    control={control}
                                    label="Terms Conditions"
                                    error={errors?.terms_conditions}
                                />
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormInput
                                            name="amount"
                                            type="number"
                                            control={control}
                                            label="Amount"
                                            error={errors?.amount}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormInput
                                            name="max_discount"
                                            control={control}
                                            label="Max Discount"
                                            error={errors?.max_discount}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormInput
                                            name="min_purchase"
                                            control={control}
                                            label="Min Purchase"
                                            error={errors?.min_purchase}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormSelect
                                            name="discount_type"
                                            control={control}
                                            label="Discount Type"
                                            options={discountTypes}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormSelect
                                            name="user_type"
                                            control={control}
                                            label="User Type"
                                            options={userTypes}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-3">
                                        <FormSelect
                                            name="claim_type"
                                            control={control}
                                            label="Claim Type"
                                            options={claimTypes}
                                        />
                                    </div>
                                </div>
                                <FormInput
                                    name="for"
                                    control={control}
                                    label="For"
                                    error={errors?.for}
                                />
                                <FormInput
                                    name="usage_limit"
                                    control={control}
                                    type="number"
                                    label="Usage Limit"
                                    error={errors?.usage_limit}
                                />
                                <FormInput
                                    name="usage_count"
                                    control={control}
                                    type="number"
                                    label="Usage Count"
                                    error={errors?.usage_count}
                                />
                            </div>
                            <div className="-full md:w-1/2 px-3">
                                <FormInput
                                    name="expiry_date"
                                    control={control}
                                    type="date"
                                    label="Expiry Date"
                                    error={errors?.expiry_date}
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

export default DetailVoucher;

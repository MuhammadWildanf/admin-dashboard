import { useEffect, useState } from "react";
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
import { calculateAge, parseDate } from "../../helper/date";
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useVoucher();
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
                await request.put(`/voucher/update/${id}`, formData);
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
                setImagePreview(res.image);
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

export default DetailVoucher;

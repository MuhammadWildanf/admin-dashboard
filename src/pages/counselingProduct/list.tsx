import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { Spinner } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useCounselingProduct } from "../../stores/counselingProduct";
import { FormInput } from "../../components/forms/input";
import { FormSelect } from "../../components/forms/input-select";
import { FormTextArea } from "../../components/forms/input-textarea";
import { useAlert } from "../../stores/alert";
import { request } from "../../api/config";
import Table from "../../components/tables/base";
import { getData } from "../../api/get-data";
import LoadingPage from "../layout.tsx/loading";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import { Pencil, Trash, PlusCircle } from "@phosphor-icons/react";
import { PriceType } from "../../types/price";
import { usePrice } from "../../stores/price";



type FormValues = {
    name: string;
    description: string | null;
    slug: string;
    image: FileList | null;
    with_screening: number | null;
    with_emergency: number;
    counseling_id: string;
    tag: string;
    default_share_profit: number | null;
    screening_modul_id: string | null;
    notes: string;
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
};


const DetailCounselingProduct = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorForm | null>(null);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useCounselingProduct();
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control, watch } = useForm<FormValues>();
    const [counselingOptions, setCounselingOptions] = useState<any[]>([]);
    const name = watch('name');
    const navigate = useNavigate();

    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<HTMLDivElement | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const [modalAdd, setModalAdd] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
        undefined
    );
    const [modalDelete, setModalDelete] = useState<boolean>(false);
    const [selected, setSelected] = useState<PriceType | null>(null);


    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/counseling-products/${id}/id`);
            return data;
        } catch (err: any) {
            console.log(err);
        }
    };

    const getCounselingOptions = async () => {
        try {
            const response = await getData("https://api-dev.deeptalk.co.id/admin/counselings");
            setCounselingOptions(response.data);
        } catch (err: any) {
            console.log(err);
        }
    };

    const handleSave = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description ?? "");
            formData.append("slug", data.slug);
            formData.append("with_screening", data.with_screening?.toString() ?? "0");
            formData.append("with_emergency", data.with_emergency.toString());
            formData.append("counseling_id", data.counseling_id);
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

            navigate('/counseling-products');
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

    // for Price

    const handleSavePrice = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        try {
            let payload = {
                ...data,
            };
            if (modalMode === "create") {
                await request.post("/price/create", payload);
            } else {
                await request.post(`/price/${selected?.id}`, payload);
            }
            setModalAdd(false);
            setModalMode(undefined);
            setMessage("Price saved!", "success");
        } catch (err: any) {
            setErrors(err.response.data.errors);
            console.log(err);
        }
        setErrors(null);
        setLoadingSubmit(false);
    });

    const handleEditPrice = (pricing: PriceType) => {
        setSelected(pricing);
        setModalMode("edit");
        setValue("name", pricing.name ?? "");
        setModalAdd(true);
    };

    const handleDelete = async () => {
        setLoadingSubmit(true);
        try {
            await request.delete(`/price/${selected?.id}`);
            setSelected(null);
            setModalDelete(false);
            setMessage("Price deleted", "success");
        } catch (err: any) {
            setErrors(err.response.data.errors);
        }
        setLoadingSubmit(false);
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDetail().then((res) => {
                setDetail(res[0]);
                setValue("name", res[0].name);
                setValue("description", res[0].description);
                setValue("slug", res[0].slug);
                setValue("with_screening", res[0].with_screening);
                setValue("with_emergency", res[0].with_emergency);
                setValue("counseling_id", res[0].counseling_id);
                setValue("tag", res[0].tag);
                setValue("default_share_profit", res[0].default_share_profit);
                setValue("screening_modul_id", res[0].screening_modul_id);
                setValue("notes", res[0].notes);
                setPreviewSrc(res[0].image);
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
                counseling_id: "",
                tag: "",
                default_share_profit: null,
                screening_modul_id: "",
                notes: "",
                image: null,
            });
        }
        getCounselingOptions();
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


    useEffect(() => {
        if (id && counselingOptions.length > 0 && detail) {
            const selectedOption = counselingOptions.find(option => option.id === detail.counseling_id);
            if (!selectedOption) {
                setValue('counseling_id', '');
            }
        }
    }, [counselingOptions, id, detail, setValue]);

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
                                            <FormInput
                                                name="with_screening"
                                                control={control}
                                                label="With Screening"
                                                error={errors?.with_screening}
                                                className="w-1/2"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3 px-3">
                                            <FormInput
                                                name="with_emergency"
                                                control={control}
                                                label="With Emergency"
                                                error={errors?.with_emergency}
                                                className="w-1/2"
                                            />
                                        </div>
                                    </div>
                                    <FormInput
                                        name="counseling_id"
                                        control={control}
                                        label="Counseling"
                                        error={errors?.counseling_id}
                                    />
                                    <FormSelect
                                        name="counseling_id"
                                        control={control}
                                        label="Counseling ID"
                                        error={errors?.counseling_id}
                                        options={counselingOptions.map(option => ({ value: option.id, label: option.id }))}
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

                        {detail && detail.pricings && (
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold mb-4">Price</h3>
                                    <PlusCircle
                                        size={32}
                                        className="text-blue-600 text-xl cursor-pointer"
                                        onClick={() => {
                                            setModalAdd(true);
                                            setModalMode("create");
                                            reset();
                                        }}
                                    />
                                </div>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Years of Experience</Table.Th>
                                            <Table.Th>Chat Min Price</Table.Th>
                                            <Table.Th>Chat Max Price</Table.Th>
                                            <Table.Th>Video Call Min Price</Table.Th>
                                            <Table.Th>Video Call Max Price</Table.Th>
                                            <Table.Th>Face2Face Min Price</Table.Th>
                                            <Table.Th>Face2Face Max Price</Table.Th>
                                            <Table.Th>Default Share Profit</Table.Th>
                                            <Table.Th>Opsi</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {detail.pricings.length > 0 ? (
                                            detail.pricings.map((pricing) => (
                                                <Table.Tr key={pricing.id}>
                                                    <Table.Td>{pricing.name}</Table.Td>
                                                    <Table.Td>{pricing.year_of_experience}</Table.Td>
                                                    <Table.Td>{pricing.chat_min_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.chat_max_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.video_call_min_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.video_call_max_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.face2face_min_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.face2face_max_price.toString()}</Table.Td>
                                                    <Table.Td>{pricing.default_share_profit.toString()}</Table.Td>
                                                    <Table.Td>
                                                        <div className="flex items-center gap-1">
                                                            <Trash
                                                                className="text-red-600 text-xl cursor-pointer"
                                                                onClick={() => {
                                                                    setSelected(pricing);
                                                                    setModalDelete(true);
                                                                }}
                                                            />
                                                            <Pencil
                                                                className="text-blue-600 text-xl cursor-pointer"
                                                                onClick={() => handleEditPrice(pricing)}
                                                            />
                                                        </div>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))
                                        ) : (
                                            <Table.Tr>
                                                <Table.Td cols={10} className="text-center py-3">
                                                    Tidak ada data ditemukan!
                                                </Table.Td>
                                            </Table.Tr>
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        )}
                    </div>

                )}
                <BaseModal
                    title={modalMode === "create" ? "Tambah Harga" : "Edit Harga"}
                    isOpen={modalAdd}
                    close={() => setModalAdd(false)}
                >
                    <form>
                        <FormInput
                            name="name"
                            control={control}
                            label="Nama"
                            error={errors?.name}
                        />
                        <div className="mt-3 flex items-center justify-end">
                            <Button className="px-8" onClick={handleSavePrice}>
                                {loadingSubmit ? <Spinner /> : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </BaseModal>

                <ModalDeleteConfirmation
                    isOpen={modalDelete}
                    close={() => setModalDelete(false)}
                    subTitle="Price"
                    name={selected?.name ?? ""}
                    loading={loadingSubmit}
                    action={handleDelete}
                />
            </>
        </Layout>
    );
};

export default DetailCounselingProduct;

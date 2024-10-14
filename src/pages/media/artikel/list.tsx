import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout.tsx/app";
import { FileInput, Label } from "flowbite-react";
import { Spinner } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { useArticles } from "../../../stores/articles";
import { FormInput } from "../../../components/forms/input";
import { FormTextArea } from "../../../components/forms/input-textarea";
import { FormSelect, FormSelectAsync } from "../../../components/forms/input-select";
import { SelectOptionType } from "../../../types/form";
import { useAlert } from "../../../stores/alert";
import { request } from "../../../api/config";
import { getData } from "../../../api/get-data";
import moment from "moment";
import LoadingPage from "../../layout.tsx/loading";
import { Button } from "../../../components/buttons";
import { CategoryType } from "../../../types/category";
import { SubCategoryType } from "../../../types/subcategory";
import { Editor } from "@tinymce/tinymce-react";



type FormValues = {
    title: string;
    author: string;
    categories_id: CategoryType | null;
    sub_categories: SubCategoryType[] | null;
    date: string;
    image: FileList | null;
    diskripsi: string;
};

type ErrorForm = {
    title: [] | null;
    author: [] | null;
    categories_id: [] | null;
    sub_categories: [] | null;
    date: [] | null;
    image: [] | null;
    diskripsi: [] | null;
};


const DetailArticle = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorForm | null>(null);
    const { id } = useParams();
    const { detail, setDetail } = useArticles();
    const { setMessage } = useAlert();
    const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement | null>(null);
    const imagePreviewRef = useRef<HTMLDivElement | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [editorContent, setEditorContent] = useState("");
    const navigate = useNavigate();


    const getDetail = async () => {
        setLoading(true);
        try {
            const data = await getData(`/artikel/${id}/id`);
            return data;
        } catch (err: any) {
            console.log(err);
        }
    };

    const selectCategory = async (inputValue: string) => {
        let params = {
            q: inputValue,
        };
        const { data } = await request.get("/categories-artikel", {
            params: params,
        });

        return data.data.data;
    };

    const selectSubCategory = async (inputValue: string) => {
        let params = {
            q: inputValue,
        };
        const { data } = await request.get("/subcategories", {
            params: params,
        });

        return data.data.data;
    };

    const handleSave = handleSubmit(async (data) => {
        setLoadingSubmit(true);
        // console.log('ini log dari memilih categories', data.categories_id);
        const categoryId = data.categories_id?.id;
        const subCategoryIds = data.sub_categories?.map(subCategory => subCategory.id);
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("author", data.author);
            formData.append("categories_id", categoryId?.toString() || '');
            formData.append("sub_categories_id", subCategoryIds?.join(',') || '');
            formData.append("date", data.date);
            formData.append("diskripsi", data.diskripsi);
            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            if (id) {
                formData.append("_method", "PUT");
                await request.post(`/artikel/${id}`, formData);
                setMessage("Artikel updated!", "success");
            } else {
                await request.post(`/artikel/create`, formData);
                setMessage("Artikel created!", "success");
            }

            navigate('/media/artikel');
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

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDetail().then((res) => {
                setDetail(res[0]);
                console.log('ini dari res[0].categories_id =>>', res[0].categories_id)
                setValue("title", res[0].title);
                setValue("author", res[0].author);
                setValue("date", res[0].date);
                setValue("diskripsi", res[0].diskripsi);
                setValue("categories_id", res[0].categories_id);
                setValue("sub_categories", res[0].sub_categories);
                setEditorContent(res[0].diskripsi);
                setPreviewSrc(res[0].image ?? null);
                setLoading(false);
            });
        } else {
            setDetail(null);
            reset({
                title: "",
                author: "",
                date: "",
                diskripsi: "",
                image: null,
                categories_id: null,
                sub_categories: null,
            });
            setEditorContent("");
        }
    }, [id]);

    return (
        <Layout
            withPageTitle
            title={id ? 'Edit Artikel' : 'Create Artikel'}
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
                                    name="author"
                                    control={control}
                                    label="Author"
                                    error={errors?.author}
                                />
                                <FormSelectAsync
                                    label="Category"
                                    name="categories_id"
                                    control={control}
                                    loadOption={selectCategory}
                                    optionLabel={(option: CategoryType) => option.name}
                                    optionValue={(option: CategoryType) => option.id.toString()}  // Pastikan mengembalikan string ID
                                    error={errors?.categories_id}
                                />
                                <FormSelectAsync
                                    label="Sub Category"
                                    name="sub_categories"
                                    control={control}
                                    loadOption={selectSubCategory}
                                    optionLabel={(option: SubCategoryType) => option.name}
                                    optionValue={(option: SubCategoryType) => option.id.toString()}  // Pastikan mengembalikan string ID
                                    multiple={true}
                                    error={errors?.categories_id}
                                />
                                <FormInput
                                    name="date"
                                    type="date"
                                    control={control}
                                    label="Date"
                                    error={errors?.date}
                                />
                            </div>
                            <div className="-full md:w-1/2 px-3">
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
                        <div className="mt-3">
                            <label className="block text-sm mb-1 text-gray-700">
                                Deskripsi
                            </label>
                            <Editor
                                value={editorContent}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                apiKey='e26pww344ed68y1cc1o5aaptc7kes3anxxqach3spk89gk5t'
                                onEditorChange={(content) => {
                                    setEditorContent(content);
                                    setValue("diskripsi", content); // Update form value
                                }}
                            />
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

export default DetailArticle;

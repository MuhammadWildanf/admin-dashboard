import { useEffect, useState, ChangeEvent, useRef } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../components/buttons/add";
import { useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { FormInput } from "../../components/forms/input";
import {
  FormSelect,
  FormSelectAsync,
  FormSelectTimezone,
} from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { ArticleType } from "../../types/articles";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useArticles } from "../../stores/articles";
import { CategoryType } from "../../types/category";


type FormValues = {
  title: string;
  author: string;
  categories_id: string;
  date: string;
  image: FileList | null;
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
  author: [] | null;
  categories_id: [] | null;
  date: [] | null;
  image: [] | null;
  link: [] | null;
  categories: [] | null;
};

const IndexArticle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ArticleType | null>(null);
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const imagePreviewRef = useRef<HTMLDivElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { setArticles, GetArticles } = useArticles();
  const { setMessage } = useAlert();


  const GetAllArticle = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/artikel", page, search, searchMode);
      return data;
    } catch { }
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

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await GetAllArticle(input ?? "", true);
    setArticles(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetArticles?.last_page) {
      return;
    }

    setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
  };

  const handleSave = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("categories_id", data.categories_id);
      formData.append("date", data.date);
      formData.append("link", data.link);
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      if (modalMode === "create") {
        await request.post("/artikel/create", formData);
      } else {
        await request.post(`/artikel/${selected?.id}`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Article saved!", "success");
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

  const handleFormEdit = (item: ArticleType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("title", item.title);
    setValue("author", item.author);
    setValue("categories_id", item.categories_id);
    setValue("date", item.date);
    setValue("link", item.link);
    setPreviewSrc(item.image ?? null);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/artikel/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Article deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([GetAllArticle()]).then((res) => {
      setArticles(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Artikel"
      pageTitleContent={
        <div className="flex items-center">
          <input
            type="text"
            className="rounded-l-lg border-gray-300"
            placeholder={"Cari disini..."}
            onChange={(e) => setQ(e.target.value)}
            disabled={loading}
            value={q}
          />
          {q && (
            <button
              onClick={() => handleSearch("")}
              className="py-3 px-2 border border-red-600 bg-red-600 text-white"
            >
              <HiX />
            </button>
          )}
          <button
            className={`${loading ? "py-2 px-3" : "p-3"} text-lg rounded-r-lg ${loading
              ? "bg-blue-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            disabled={loading}
            onClick={() => handleSearch(q ?? "")}
          >
            {loading ? <Spinner size={"sm"} /> : <HiOutlineSearch />}
          </button>
        </div>
      }
    >
      <AddButton
        onClick={() => {
          setModalAdd(true);
          setModalMode("create");
          reset();
        }}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Author</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>LInk</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetArticles?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetArticles?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetArticles.per_page *
                          (GetArticles.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.title ?? ""}</Table.Td>
                      <Table.Td>{item.author ?? ""}</Table.Td>
                      <Table.Td>{item.categories[0]?.name ?? ""}</Table.Td>
                      <Table.Td>{item.date ?? ""}</Table.Td>
                      <Table.Td>{item.link ?? ""}</Table.Td>
                      <Table.Td>
                        {item.image && (
                          <img
                            src={item.image}
                            alt="Image"
                            className="h-10 w-10 object-cover"
                          />
                        )}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-1">
                          <Trash
                            className="text-red-600 text-xl cursor-pointer"
                            onClick={() => {
                              setSelected(item);
                              setModalDelete(true);
                            }}
                          />
                          <Pencil
                            className="text-blue-600 text-xl cursor-pointer"
                            onClick={() => handleFormEdit(item)}
                          />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}
            </>
          )}
        </Table.Tbody>
      </Table>
      <Pagination
        currentPage={GetArticles?.current_page ?? 1}
        totalPage={GetArticles?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Artikel" : "Edit Artikel"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <form>
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
            optionLabel={(option: CategoryType) => `${option.name}`}
            optionValue={(option: CategoryType) => `${option.id}`}
            error={errors?.categories_id} />
          <FormInput name="date" type="date" control={control} label="Date" error={errors?.date} />
          <FormInput name="link" control={control} label="Link" error={errors?.link} />
          <div className="mt-3">
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

          <div className="mt-3 flex items-center justify-end">
            <Button className="px-8" onClick={handleSave}>
              {loadingSubmit ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </form>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        name={selected?.title ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default IndexArticle;

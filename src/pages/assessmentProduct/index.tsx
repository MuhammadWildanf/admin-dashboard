import React, { useEffect, useState } from 'react';
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../components/buttons/add";
import { useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import { FormSelectAsync} from "../../components/forms/input-select";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { FormInput } from "../../components/forms/input";
import { assessmentProductType } from "../../types/assessmentProduct";
import { moduleType } from "../../types/module";
import { request } from "../../api/config";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useAssessmentProduct } from "../../stores/assessmentProduct";

type FormValues = {
  name: string;
  description: string;
  modul: moduleType;
  image: FileList | null;
};

type ErrorForm = {
  name: [] | null;
  description: [] | null;
  modul: [] | null;
  image: [] | null;
};

const AssessmentProduct = () => {
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
  const [selected, setSelected] = useState<assessmentProductType | null>(null);
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { setassessmentProduct, getassessmentProduct } = useAssessmentProduct();
  const { setMessage } = useAlert();

  const getAssessment = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/assessment-product", page, search, searchMode);
      return data;
    } catch { }
  };

  const selectModules = async (inputValue: string) => {
    const { data } = await request.get("/assessment-product/get-moduls?q=staff&page&offset");
    return data.data.data;
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getAssessment(input ?? "", true);
    setassessmentProduct(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === getassessmentProduct?.last_page) {
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
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("modul", data.modul.id);
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      if (modalMode === "create") {
        await request.post("/assessment-product", formData);
      } else {
        await request.post(`/assessment-product/${selected?.id}/update`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Assessment saved!", "success");
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

      // Convert File to FileList
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      setValue("image", dataTransfer.files);
    } else {
      setImagePreview(null);
      setValue("image", null);
    }
  };

  const handleFormEdit = (item: assessmentProductType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue("description", item.description ?? "");
    setValue("modul", item.modul.id ?? "");
    setImagePreview(item.image ?? null);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/assessment-product/${selected?.id}/delete`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Assessment deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getAssessment()]).then((res) => {
      setassessmentProduct(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Assessment Product"
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
          <Table.Th>Name</Table.Th>
          <Table.Th>Modul</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {getassessmentProduct?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {getassessmentProduct?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          getassessmentProduct.per_page *
                          (getassessmentProduct.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.modul?.name ?? "N/A"}</Table.Td>
                      <Table.Td>{item.description ?? ""}</Table.Td>
                      <Table.Td>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="Image"
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          ""
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
        currentPage={getassessmentProduct?.current_page ?? 1}
        totalPage={getassessmentProduct?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Assessmen tProduct" : "Edit Assessmen tProduct"}
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
          <FormSelectAsync
            label="Pilih Modul"
            name="modul"
            control={control}
            loadOption={selectModules}
            optionLabel={(option: moduleType) => `${option.name}`}
            optionValue={(option: moduleType) => `${option.id}`}
            error={errors?.modul}
          />
          <FormInput
            name="description"
            control={control}
            label="Description"
            error={errors?.description}
          />
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-auto object-contain"
                />
              </div>
            )}
            {errors?.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
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
        name={selected?.name ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default AssessmentProduct;

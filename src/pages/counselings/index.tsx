import React, { useEffect, useState } from 'react';
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../components/buttons/add";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { FormInput, FormInputPassword } from "../../components/forms/input";
import {
  FormSelect,
  FormSelectTimezone,
} from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { CounselingType } from "../../types/counselings";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useCounseling } from "../../stores/counselings";

type FormValues = {
  name: string;
  description: string;
  slug: string;
  image: FileList | null;
  notes: string;
};

type ErrorForm = {
  name: [] | null;
  description: [] | null;
  slug: [] | null;
  image: [] | null;
  notes: [] | null;
};

const Counseling = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [randomString, setRandomString] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<CounselingType | null>(null);
  const { setValue, reset, handleSubmit, control, watch } = useForm<FormValues>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const name = watch('name');
  const { setCounselings, GetCounselings } = useCounseling();
  const { setMessage } = useAlert();

  const getCounseling = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/counselings", page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getCounseling(input ?? "", true);
    setCounselings(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetCounselings?.last_page) {
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
      formData.append("slug", data.slug);
      formData.append("notes", data.notes);
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      if (modalMode === "create") {
        await request.post("/counselings/create", formData);
      } else {
        await request.post(`/counselings/${selected?.id}`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Counseling saved!", "success");
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

  const handleFormEdit = (item: CounselingType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue("description", item.description ?? "");
    setValue("slug", item.slug ?? "");
    setImagePreview(item.image ?? null);
    setValue("notes", item.notes ?? "");
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/counselings/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Counseling deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getCounseling()]).then((res) => {
      setCounselings(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

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
      title="Manajemen Counseling"
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
          <Table.Th>Description</Table.Th>
          <Table.Th>Slug</Table.Th>
          <Table.Th>Notes</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetCounselings?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetCounselings?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetCounselings.per_page *
                          (GetCounselings.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? ""}</Table.Td>
                      <Table.Td>{item.description ?? ""}</Table.Td>
                      <Table.Td>{item.slug ?? ""}</Table.Td>
                      <Table.Td>{item.notes ?? ""}</Table.Td>
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
        currentPage={GetCounselings?.current_page ?? 1}
        totalPage={GetCounselings?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Counseling" : "Edit Counseling"}
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
          <FormInput
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
          <FormInput
            name="notes"
            control={control}
            label="Notes"
            error={errors?.notes}
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

export default Counseling;

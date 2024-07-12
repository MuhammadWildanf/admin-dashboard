import { useEffect, useState } from "react";
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
import { CounselingProductType } from "../../types/counselingProduct";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useCounselingProduct } from "../../stores/counselingProduct";

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
  const [selected, setSelected] = useState<CounselingProductType | null>(null);
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { setCounselingProduct, GetcounselingProduct } = useCounselingProduct();
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
    setCounselingProduct(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetcounselingProduct?.last_page) {
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
      let payload = {
        ...data,
      };
      if (modalMode === "create") {
        await request.post("/counselings/create", payload);
      } else {
        await request.post(`/counselings/${selected?.id}`, payload);
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

  const handleFormEdit = (item: CounselingProductType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue("description", item.description);
    setValue("slug", item.slug);
    setValue("with_screening", item.with_screening);
    setValue("with_emergency", item.with_emergency);
    setValue("counseling_id", item.counseling_id);
    setValue("tag", item.tag);
    setValue("default_share_profit", item.default_share_profit);
    setValue("screening_modul_id", item.screening_modul_id);
    setValue("notes", item.notes);
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
      setCounselingProduct(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Counseling Product"
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
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetcounselingProduct?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetcounselingProduct?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetcounselingProduct.per_page *
                          (GetcounselingProduct.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? ""}</Table.Td>
                      <Table.Td>{item.description ?? ""}</Table.Td>
                      <Table.Td>{item.slug ?? ""}</Table.Td>
                      <Table.Td>{item.notes ?? ""}</Table.Td>
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
        currentPage={GetcounselingProduct?.current_page ?? 1}
        totalPage={GetcounselingProduct?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Counseling Product" : "Edit Counseling Product"}
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
            name="image"
            control={control}
            label="Image"
            error={errors?.image}
          />
          <FormInput
            name="with_screening"
            control={control}
            label="with_screening"
            error={errors?.with_screening}
          />
          <FormInput
            name="with_emergency"
            control={control}
            label="with_emergency"
            error={errors?.with_emergency}
          />
          <FormInput
            name="counseling_id"
            control={control}
            label="counseling_id"
            error={errors?.counseling_id}
          />
          <FormInput
            name="tag"
            control={control}
            label="tag"
            error={errors?.tag}
          />
          <FormInput
            name="default_share_profit"
            control={control}
            label="default_share_profit"
            error={errors?.default_share_profit}
          />
          <FormInput
            name="screening_modul_id"
            control={control}
            label="screening_modul_id"
            error={errors?.screening_modul_id}
          />
          <FormInput
            name="notes"
            control={control}
            label="Notes"
            error={errors?.notes}
          />
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

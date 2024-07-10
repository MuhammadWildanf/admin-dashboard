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
  image: string;
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

  const forms = useForm<FormValues>({
    defaultValues: {
    },
  });
  const { setCounselings, GetCounselings } = useCounseling();
  const { setMessage } = useAlert();

  const roles = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Admin", value: "admin" },
    { label: "Finance", value: "finance" },
    { label: "QC", value: "qc" },
  ];

  const getCounseling = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/counselings" , page, search, searchMode);
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

  const handleSave = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
      };
      if (modalMode === "create") {
        await request.post("/counselings/create", payload);
      } else {
        await request.post(`/counselings/${selected?.id}/update`, payload);
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

  const handleFormEdit = (item: CounselingType) => {
    setSelected(item);
    setModalMode("edit");
    forms.setValue("name", item.name ?? "");
    forms.setValue("description", item.description ?? "");
    forms.setValue("slug", item.slug ?? "");
    forms.setValue("image", item.image ?? "");
    forms.setValue("notes", item.notes ?? "");
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/counselings/${selected?.id}/destroy`);
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
          forms.reset();
        }}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Slug</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th>Notes</Table.Th>
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
                      <Table.Td>{item.image ?? ""}</Table.Td>
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
        <FormProvider {...forms}>
          <form>
            <FormInput
              name="name"
              control={forms.control}
              label="Nama"
              error={errors?.name}
            />
            <FormInput
              name="description"
              control={forms.control}
              label="Description"
              error={errors?.description}
            />
            <FormInput
              name="slug"
              control={forms.control}
              label="Slug"
              error={errors?.slug}
            />
            <FormInput
              name="image"
              control={forms.control}
              label="Image"
              error={errors?.image}
            />
            <FormInput
              name="notes"
              control={forms.control}
              label="Notes"
              error={errors?.notes}
            />
            <div className="mt-3 flex items-center justify-end">
              <Button className="px-8" onClick={handleSave}>
                {loadingSubmit ? <Spinner /> : "Simpan"}
              </Button>
            </div>
          </form>
        </FormProvider>
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

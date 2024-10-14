import { useEffect, useState } from "react";
import Layout from "../../layout.tsx/app";
import { getData } from "../../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../../components/buttons/add";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/buttons";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import BaseModal from "../../../components/modal/base";
import Pagination from "../../../components/tables/pagination";
import Table from "../../../components/tables/base";
import { FormInput } from "../../../components/forms/input";
import { SubCategoryType } from "../../../types/subcategory";
import { CategoryType } from "../../../types/category";
import { request } from "../../../api/config";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../../stores/alert";
import moment from "moment";
import { useSubCategories } from "../../../stores/subcategory";

type FormValues = {
  name: string;
  parent_id: CategoryType | null;
};

type ErrorForm = {
  name: [] | null;
  parent_id: [] | null;
};

const UserPsikolog = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<SubCategoryType | null>(null);
  const { setSubCategories, getSubCategories } = useSubCategories();
  const { setMessage } = useAlert();

  const getSubCategory = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/subcategories", page, search, searchMode);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getSubCategory(input ?? "", true);
    setSubCategories(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === getSubCategories?.last_page) {
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
    console.log(data, "requests dari form");
    setLoadingSubmit(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);

      formData.forEach((value, key) => {
        console.log(key + ": " + value);
      });

      if (modalMode === "create") {
        await request.post("/subcategories/create", formData);
      } else {
        await request.put(`/subcategories/${selected?.id}`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Sub Category saved!", "success");
    } catch (err: any) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors); // Update state with errors
      }
      setMessage(err.response.data.message, "error");
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: SubCategoryType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/subcategories/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Sub Category deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getSubCategory()]).then((res) => {
      setSubCategories(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Sub Kategori Artikel"
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
            className={`${loading ? "py-2 px-3" : "p-3"} text-lg rounded-r-lg ${
              loading
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
          <Table.Th>Nama</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {getSubCategories?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {getSubCategories?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          getSubCategories.per_page *
                            (getSubCategories.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? ""}</Table.Td>
                      <Table.Td>
                        <div className="flex items-center justify-center gap-1">
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
        currentPage={getSubCategories?.current_page ?? 1}
        totalPage={getSubCategories?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={
          modalMode === "create" ? "Tambah Sub Kategori" : "Edit Sub Kategori"
        }
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
            <Button className="px-8" onClick={handleSave}>
              {loadingSubmit ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </form>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="Kategori"
        name={selected?.name ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default UserPsikolog;

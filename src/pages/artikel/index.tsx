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
import { ArticleType } from "../../types/articles";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useArticles } from "../../stores/articles";

type FormValues = {
  name: string;
  author: string;
  timezone: SelectOptionType | undefined;
  role: SelectOptionType | undefined;
  password: string;
};

type ErrorForm = {
  name: [] | null;
  email: [] | null;
  timezone: [] | null;
  role: [] | null;
  password: [] | null;
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
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [randomString, setRandomString] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ArticleType | null>(null);

  const forms = useForm<FormValues>({
    defaultValues: {
      timezone: { label: moment.tz.guess(), value: moment.tz.guess() },
    },
  });
  const { setArticles, GetArticles } = useArticles();
  const { setMessage } = useAlert();

  const roles = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Admin", value: "admin" },
    { label: "Finance", value: "finance" },
    { label: "QC", value: "qc" },
  ];

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

  const handleSave = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
        role: data.role?.value ?? "",
        timezone: data.timezone?.value ?? "",
      };
      if (modalMode === "create") {
        await request.post("/artikel/create", payload);
      } else {
        await request.post(`/artikel/${selected?.id}`, payload);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Admin user saved!", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
      console.log(err);
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: ArticleType) => {
    setSelected(item);
    setModalMode("edit");
    forms.setValue("name", item.title ?? "");
    forms.setValue("author", item.author);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/artikel/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("User psikolog deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  const handleResetPassword = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        password: data.password,
      };
      await request.post(
        `/users/psikolog/${selected?.id}/updatePassword`,
        payload
      );
      setSelected(null);
      setModalReset(false);
      setMessage("Password changed!", "success");
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const generateRandomString = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
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
          forms.reset();
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
                      <Table.Td>{item.categories_id ?? ""}</Table.Td>
                      <Table.Td>{item.date ?? ""}</Table.Td>
                      <Table.Td>{item.link ?? ""}</Table.Td>
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
        title={modalMode === "create" ? "Tambah User Admin" : "Edit User Admin"}
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
              name="email"
              control={forms.control}
              label="Email"
              error={errors?.email}
            />
            <>
              {modalMode === "create" && (
                <FormInputPassword
                  name="password"
                  control={forms.control}
                  label="Password"
                  type="password"
                  error={errors?.password}
                />
              )}
            </>
            <FormSelectTimezone
              name="timezone"
              control={forms.control}
              label="Zona Waktu"
              error={errors?.timezone}
            />
            <FormSelect
              name="role"
              control={forms.control}
              label="Role"
              options={roles}
            />
            <div className="mt-3 flex items-center justify-end">
              <Button className="px-8" onClick={handleSave}>
                {loadingSubmit ? <Spinner /> : "Simpan"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </BaseModal>

      <BaseModal
        title={`Reset Password untuk ${selected?.title}`}
        isOpen={modalReset}
        close={() => setModalReset(false)}
      >
        <FormProvider {...forms}>
          <form>
            <FormInput
              name="password"
              control={forms.control}
              label="Password"
              defaultValue={randomString}
              error={errors?.password}
            />
          </form>
        </FormProvider>
        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleResetPassword}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="Nama"
        name={selected?.title ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default UserPsikolog;

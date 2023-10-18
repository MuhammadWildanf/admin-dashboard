import { useEffect, useState } from "react";
import { useUserAdmin } from "../../../stores/users/admins";
import Layout from "../../layout.tsx/app";
import { getData } from "../../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../../components/buttons/add";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/buttons";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import BaseModal from "../../../components/modal/base";
import Pagination from "../../../components/tables/pagination";
import Table from "../../../components/tables/base";
import { FormInput, FormInputPassword } from "../../../components/forms/input";
import {
  FormSelect,
  FormSelectAsync,
  FormSelectTimezone,
} from "../../../components/forms/input-select";
import { SelectOptionType } from "../../../types/form";
import { UserAdminType } from "../../../types/users";
import { request } from "../../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../../stores/alert";

type FormValues = {
  name: string;
  email: string;
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

const UserAdmin = () => {
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
  const [selected, setSelected] = useState<UserAdminType | null>(null);

  const { control, setValue, reset, handleSubmit } = useForm<FormValues>();
  const { setUserAdmins, userAdmins } = useUserAdmin();
  const { setMessage } = useAlert();

  const roles = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Admin", value: "admin" },
    { label: "Finance", value: "finance" },
  ];

  const getUserAdmin = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const data = await getData("/users/admin", page, search, searchMode);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getUserAdmin(input ?? "", true);
    setUserAdmins(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === userAdmins?.last_page) {
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
        role: data.role?.value ?? "",
        timezone: data.timezone?.value ?? "",
      };
      if (modalMode === "create") {
        await request.post("/users/admin/create", payload);
      } else {
        await request.post(`/users/admin/${selected?.id}/update`, payload);
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

  const handleFormEdit = (item: UserAdminType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue(
      "role",
      roles.find((role) => role.value === item.role)
    );
    setValue("email", item.email);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/users/admin/${selected?.id}/destroy`);
      setSelected(null);
      setModalDelete(false);
      setMessage("User deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  const handleResetPassword = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        password: data.password,
      };
      await request.post(
        `/users/admin/${selected?.id}/updatePassword`,
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
    Promise.all([getUserAdmin()]).then((res) => {
      setUserAdmins(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Admin"
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
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Zona waktu</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {userAdmins?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {userAdmins?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          userAdmins.per_page * (userAdmins.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? ""}</Table.Td>
                      <Table.Td>{item.email ?? ""}</Table.Td>
                      <Table.Td>{item.role ?? ""}</Table.Td>
                      <Table.Td>{item.timezone ?? ""}</Table.Td>
                      <Table.Td>
                        {item.is_active ? (
                          <span className="text-xs py-1 px-3 rounded text-green-50 bg-green-600">
                            Aktif
                          </span>
                        ) : (
                          (
                            <span className="text-xs py-1 px-3 rounded text-red-50 bg-red-600">
                              Tidak Aktif
                            </span>
                          ) ?? ""
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
                          <Key
                            className="text-yellow-600 text-xl cursor-pointer"
                            onClick={() => {
                              setSelected(item);
                              setRandomString(generateRandomString(8));
                              setModalReset(true);
                            }}
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
        currentPage={userAdmins?.current_page ?? 1}
        totalPage={userAdmins?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah User Admin" : "Edit User Admin"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <FormInput
          name="name"
          control={control}
          label="Nama"
          error={errors?.name}
        />
        <FormInput
          name="email"
          control={control}
          label="Email"
          error={errors?.email}
        />
        <>
          {modalMode === "create" && (
            <FormInputPassword
              name="password"
              control={control}
              label="Password"
              type="password"
              error={errors?.password}
            />
          )}
        </>
        <FormSelectTimezone
          name="timezone"
          control={control}
          label="Zona Waktu"
          defaultValue={selected?.timezone}
          error={errors?.timezone}
        />
        <FormSelect
          name="role"
          control={control}
          label="Role"
          options={roles}
        />
        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleSave}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <BaseModal
        title={`Reset Password untuk ${selected?.name}`}
        isOpen={modalReset}
        close={() => setModalReset(false)}
      >
        <FormInput
          name="password"
          control={control}
          label="Password"
          defaultValue={randomString}
          error={errors?.password}
        />
        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleResetPassword}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="kode aktivasi"
        name={selected?.name}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default UserAdmin;
import { useEffect, useState } from "react";
// import { useUserAdmin } from "../../../stores/users/admins";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
// import AddButton from "../../components/buttons/add";
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
import { UserPsikologType } from "../../types/users";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useUserPsikolog } from "../../stores/psikolog";

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

const UserPsikolog = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [selected, setSelected] = useState<UserPsikologType | null>(null);

  const forms = useForm<FormValues>({
    defaultValues: {
      timezone: { label: moment.tz.guess(), value: moment.tz.guess() },
    },
  });
  const { setUserPsikologs, userPsikologs } = useUserPsikolog();
  const { setMessage } = useAlert();

  const getUserPsikolog = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData(
        "/psikolog/?type=psikolog",
        page,
        search,
        searchMode
      );
      // console.log('ini data getUserPsikolog ==>>>', data)
      return data;
    } catch {}
  };

  const handleApprove = async (id: string) => {
    setLoading(true); // Mulai loading sebelum proses approve
    try {
      await request.patch(`/psikolog/${id}/approve`);
      const updatedData = await getUserPsikolog();
      setUserPsikologs(updatedData);
      setMessage("Psikolog berhasil diapprove", "success");
    } catch (error) {
      console.error("Error approving psikolog:", error);
      setMessage("Gagal melakukan approve psikolog", "error");
    } finally {
      setLoading(false); // Hentikan loading setelah proses selesai
    }
  };

  const handleUnapprove = async (id: string) => {
    setLoading(true); // Mulai loading sebelum proses unapprove
    try {
      await request.patch(`/psikolog/${id}/unapprove`);
      const updatedData = await getUserPsikolog();
      setUserPsikologs(updatedData);
      setMessage("Psikolog berhasil diunapprove", "success");
    } catch (error) {
      console.error("Error unapproving psikolog:", error);
      setMessage("Gagal melakukan unapprove psikolog", "error");
    } finally {
      setLoading(false); // Hentikan loading setelah proses selesai
    }
  };

  const handleSearch = async (input: string | undefined) => {
    setLoading(true); // Set loading state saat pencarian dimulai
    setQ(input);
    const data = await getUserPsikolog(input ?? "", true);
    console.log(data, "data pencarian");
    setUserPsikologs(data);
    setLoading(false); // Set loading false setelah pencarian selesai
  };

  const handleNext = () => {
    if (page === userPsikologs?.last_page) {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUserPsikolog(q ?? ""); // Pass the search query here to maintain the filtered result on pagination
        setUserPsikologs(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page, loadingSubmit, q]); // Tambahkan `q` sebagai dependensi

  return (
    <Layout
      withPageTitle
      title="Manajemen User Psikolog"
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
              onClick={() => {
                setQ("");
                handleSearch("");
              }}
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
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Nama</Table.Th>
          <Table.Th>Email</Table.Th>
          {/* <Table.Th>Role</Table.Th> */}
          <Table.Th>Zona waktu</Table.Th>
          <Table.Th className="text-center">Status</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {userPsikologs?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {userPsikologs?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          userPsikologs.per_page *
                            (userPsikologs.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.fullname ?? ""}</Table.Td>
                      <Table.Td>{item.email ?? ""}</Table.Td>
                      <Table.Td>{item.timezone ?? ""}</Table.Td>
                      <Table.Td className="text-center">
                        {item.status === "verified" ? (
                          <span className="text-xs py-1 px-3 rounded text-green-50 bg-green-600">
                            Verified
                          </span>
                        ) : item.status === "moderation" ? (
                          <span className="text-xs py-1 px-3 rounded text-white bg-yellow-300">
                            Moderation
                          </span>
                        ) : (
                          ""
                        )}
                      </Table.Td>

                      <Table.Td className="text-center">
                        <div className="flex items-center justify-center   gap-1">
                          {item.status === "verified" ? (
                            <Button
                              onClick={() => handleUnapprove(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            >
                              Unapprove
                            </Button>
                          ) : item.status === "moderation" ? (
                            <Button
                              onClick={() => handleApprove(item.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                            >
                              Approve
                            </Button>
                          ) : (
                            ""
                          )}
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
        currentPage={userPsikologs?.current_page ?? 1}
        totalPage={userPsikologs?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default UserPsikolog;

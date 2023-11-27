import { useEffect, useState } from "react";
import Table from "../../components/tables/base";
import Layout from "../layout.tsx/app";
import { useEmailQueue } from "../../stores/email-queue";
import Pagination from "../../components/tables/pagination";
import { getDataWithParams } from "../../api/get-data";
import { parseDate } from "../../helper/date";
import { Button } from "../../components/buttons";
import { useAlert } from "../../stores/alert";
import { Spinner } from "flowbite-react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { request } from "../../api/config";

const SettingEmail = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const { emailQueue, setEmailQueue } = useEmailQueue();
  const { setMessage } = useAlert();

  const getEmailQueue = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    let params = {
      q: q ?? "",
      page: page ?? 1,
    };
    try {
      const data = await getDataWithParams("/setting/email", params);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setLoadingSubmit(true);
    setQ(input);
    const data = await getEmailQueue(input ?? "", true);
    setEmailQueue(data);
    setLoadingSubmit(false);
  };

  const handleNext = () => {
    if (page === emailQueue?.last_page) {
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

  const handleSendAll = async () => {
    setLoadingSubmit(true);
    try {
      await request.post("/setting/send-all").then(() => {
        setMessage("Berhasil mengirim semua email", "success");
      });
    } catch (err: any) {
      setMessage("Oops, something went wrong", "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getEmailQueue()]).then((res) => {
      setEmailQueue(res[0]);
      console.log(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <>
      <Layout
        withPageTitle
        title="Pengaturan & Log Email"
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
              className={`${
                loading ? "py-2 px-3" : "p-3"
              } text-lg rounded-r-lg ${
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
        <div className="mb-4 flex justify-end">
          <Button className="text-sm px-4" onClick={handleSendAll}>
            {loadingSubmit ? <Spinner /> : "Kirim Semua Email Pending"}
          </Button>
        </div>
        <Table>
          <Table.Thead>
            <Table.Th>#</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Subjek Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Tanggal Terkirim/Gagal</Table.Th>
            {/* <Table.Th>Opsi</Table.Th> */}
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.TrLoading cols={6} rows={5} />
            ) : (
              <>
                {emailQueue?.data.length === 0 ? (
                  <Table.Tr>
                    <Table.Td cols={6} className="text-center py-3">
                      Tidak ada data ditemukan!
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  <>
                    {emailQueue?.data.map((item, key) => (
                      <Table.Tr key={key}>
                        <Table.Td>
                          {(
                            key +
                            1 +
                            emailQueue.per_page * (emailQueue.current_page - 1)
                          ).toString()}
                        </Table.Td>
                        <Table.Td>{item.email}</Table.Td>
                        <Table.Td>{item.subject}</Table.Td>
                        <Table.Td>
                          <>
                            <span
                              className={`p-1 text-xs uppercase text-white rounded-lg ${
                                item.status === "gagal" && "bg-red-600"
                              } ${
                                item.status === "terkirim" && "bg-green-600"
                              } ${item.status === "pending" && "bg-gray-600"}`}
                            >
                              {item.status}
                            </span>
                          </>
                        </Table.Td>
                        <Table.Td>
                          <>
                            {item.status_date
                              ? parseDate(item.status_date)
                              : "-"}
                          </>
                        </Table.Td>
                        {/* <Table.Td>
                          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700">
                            Kirim ulang
                          </button>
                        </Table.Td> */}
                      </Table.Tr>
                    ))}
                  </>
                )}
              </>
            )}
          </Table.Tbody>
        </Table>
        <Pagination
          currentPage={emailQueue?.current_page ?? 1}
          totalPage={emailQueue?.last_page ?? 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </Layout>
    </>
  );
};

export default SettingEmail;

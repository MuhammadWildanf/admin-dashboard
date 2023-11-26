import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { useActivationCode } from "../../stores/activation-code";
import { getDataWithParams } from "../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import Table from "../../components/tables/base";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/tables/pagination";

const IndexReport = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { activationCodes, setActivationCode } = useActivationCode();

  const navigate = useNavigate();

  const getActivationCode = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    let params = {
      q: q ?? "",
      page: page ?? 1,
      is_finished: 1,
    };
    try {
      const data = await getDataWithParams("/activation-code", params);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getActivationCode(input ?? "", true);
    setActivationCode(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === activationCodes?.last_page) {
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
    Promise.all([getActivationCode()]).then((res) => {
      setActivationCode(res[0]);
      setLoading(false);
    });
  }, [page]);

  return (
    <Layout
      withPageTitle
      title="Laporan Psikolog"
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
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Kode Aktivasi</Table.Th>
          <Table.Th>Modul</Table.Th>
          <Table.Th>Peserta</Table.Th>
          <Table.Th>Status Laporan</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={5} />
          ) : (
            <>
              {activationCodes?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={5} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {activationCodes?.data.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className={`cursor-pointer hover:bg-gray-100 ${
                        item.report_status === "disetujui" && "bg-green-50"
                      }`}
                      onClick={() => navigate(`/report/${item.code}`)}
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          activationCodes.per_page *
                            (activationCodes.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-1">
                          <span>{item.code}</span>
                        </div>
                      </Table.Td>
                      <Table.Td>{item.module_name ?? "-"}</Table.Td>
                      <Table.Td>{item.participant ?? "-"}</Table.Td>
                      <Table.Td>
                        <span
                          className={`uppercase ${
                            item.report_status ===
                              "laporan belum diverifikasi" && "text-yellow-400"
                          } ${
                            item.report_status === "disetujui" &&
                            "text-green-600"
                          } ${
                            item.report_status === "belum ada laporan" &&
                            "text-gray-800"
                          } ${
                            item.report_status === "perlu direvisi" &&
                            "text-red-700"
                          } ${
                            item.report_status === "sudah direvisi" &&
                            "text-blue-800"
                          } p-1 rounded text-xs inline-block uppercase`}
                        >
                          {item.report_status}
                        </span>
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
        currentPage={activationCodes?.current_page ?? 1}
        totalPage={activationCodes?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default IndexReport;

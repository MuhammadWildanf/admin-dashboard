import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import Table from "../../components/tables/base";
import Pagination from "../../components/tables/pagination";
import moment from "moment-timezone";
import { useAsesmen } from "../../stores/asesmen";
import { currency } from "../../helper/currency";
import { request } from "../../api/config";
import { useNavigate } from "react-router-dom";

const AllAsesmen = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const { asesmens, setAsesmens } = useAsesmen();
  const navigate = useNavigate();

  const getAsesmens = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await request.get("/asesmen", {
        params: {
          q: search ?? "",
          page: searchMode ? 1 : page ?? 1,
          with_paginate: 1,
        },
      });
      return data.data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getAsesmens(input ?? "", true);
    setAsesmens(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === asesmens?.last_page) {
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
    Promise.all([getAsesmens()]).then((res) => {
      setAsesmens(res[0]);
    });
    setLoading(false);
  }, [page]);

  return (
    <Layout
      withPageTitle
      title="Assessment Center"
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
      <div className="flex mb-4 items-center text-sm gap-1">
        <div
          onClick={() => navigate("/asesmen")}
          className="px-6 cursor-pointer rounded-lg py-2 hover:bg-blue-100"
        >
          Weekly Mode
        </div>
        <div
          onClick={() => navigate("/asesmen/pending")}
          className="px-6 cursor-pointer rounded-lg py-2 hover:bg-blue-100"
        >
          Pending
        </div>
        <div className="px-6 bg-blue-100 rounded-lg py-2 font-semibold cursor-pointer hover:text-gray-800">
          All
        </div>
      </div>
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Reg. ID</Table.Th>
          <Table.Th>Tanggal Tes</Table.Th>
          <Table.Th>Client</Table.Th>
          <Table.Th>Perusahaan</Table.Th>
          <Table.Th className="text-center">Jml. Peserta</Table.Th>
          <Table.Th className="text-right">Total Harga</Table.Th>
          <Table.Th className="text-center">Status</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={8} rows={5} />
          ) : (
            <>
              {asesmens?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {asesmens?.data.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => navigate(`/asesmen/${item.reg_id}`)}
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          asesmens.per_page * (asesmens.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.reg_id}</Table.Td>
                      <Table.Td>
                        {item.test_date
                          ? moment(item.test_date).format("DD MMM YYYY")
                          : "-"}
                      </Table.Td>
                      <Table.Td>{item.client?.name}</Table.Td>
                      <Table.Td>{item.company?.name}</Table.Td>
                      <Table.Td className="text-center">
                        <>{item.number_participant}</>
                      </Table.Td>
                      <Table.Td className="text-right">
                        <>
                          {item.total_price ? currency(item.total_price) : null}
                        </>
                      </Table.Td>
                      <Table.Td className="text-center">
                        <span
                          className={`text-xs capitalize text-white py-1 px-3 rounded text-center ${
                            item.status === "draft" && "bg-gray-400"
                          } ${
                            item.status === "pending approval" && "bg-blue-600"
                          } ${item.status === "approved" && "bg-green-600"}`}
                        >
                          {item.status}
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
        currentPage={asesmens?.current_page ?? 1}
        totalPage={asesmens?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default AllAsesmen;

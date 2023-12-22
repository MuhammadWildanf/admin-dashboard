import { useEffect, useState } from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { request } from "../../../api/config";
import Layout from "../../layout.tsx/app";
import Table from "../../../components/tables/base";
import Pagination from "../../../components/tables/pagination";
import { useCompany } from "../../../stores/partner/company";

const CompanyPage = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const { companies, setCompanies } = useCompany();

  const getAsesmens = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await request.get("/company", {
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
    setCompanies(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === companies?.last_page) {
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
      setCompanies(res[0]);
    });
    setLoading(false);
  }, [page]);

  return (
    <Layout
      withPageTitle
      title="List Perusahaan"
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
      <div className="flex mb-4 items-center gap-1 text-sm">
        <div className="px-6 bg-blue-100 rounded-lg py-2 font-semibold cursor-pointer hover:text-gray-800">
          Semua
        </div>
        <div
          onClick={() => navigate("/company/pending")}
          className="px-6 cursor-pointer rounded-lg py-2 hover:bg-blue-100"
        >
          Pending
        </div>
      </div>
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Nama Perusahaan</Table.Th>
          <Table.Th>Didaftarkan oleh</Table.Th>
          <Table.Th>Tgl. Registrasi</Table.Th>
          <Table.Th>Tgl. Verifikasi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={5} />
          ) : (
            <>
              {companies?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={5} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {companies?.data.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className={`cursor-pointer  ${
                        !item.approved_at
                          ? "bg-red-50 hover:bg-red-100"
                          : "hover:bg-blue-50"
                      }`}
                      onClick={() => navigate(`/company/${item.id}`)}
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          companies.per_page * (companies.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.registered_by?.name ?? "-"}</Table.Td>
                      <Table.Td>
                        {item.created_at
                          ? moment(item.created_at).format("DD MMM YYYY, HH:ss")
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.approved_at
                          ? moment(item.approved_at).format(
                              "DD MMM YYYY, HH:ss"
                            )
                          : "Belum diverifikasi"}
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
        currentPage={companies?.current_page ?? 1}
        totalPage={companies?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default CompanyPage;

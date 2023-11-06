import { useEffect, useState } from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import { request } from "../../../api/config";
import Layout from "../../layout.tsx/app";
import Table from "../../../components/tables/base";
import Pagination from "../../../components/tables/pagination";
import { useClient } from "../../../stores/partner/client";

const ClientPage = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const { clients, setClients } = useClient();

  const getAsesmens = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await request.get("/client", {
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
    setClients(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === clients?.last_page) {
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
      setClients(res[0]);
    });
    setLoading(false);
  }, [page]);

  return (
    <Layout
      withPageTitle
      title="List Klien"
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
          <Table.Th>NIK</Table.Th>
          <Table.Th>Nama Klien</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Perusahaan</Table.Th>
          <Table.Th>Tgl. Registrasi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={5} />
          ) : (
            <>
              {clients?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={5} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {clients?.data.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className={`cursor-pointer `}
                      // onClick={() => navigate(`/partner/client/${item}`)}
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          clients.per_page * (clients.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.nik}</Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.email}</Table.Td>
                      <Table.Td>{item.phone}</Table.Td>
                      <Table.Td>{item.default_company?.name}</Table.Td>
                      <Table.Td>
                        {item.created_at
                          ? moment(item.created_at).format("DD MMM YYYY, HH:ss")
                          : "-"}
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
        currentPage={clients?.current_page ?? 1}
        totalPage={clients?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default ClientPage;

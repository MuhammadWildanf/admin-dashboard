import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../components/buttons/add";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { WebinarType } from "../../types/webinar";
import { request } from "../../api/config";
import {  Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import { useNavigate } from "react-router-dom";
import { useWebinar } from "../../stores/webinar";

const Webinar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<WebinarType | null>(null);
  const { setWebinars, webinars } = useWebinar();
  const { setMessage } = useAlert();
  const navigate = useNavigate();



  const getWebinar = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/webinar", page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getWebinar(input ?? "", true);
    setWebinars(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === webinars?.last_page) {
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

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/webinar/${selected?.id}/destroy`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Webinar deleted", "success");
    } catch (err: any) {
      setMessage(err.response.data.errors , "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getWebinar()]).then((res) => {
      setWebinars(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Webinar"
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
        onClick={() => navigate('create')}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Limit Peserta</Table.Th>
          <Table.Th>Author</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Media Layanan</Table.Th>
          <Table.Th>Harga Sertifikat</Table.Th>
          <Table.Th>Link</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {webinars?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {webinars?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          webinars.per_page *
                          (webinars.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.title ?? ""}</Table.Td>
                      <Table.Td>{item.limit_peserta?.toString() ?? ""}</Table.Td>
                      <Table.Td>{item.author ?? ""}</Table.Td>
                      <Table.Td>{item.date ?? ""}</Table.Td>
                      <Table.Td>{item.media_layanan ?? ""}</Table.Td>
                      <Table.Td>{item.harga_sertifikat ?? ""}</Table.Td>
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
                            onClick={() => navigate(`${item.id}`)}
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
        currentPage={webinars?.current_page ?? 1}
        totalPage={webinars?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        name={selected?.title ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default Webinar;

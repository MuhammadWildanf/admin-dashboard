import { useEffect, useState } from "react";
import Layout from "../../layout.tsx/app";
import { getData } from "../../../api/get-data";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../../components/buttons/add";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../components/buttons";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import Pagination from "../../../components/tables/pagination";
import Table from "../../../components/tables/base";
import { CounselingProductType } from "../../../types/counselingProduct";
import { request } from "../../../api/config";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../../stores/alert";
import moment from "moment";
import { useCounselingProduct } from "../../../stores/counselingProduct";

const Counseling = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<CounselingProductType | null>(null);
  const { setCounselingProduct, GetcounselingProduct } = useCounselingProduct();
  const navigate = useNavigate();
  const { setMessage } = useAlert();

  const getCounseling = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData(
        "/counseling-products",
        page,
        search,
        searchMode
      );
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getCounseling(input ?? "", true);
    setCounselingProduct(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetcounselingProduct?.last_page) {
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
      await request.delete(`/counseling-products/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Counseling Product deleted", "success");
    } catch (err: any) {
      setMessage(err.response.data.errors, "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getCounseling()]).then((res) => {
      setCounselingProduct(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Counseling Product Management"
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
      <AddButton onClick={() => navigate("create")} />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Slug</Table.Th>
          <Table.Th>Notes</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetcounselingProduct?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetcounselingProduct?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetcounselingProduct.per_page *
                            (GetcounselingProduct.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? ""}</Table.Td>
                      <Table.Td>{item.description ?? ""}</Table.Td>
                      <Table.Td>{item.slug ?? ""}</Table.Td>
                      <Table.Td>{item.notes ?? ""}</Table.Td>
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
        currentPage={GetcounselingProduct?.current_page ?? 1}
        totalPage={GetcounselingProduct?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        name={selected?.name ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default Counseling;

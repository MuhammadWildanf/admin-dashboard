import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import AddButton from "../../components/buttons/add";
import { VoucherType } from "../../types/vouchers";
import { request } from "../../api/config";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useVoucher } from "../../stores/voucher";

const IndexVoucher = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<VoucherType | null>(null);
  const { setVouchers, getVouchers } = useVoucher();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const getAllVoucher = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/voucher", page, search, searchMode);
      console.log("ini data getAllVoucher ==>>>", data);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getAllVoucher(input ?? "", true);
    setVouchers(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === getVouchers?.last_page) {
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
      await request.delete(`/voucher/delete/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Voucher deleted", "success");
    } catch (err: any) {
      setMessage(err.response.data.errors, "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getAllVoucher()]).then((res) => {
      setVouchers(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Voucher Management"
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
      <AddButton onClick={() => navigate("/voucher/create")} />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Code</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Amount</Table.Th>
          <Table.Th>Expiry Date</Table.Th>
          <Table.Th>User Type</Table.Th>
          <Table.Th className="text-center">for</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {getVouchers?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {getVouchers?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          getVouchers.per_page * (getVouchers.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.code || "Belum ada kode"}</Table.Td>
                      <Table.Td>{item.description}</Table.Td>
                      <Table.Td>{item.amount}</Table.Td>
                      <Table.Td>
                        {moment(item.expiry_date).format("DD-MM-YYYY")}
                      </Table.Td>
                      <Table.Td>{item.user_type}</Table.Td>
                      <Table.Td className="text-center">{item.for}</Table.Td>
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
                            onClick={() => navigate(`/voucher/${item.id}`)}
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
        currentPage={getVouchers?.current_page ?? 1}
        totalPage={getVouchers?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="Kode"
        name={selected?.code ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default IndexVoucher;

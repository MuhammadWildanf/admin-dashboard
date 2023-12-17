import { DateRangeForm } from "../../components/forms/input-daterange";
import Layout from "../layout.tsx/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { HiSearch } from "react-icons/hi";
import { Button } from "../../components/buttons";
import { request } from "../../api/config";
import { usePsikologFee } from "../../stores/psikolog-fee";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import { parseDate } from "../../helper/date";
import Pagination from "../../components/tables/pagination";
import BaseModal from "../../components/modal/base";
import { PsikologFeeType } from "../../types/psikolog-fee";
import { Eye, Trash } from "@phosphor-icons/react";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import { FormSelectAsync } from "../../components/forms/input-select";
import { PsikologType } from "../../types/psikolog";

type FormFilterDate = {
  start_at: Date;
  end_at: Date;
};

type FormFilterPsikolog = {
  psikolog_ids: string[];
};

const PsikologFeeHistory = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [deleteConfirm, setDeletConfirm] = useState<boolean>(false);
  const [selected, setSelected] = useState<PsikologFeeType | undefined>(
    undefined
  );

  const { psikologFees, setPsikologFees } = usePsikologFee();

  const formFilterDate = useForm<FormFilterDate>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const formFilterPsikolog = useForm<FormFilterPsikolog>();

  const handleNext = () => {
    if (page === psikologFees?.last_page) {
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

  const getHistory = async (
    startAt?: string,
    endAt?: string,
    psikologIds?: string[]
  ) => {
    setLoading(true);
    try {
      const { data } = await request.get(`psikolog-fee/history`, {
        params: {
          page: page,
          start_at:
            startAt ??
            new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
          end_at: endAt ?? new Date(moment().format("YYYY-MM-DD")),
          psikolog_ids: psikologIds,
        },
      });
      return data;
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.post(`/psikolog-fee/${selected?.id}/destroy`);
      setSelected(undefined);
      setDeletConfirm(false);
    } catch (err) {}
    setLoadingSubmit(false);
  };

  const handleFilter = formFilterDate.handleSubmit(async (data) => {
    setLoading(true);
    const res = await getHistory(
      moment(data.start_at).format("YYYY-MM-DD"),
      moment(data.end_at).format("YYYY-MM-DD")
    );
    setPsikologFees(res.data);
    setTotal(res.total);
    setLoading(false);
  });

  const handleFilterPsikolog = formFilterPsikolog.handleSubmit(async (data) => {
    setLoading(true);
    setPage(0);
    const res = await getHistory(
      moment(formFilterDate.watch("start_at") ?? new Date()).format(
        "YYYY-MM-DD"
      ),
      moment(formFilterDate.watch("end_at") ?? new Date()).format("YYYY-MM-DD"),
      data.psikolog_ids?.map((item: any) => item.id)
    );
    setPsikologFees(res.data);
    setTotal(res.total);
    setLoading(false);
  });

  const selectPsikolog = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/select/psikolog", {
      params: params,
    });
    return data.data?.data;
  };

  useEffect(() => {
    Promise.all([getHistory()]).then((res) => {
      setPsikologFees(res[0].data);
      setTotal(res[0].total);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <>
      <Layout
        withPageTitle
        title={<div className="leading-none">Riwayat Pembayaran Psikolog</div>}
        pageTitleContent={
          <div className="flex items-center w-full gap-2">
            <div className="flex items-center gap-1">
              <DateRangeForm
                label=""
                control={formFilterDate.control}
                defaultValueStartAt={moment().subtract(1, "month")}
                defaultValueEndAt={moment()}
                name_start_at="start_at"
                name_end_at="end_at"
                maxDate={new Date()}
              />
              <Button className="mb-3 py-3 px-3" onClick={handleFilter}>
                <HiSearch size={16} />
              </Button>
            </div>
          </div>
        }
      >
        <div className="w-full">
          <div className="w-full items-end flex mb-3 gap-2">
            <div className="py-3 px-4 rounded-lg bg-purple-100 w-96">
              <div className="leading-5">
                <span className="font-semibold">Total Pembayaran</span> <br />
                <small>
                  Periode:{" "}
                  {formFilterDate.watch("start_at")
                    ? moment(formFilterDate.watch("start_at")).format(
                        "DD MMM YYYY"
                      )
                    : moment().subtract(1, "month").format("YYYY-MM-DD")}{" "}
                  -{" "}
                  {formFilterDate.watch("end_at")
                    ? moment(formFilterDate.watch("end_at")).format(
                        "DD MMM YYYY"
                      )
                    : moment().subtract(1, "month").format("YYYY-MM-DD")}{" "}
                </small>
              </div>
              <h3 className="text-2xl">{currency(total)}</h3>
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <FormSelectAsync
                  className="w-full"
                  control={formFilterPsikolog.control}
                  name="psikolog_ids"
                  multiple={true}
                  loadOption={selectPsikolog}
                  optionLabel={(option: PsikologType) => `${option.fullname}`}
                  optionValue={(option: PsikologType) => `${option.id}`}
                  label=""
                />
              </div>
              <Button className="mb-3 py-3 px-3" onClick={handleFilterPsikolog}>
                <HiSearch size={16} />
              </Button>
            </div>
          </div>
          <Table>
            <Table.Thead>
              <Table.Th>No</Table.Th>
              <Table.Th>Nama Psikolog</Table.Th>
              <Table.Th>Tgl Pembayaran</Table.Th>
              <Table.Th className="text-right">Jumlah Pembayaran</Table.Th>
              {/* <Table.Th>Bukti Transaksi</Table.Th> */}
              <Table.Th>Opsi</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.TrLoading cols={6} rows={4} />
              ) : (
                <>
                  {psikologFees?.data?.length === 0 ? (
                    <Table.Tr>
                      <Table.Td cols={7} className="py-2 text-center">
                        Tidak ada data
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    <>
                      {psikologFees?.data?.map((item, key) => (
                        <Table.Tr key={key}>
                          <Table.Td>
                            {(
                              key +
                              1 +
                              psikologFees.per_page *
                                (psikologFees.current_page - 1)
                            ).toString()}
                          </Table.Td>
                          <Table.Td>{item.psikolog.name}</Table.Td>
                          <Table.Td>
                            <>
                              {item.created_at
                                ? parseDate(item.created_at)
                                : "-"}
                            </>
                          </Table.Td>
                          <Table.Td className="text-right">
                            {item.amount ? currency(item.amount) : "0"}
                          </Table.Td>
                          {/* <Table.Td>belum ada</Table.Td> */}
                          <Table.Td>
                            <div className="flex items-center gap-2">
                              <Eye
                                onClick={() => {
                                  setShow(true);
                                  setSelected(item);
                                }}
                                size={18}
                                className="text-blue-700 hover:text-blue-800 cursor-pointer"
                              />
                              <Trash
                                onClick={() => {
                                  setDeletConfirm(true);
                                  setSelected(item);
                                }}
                                size={18}
                                className="text-red-700 hover:text-red-800 cursor-pointer"
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
            currentPage={psikologFees?.current_page ?? 1}
            totalPage={psikologFees?.last_page ?? 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        <BaseModal
          isOpen={show}
          close={() => setShow(false)}
          size="2xl"
          title={`Detail Pembayaran Psikolog #${selected?.payment_code}`}
        >
          <div className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              <div>Nama Psikolog</div>
              <div className="col-span-2">: {selected?.psikolog.name}</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>Tanggal Pembayaran</div>
              <div className="col-span-2">
                : {selected?.created_at ? parseDate(selected?.created_at) : "-"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>Jumlah Pembayaran</div>
              <div className="col-span-2">
                : {selected?.amount ? currency(selected?.amount) : "-"}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <strong>Rincian</strong>
            <Table className="mt-3">
              <Table.Thead>
                <Table.Th>#</Table.Th>
                <Table.Th>Kode Aktivasi</Table.Th>
                <Table.Th className="text-right">Nominal</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                <>
                  {selected?.details?.map((item, key) => (
                    <Table.Tr>
                      <Table.Td>
                        <>{key + 1}</>
                      </Table.Td>
                      <Table.Td>{item.activation_code}</Table.Td>
                      <Table.Td className="text-right">
                        {item.amount ? currency(item.amount) : "0"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
                <Table.Tr className="bg-gray-100">
                  <Table.Td cols={2}>
                    <span className="font-bold">Total</span>
                  </Table.Td>
                  <Table.Td className="text-right">
                    <span className="font-bold">
                      {selected?.amount ? currency(selected?.amount) : "0"}
                    </span>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </BaseModal>

        <ModalDeleteConfirmation
          isOpen={deleteConfirm}
          close={() => setDeletConfirm(false)}
          action={handleDelete}
          loading={loadingSubmit}
          subTitle={`Pembayaran Psikolog ${selected?.payment_code} An. ${selected?.psikolog.name}`}
        />
      </Layout>
    </>
  );
};

export default PsikologFeeHistory;

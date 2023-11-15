import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { request } from "../../api/config";
import { DateRangeForm } from "../../components/forms/input-daterange";
import moment from "moment";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import { Button } from "../../components/buttons";
import { HiOutlineDownload, HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { parseDate } from "../../helper/date";
import { useTax } from "../../stores/tax";
import Pagination from "../../components/tables/pagination";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const JournalTax = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFilter, setLoadingFilter] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<number | undefined>(undefined);

  const { setJournalTaxes, journalTaxes, taxes, setTaxes } = useTax();

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getInvoices = async (
    start_at?: string,
    end_at?: string,
    taxId?: number
  ) => {
    setLoading(true);
    try {
      const { data } = await request.get("/journal/taxes", {
        params: {
          start_at:
            start_at ?? moment().subtract(1, "month").format("YYYY-MM-DD"),
          end_at: end_at ?? moment().format("YYYY-MM-DD"),
          tax_id: taxId ?? null,
        },
      });
      return data;
    } catch {}
  };

  const getTaxes = async () => {
    try {
      const { data } = await request.get("/tax");
      return data.data;
    } catch {}
  };

  const handleFilter = handleSubmit(async (data) => {
    setLoading(true);
    const res = await getInvoices(
      moment(data.start_at).format("YYYY-MM-DD"),
      moment(data.end_at).format("YYYY-MM-DD"),
      selected
    );
    setJournalTaxes(res.data);
    setTotal(res.total);
    setLoading(false);
  });

  const handleSelectTax = async (taxId: number | undefined) => {
    setLoading(true);
    setSelected(taxId);
    const res = await getInvoices(
      moment(watch("start_at")).format("YYYY-MM-DD"),
      moment(watch("end_at")).format("YYYY-MM-DD"),
      taxId
    );
    setJournalTaxes(res.data);
    setTotal(res.total);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === journalTaxes?.last_page) {
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
    Promise.all([getInvoices(), getTaxes()]).then((res) => {
      setJournalTaxes(res[0].data);
      setTotal(res[0].total);
      setTaxes(res[1]);
    });
    setLoading(false);
  }, [loadingFilter]);

  return (
    <Layout
      withPageTitle
      title={<div className="leading-none">Jurnal Pajak</div>}
      pageTitleContent={
        <div className="flex items-center gap-1">
          <DateRangeForm
            label=""
            control={control}
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
      }
    >
      <div className="pb-3 flex items-center justify-between -mt-4">
        <div className="flex items-end gap-4">
          <div className="py-3 px-4 rounded-lg bg-red-50">
            <div className="leading-5">
              <span className="font-semibold">Total Pemasukkan</span> <br />
              <small>
                Periode:{" "}
                {watch("start_at")
                  ? moment(watch("start_at")).format("DD MMM YYYY")
                  : moment().subtract(1, "month").format("YYYY-MM-DD")}{" "}
                -{" "}
                {watch("end_at")
                  ? moment(watch("end_at")).format("DD MMM YYYY")
                  : moment().subtract(1, "month").format("YYYY-MM-DD")}{" "}
              </small>
            </div>
            <h3 className="text-2xl">{currency(total)}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className={`${
                selected === undefined
                  ? "bg-purple-200 border hover:bg-purple-200 border-purple-600"
                  : "bg-white border hover:bg-purple-200 border-purple-600"
              } text-sm`}
              onClick={() => handleSelectTax(undefined)}
            >
              <span className="text-purple-600">Semua</span>
            </Button>
            {taxes?.data?.map((item, key) => (
              <Button
                key={key}
                className={`${
                  selected === item.id
                    ? "bg-purple-200 border hover:bg-gray-200 border-purple-600"
                    : "bg-white border hover:bg-purple-200 border-purple-600"
                } text-sm`}
                onClick={() => handleSelectTax(item.id)}
              >
                <span className="text-purple-600">{item.name}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="">
          <Button className="bg-green-600">
            <div className="flex gap-2 items-center px-3">
              <HiOutlineDownload /> Export Excel
            </div>
          </Button>
        </div>
      </div>
      <Table>
        <Table.Thead>
          <Table.Th>No.</Table.Th>
          <Table.Th>Tanggal</Table.Th>
          <Table.Th>No. Invoice</Table.Th>
          <Table.Th>Klien/Perusahaan</Table.Th>
          <Table.Th>Jenis Pajak</Table.Th>
          <Table.Th className="text-right">Total Pajak</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={4} />
          ) : (
            <>
              {journalTaxes?.data?.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={7} className="py-2 text-center">
                    Tidak ada data
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {journalTaxes?.data?.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          journalTaxes.per_page *
                            (journalTaxes.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>
                        <>
                          {item.created_at ? parseDate(item.created_at) : "-"}
                        </>
                      </Table.Td>
                      <Table.Td>
                        <>{item.invoice?.invoice_number ?? "-"}</>
                      </Table.Td>
                      <Table.Td>
                        <>{item.invoice?.company?.name ?? "-"}</>
                      </Table.Td>
                      <Table.Td>{item.tax.name ?? "-"}</Table.Td>
                      <Table.Td className="text-right">
                        {item.amount ? currency(item.amount) : "-"}
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
        currentPage={journalTaxes?.current_page ?? 1}
        totalPage={journalTaxes?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default JournalTax;

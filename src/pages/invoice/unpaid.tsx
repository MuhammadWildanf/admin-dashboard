import { useEffect, useState } from "react";
import { useInvoice } from "../../stores/invoice";
import Layout from "../layout.tsx/app";
import { request } from "../../api/config";
import { DateRangeForm } from "../../components/forms/input-daterange";
import moment from "moment";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import { Button } from "../../components/buttons";
import { HiOutlineDownload, HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { parseDate } from "../../helper/date";
import Pagination from "../../components/tables/pagination";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const InvoiceUnpaid = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const { setInvoices, invoices } = useInvoice();

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getInvoices = async (start_at?: string, end_at?: string) => {
    setLoading(true);
    try {
      const { data } = await request.get("/invoice", {
        params: {
          start_at:
            start_at ?? moment().subtract(1, "month").format("YYYY-MM-DD"),
          end_at: end_at ?? moment().format("YYYY-MM-DD"),
          status: "UNPAID",
        },
      });
      return data;
    } catch {}
  };

  const handleFilter = handleSubmit(async (data) => {
    setLoading(true);
    const res = await getInvoices(
      moment(data.start_at).format("YYYY-MM-DD"),
      moment(data.end_at).format("YYYY-MM-DD")
    );
    setInvoices(res.data);
    setTotal(res.total);
    setLoading(false);
  });

  const handleNext = () => {
    if (page === invoices?.last_page) {
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
    Promise.all([getInvoices()]).then((res) => {
      setInvoices(res[0].data);
      setTotal(res[0].total);
    });
    setLoading(false);
  }, []);

  return (
    <Layout
      withPageTitle
      title={
        <div className="leading-none">Invoice dan tagihan belum dibayar</div>
      }
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
        <div className="py-3 px-4 rounded-lg bg-red-50">
          <div className="leading-5">
            <span className="font-semibold">Total tagihan belum dibayar</span>{" "}
            <br />
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
          <Table.Th>No. Invoice</Table.Th>
          <Table.Th>Tgl. Invoice</Table.Th>
          <Table.Th>Due Date</Table.Th>
          <Table.Th>Klien/Perusahaan</Table.Th>
          <Table.Th>Grand Total</Table.Th>
          <Table.Th className="text-center">Status</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={4} />
          ) : (
            <>
              {invoices?.data?.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={7} className="py-2 text-center">
                    Tidak ada data
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {invoices?.data?.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        navigate(`/invoice/${item.invoice_number}`)
                      }
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          invoices.per_page * (invoices.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.invoice_number}</Table.Td>
                      <Table.Td>
                        <>
                          {item.created_at ? parseDate(item.created_at) : "-"}
                        </>
                      </Table.Td>
                      <Table.Td>
                        <>{item.due_date ? parseDate(item.due_date) : "-"}</>
                      </Table.Td>
                      <Table.Td>
                        <>
                          {item.payer_name}{" "}
                          {item.payer_company && `/ ${item.payer_company}`}
                        </>
                      </Table.Td>
                      <Table.Td>
                        {item.grand_total ? currency(item.grand_total) : "-"}
                      </Table.Td>
                      <Table.Td className="text-center">
                        <span
                          className={`p-1 text-xs rounded ${
                            item.status === "UNPAID" &&
                            "bg-red-100 text-red-600"
                          } ${
                            item.status === "PAID" &&
                            "bg-green-100 text-green-600"
                          }`}
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
        currentPage={invoices?.current_page ?? 1}
        totalPage={invoices?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Layout>
  );
};

export default InvoiceUnpaid;

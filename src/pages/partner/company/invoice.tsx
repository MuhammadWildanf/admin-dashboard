import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { useNavigate, useParams } from "react-router-dom";
import { request } from "../../../api/config";
import Layout from "../../layout.tsx/app";
import { useCompany } from "../../../stores/partner/company";
import { Button } from "../../../components/buttons";
import BaseModal from "../../../components/modal/base";
import { Spinner } from "flowbite-react";
import { useAlert } from "../../../stores/alert";
import { parseDate } from "../../../helper/date";
import Table from "../../../components/tables/base";
import { DateRangeForm } from "../../../components/forms/input-daterange";
import { useInvoice } from "../../../stores/invoice";
import { useForm } from "react-hook-form";
import { HiSearch } from "react-icons/hi";
import { currency } from "../../../helper/currency";
import AddButton from "../../../components/buttons/add";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const CompanyInvoice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [modalApprove, setModalApprove] = useState<boolean>(false);

  const { company, setCompany } = useCompany();
  const { companyId } = useParams();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const { setInvoices, invoices } = useInvoice();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getCompany = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await request.get(`/company/${companyId}`);
      return data.data;
    } catch {}
  };

  const getInvoices = async (start_at?: string, end_at?: string) => {
    setLoading(true);
    try {
      const { data } = await request.get("/invoice", {
        params: {
          start_at:
            start_at ?? moment().subtract(1, "month").format("YYYY-MM-DD"),
          end_at: end_at ?? moment().format("YYYY-MM-DD"),
          company_id: companyId,
        },
      });
      return data.data;
    } catch {}
  };

  const handleFilter = handleSubmit(async (data) => {
    setLoading(true);
    const res = await getInvoices(
      moment(data.start_at).format("YYYY-MM-DD"),
      moment(data.end_at).format("YYYY-MM-DD")
    );
    setInvoices(res);
    setLoading(false);
  });

  useEffect(() => {
    Promise.all([getCompany(), getInvoices()]).then((res) => {
      setCompany(res[0]);
      setInvoices(res[1]);
    });
    setLoading(false);
  }, [loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title={
        <div className="leading-6">
          <small className="text-base font-light">Invoice dan Tagihan</small>{" "}
          <br /> <span>{company?.name}</span>
        </div>
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
      <AddButton
        onClick={() => navigate(`/company/${companyId}/add-invoice`)}
      />
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
              {invoices?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={7} className="py-2 text-center">
                    Tidak ada data
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {invoices?.data.map((item, key) => (
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
    </Layout>
  );
};

export default CompanyInvoice;

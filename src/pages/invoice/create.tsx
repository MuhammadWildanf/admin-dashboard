import { useEffect, useState } from "react";
import { useInvoice } from "../../stores/invoice";
import Layout from "../layout.tsx/app";
import { request } from "../../api/config";
import { DateRangeForm } from "../../components/forms/input-daterange";
import moment from "moment";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import { Button } from "../../components/buttons";
import { HiArrowRight, HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const CreateInvoice = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { sellings, setSellings } = useInvoice();

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getSellings = async (startAt?: string, endAt?: string) => {
    console.log(startAt, endAt);
    try {
      const { data } = await request.get("/invoice/get-selling", {
        params: {
          start_at:
            startAt ?? moment().subtract(1, "month").format("YYYY-MM-DD"),
          end_at: endAt ?? moment().format("YYYY-MM-DD"),
        },
      });
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleFilter = handleSubmit(async (data) => {
    setLoading(true);
    const res = await getSellings(
      moment(data.start_at).format("YYYY-MM-DD"),
      moment(data.end_at).format("YYYY-MM-DD")
    );
    setSellings(res);
    setLoading(false);
  });

  useEffect(() => {
    Promise.all([getSellings()]).then((res) => {
      setSellings(res[0]);
    });
    setLoading(false);
  }, []);

  return (
    <Layout
      withPageTitle
      title="Buat Invoice"
      pageTitleContent={
        <div className="flex items-center gap-1">
          <DateRangeForm
            label=""
            control={control}
            defaultValueStartAt={moment().subtract(1, "month")}
            defaultValueEndAt={moment()}
            name_start_at="start_at"
            name_end_at="end_at"
          />
          <Button className="mb-3 py-3 px-3" onClick={handleFilter}>
            <HiSearch size={16} />
          </Button>
        </div>
      }
    >
      <Table>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={4} />
          ) : (
            <>
              {sellings?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={6} className="py-2 text-center">
                    Tidak ada data
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {sellings?.data.map((item, key) => (
                    <Table.Tr>
                      <Table.Td>
                        <>{key + 1}</>
                      </Table.Td>
                      <Table.Td>
                        {item.test_date
                          ? moment(item.test_date).format("DD MMM YYYY")
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        <>
                          {item.company.name} - {item.client.name}
                        </>
                      </Table.Td>
                      <Table.Td>
                        <>{item.number_participant} Peserta</>
                      </Table.Td>
                      <Table.Td className="text-right">
                        {item.total_price ? currency(item.total_price) : "-"}
                      </Table.Td>
                      <Table.Td>
                        <Button
                          className="text-xs"
                          onClick={() =>
                            navigate(`/invoice/create-from/${item.reg_id}`)
                          }
                        >
                          <div className="flex items-center gap-3">
                            Buat Invoice <HiArrowRight />
                          </div>
                        </Button>
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

export default CreateInvoice;

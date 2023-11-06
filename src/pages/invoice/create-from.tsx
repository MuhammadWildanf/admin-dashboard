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
import { useNavigate, useParams } from "react-router-dom";
import { useAsesmen } from "../../stores/asesmen";
import { getData } from "../../api/get-data";
import { Checkbox } from "flowbite-react";
import { Check, CheckCircle, X } from "@phosphor-icons/react";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const CreateFromInvoice = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { asesmenId } = useParams();
  const { participants, setParticipants } = useAsesmen();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getParticipants = async () => {
    setLoading(true);
    try {
      const data = await getData(`/asesmen/${asesmenId}/participants`);
      return data;
    } catch {}
  };

  useEffect(() => {
    Promise.all([getParticipants()]).then((res) => {
      setParticipants(res[0]);
    });
    setLoading(false);
  }, []);

  return (
    <Layout
      withPageTitle
      title={
        <div className="leading-none">
          Buat Invoice <br />
          <small className="text-sm">dari asesmen #{asesmenId}</small>
        </div>
      }
    >
      <Table>
        <Table.Thead>
          <Table.Th className="text-center">
            <Checkbox />
          </Table.Th>
          <Table.Th>Nama Peserta</Table.Th>
          <Table.Th>Kode Aktivasi</Table.Th>
          <Table.Th>Jenis Asesmen</Table.Th>
          <Table.Th>Tgl Tes</Table.Th>
          <Table.Th className="text-center">Harga</Table.Th>
          <Table.Th className="text-center">Selesai Tes</Table.Th>
          <Table.Th className="text-center">Laporan Tes</Table.Th>
          <Table.Th className="text-center">Invoiced</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={4} />
          ) : (
            <>
              {participants?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Tr>Tidak ada data peserta</Table.Tr>
                </Table.Tr>
              ) : (
                <>
                  {participants?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td className="text-center">
                        <Checkbox />
                      </Table.Td>
                      {/* <Table.Td>
                        <>{key + 1}</>
                      </Table.Td> */}
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.activation_code ?? "-"}</Table.Td>
                      <Table.Td>{item.product.name}</Table.Td>
                      <Table.Td>-</Table.Td>
                      <Table.Td className="text-right">
                        {item.price ? currency(item.price) : "-"}
                      </Table.Td>
                      <Table.Td className="text-center">
                        <div className="flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-700" />
                        </div>
                      </Table.Td>
                      <Table.Td className="text-center">
                        <div className="flex items-center justify-center">
                          <X size={20} className="text-red-700" />
                        </div>
                      </Table.Td>
                      <Table.Td className="text-center">
                        <div className="flex items-center justify-center">
                          <X size={20} className="text-red-700" />
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
    </Layout>
  );
};

export default CreateFromInvoice;

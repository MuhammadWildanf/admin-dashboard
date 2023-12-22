import { useEffect, useState } from "react";
import moment from "moment";
import { HiArrowRight, HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useInvoice } from "../../../stores/invoice";
import { request } from "../../../api/config";
import Layout from "../../layout.tsx/app";
import { DateRangeForm } from "../../../components/forms/input-daterange";
import { Button } from "../../../components/buttons";
import Table from "../../../components/tables/base";
import { currency } from "../../../helper/currency";
import { Checkbox, Spinner } from "flowbite-react";
import { useAsesmen } from "../../../stores/asesmen";
import { ArrowRight, CheckCircle, X } from "@phosphor-icons/react";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const AddCompanyInvoice = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>(
    []
  );
  const [page, setPage] = useState<"asesmen" | "participant" | "invoice">(
    "asesmen"
  );

  const { sellings, setSellings } = useInvoice();
  const { participants, setParticipants } = useAsesmen();

  const navigate = useNavigate();
  const { companyId } = useParams();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getSellings = async (startAt?: string, endAt?: string) => {
    try {
      const { data } = await request.get("/invoice/get-selling", {
        params: {
          start_at:
            startAt ?? moment().subtract(1, "month").format("YYYY-MM-DD"),
          end_at: endAt ?? moment().format("YYYY-MM-DD"),
          company_id: companyId,
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

  const handleChangeCheckbox = async (value: string) => {
    if (!selected?.includes(value)) {
      // If it doesn't exist, insert it
      await setSelected([...selected, value]);
    } else {
      const updatedSelected = selected.filter((item) => item !== value);
      await setSelected(updatedSelected);
    }
  };

  const handleSelectAll = async () => {
    if (selected.length === sellings?.data.length) {
      await setSelected([]);
    } else {
      await setSelected(sellings?.data.map((item) => item.reg_id) ?? []);
    }
  };

  const handleChangeParticipantCheckbox = async (value: number) => {
    if (!selectedParticipants?.includes(value)) {
      // If it doesn't exist, insert it
      await setSelectedParticipants([...selectedParticipants, value]);
    } else {
      const updatedSelected = selectedParticipants.filter(
        (item) => item !== value
      );
      await setSelectedParticipants(updatedSelected);
    }
  };

  const handleSelectAllParticipant = async () => {
    if (selectedParticipants.length === participants?.data.length) {
      await setSelectedParticipants([]);
    } else {
      await setSelectedParticipants(
        participants?.data.map((item) => item.id) ?? []
      );
    }
  };

  const handleNext = async () => {
    if (selected.length === 0) {
      navigate(`/company/${companyId}/create-invoice?participantIds=`);
    } else {
      setLoadingSubmit(true);
      try {
        const { data } = await request.get(
          "/company/get-asesmem-participants",
          {
            params: {
              asesmen_ids: selected,
            },
          }
        );
        setParticipants(data.data);
        setPage("participant");
      } catch (err: any) {}

      setLoadingSubmit(false);
    }
  };

  const handleGenerate = async () => {
    setLoadingSubmit(true);
    let getParticipants = selectedParticipants.join(",");

    navigate(
      `/partner/company/${companyId}/create-invoice?participantIds=${getParticipants}`
    );

    setLoadingSubmit(false);
  };

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
      <>
        {page === "asesmen" && (
          <>
            <Table>
              <Table.Thead>
                <Table.Th className="text-center">
                  <Checkbox
                    onClick={handleSelectAll}
                    // defaultChecked={selected.length === sellings?.data.length}
                  />
                </Table.Th>
                <Table.Th>Tgl Tes</Table.Th>
                <Table.Th>Klien yang mendaftarkan</Table.Th>
                <Table.Th>Metode</Table.Th>
                <Table.Th className="text-center">Jumlah Peserta</Table.Th>
                <Table.Th className="text-right">Total Harga</Table.Th>
              </Table.Thead>
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
                            <Table.Td className="text-center">
                              <>
                                <Checkbox
                                  onChange={() =>
                                    handleChangeCheckbox(item.reg_id)
                                  }
                                  checked={selected.includes(item.reg_id)}
                                  name={`check.${key}`}
                                  key={key}
                                />
                              </>
                            </Table.Td>
                            <Table.Td>{item.test_date}</Table.Td>
                            <Table.Td>
                              <>{item.client.name}</>
                            </Table.Td>
                            <Table.Td>
                              <>{item.method}</>
                            </Table.Td>
                            <Table.Td className="text-center">
                              <>{item.number_participant} Peserta</>
                            </Table.Td>
                            <Table.Td className="text-right">
                              {item.total_price
                                ? currency(item.total_price)
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
            <div className="py-2 flex justify-end">
              <Button className="text-sm px-4" onClick={handleNext}>
                <div className="flex items-center gap-3">
                  {loadingSubmit ? (
                    <Spinner />
                  ) : (
                    <>
                      Lanjutkan <HiArrowRight />
                    </>
                  )}
                </div>
              </Button>
            </div>
          </>
        )}

        {page === "participant" && (
          <>
            <Table>
              <Table.Thead>
                <Table.Th className="text-center">
                  <Checkbox onChange={handleSelectAllParticipant} />
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
                              <Checkbox
                                onChange={() =>
                                  handleChangeParticipantCheckbox(item.id)
                                }
                                checked={selectedParticipants.includes(item.id)}
                              />
                            </Table.Td>
                            <Table.Td>{item.name}</Table.Td>
                            <Table.Td>{item.activation_code ?? "-"}</Table.Td>
                            <Table.Td>{item.product.name}</Table.Td>
                            <Table.Td>-</Table.Td>
                            <Table.Td className="text-right">
                              {item.price ? currency(item.price) : "-"}
                            </Table.Td>
                            <Table.Td className="text-center">
                              <div className="flex items-center justify-center">
                                {item.is_finished ? (
                                  <CheckCircle
                                    size={20}
                                    className="text-green-700"
                                  />
                                ) : (
                                  <X size={20} className="text-red-700" />
                                )}
                              </div>
                            </Table.Td>
                            <Table.Td className="text-center">
                              <div className="flex items-center justify-center">
                                {item.has_report ? (
                                  <CheckCircle
                                    size={20}
                                    className="text-green-700"
                                  />
                                ) : (
                                  <X size={20} className="text-red-700" />
                                )}
                              </div>
                            </Table.Td>
                            <Table.Td className="text-center">
                              <div className="flex items-center justify-center">
                                {item.has_invoice ? (
                                  <CheckCircle
                                    size={20}
                                    className="text-green-700"
                                  />
                                ) : (
                                  <X size={20} className="text-red-700" />
                                )}
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
            <div className="py-2 flex justify-end items-center">
              <Button className="px-6" onClick={handleGenerate}>
                {loadingSubmit ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Lanjutkan</span> <ArrowRight />
                  </div>
                )}
              </Button>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default AddCompanyInvoice;

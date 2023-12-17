import { useState } from "react";
import { sub } from "date-fns";
import Layout from "../layout.tsx/app";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FormSelectAsync } from "../../components/forms/input-select";
import { PsikologType } from "../../types/psikolog";
import { request } from "../../api/config";
import { Checkbox, Label, Radio, Spinner } from "flowbite-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import { HiArrowRight } from "react-icons/hi";
import { usePsikologFee } from "../../stores/psikolog-fee";
import Table from "../../components/tables/base";
import { FormInputCurrency } from "../../components/forms/input";
import { useAlert } from "../../stores/alert";
import { useNavigate } from "react-router-dom";

type GetValues = {
  is_all: boolean | null;
  psikolog_ids: any[];
  start_at: string;
  end_at: string;
  status: "all" | "finish" | "has_report" | null;
};

type FormValues = {
  psikolog_fees:
    | {
        psikolog_id: number | string;
        activation_code: string;
        psikolog_fee: number;
      }[]
    | null;
};

const IndexPsikologFee = () => {
  const [page, setPage] = useState<"index" | "run">("index");
  const [loadingGet, setLoadingGet] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [initialDate, setinitialDate] = useState<any>([
    {
      startDate: sub(new Date(), { days: 30 }),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { initials, setInitials } = usePsikologFee();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const forms = useForm<GetValues>({
    defaultValues: {
      is_all: true,
      start_at: initialDate[0].startDate,
      end_at: initialDate[0].endDate,
      status: "all",
    },
  });

  const formSubmit = useForm<FormValues>({
    defaultValues: {
      psikolog_fees: [],
    },
  });

  const handleGetPayment = forms.handleSubmit(async (data) => {
    setLoadingGet(true);
    let payload = {
      ...data,
      is_all: data.is_all ? 1 : 0,
      psikolog_ids: data.psikolog_ids
        ? data.psikolog_ids.map((item: PsikologType) => item.id)
        : null,
    };

    try {
      const { data } = await request.get("/psikolog-fee", {
        params: payload,
      });
      console.log(data.data);
      setInitials(data.data);
      setPage("run");
    } catch (err: any) {
      console.log(err);
    }
  });

  const psikologs = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/select/psikolog", {
      params: params,
    });
    return data.data.data;
  };

  const handleSubmit = formSubmit.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      await request.post("/psikolog-fee/run", data).then(() => {
        setLoadingSubmit(false);
        navigate("/psikolog-fee/history");
        setMessage(
          "Berhasil membuat pembayaran psikolog, selanjutnya silahkan upload bukti transfer!",
          "success"
        );
      });
    } catch (err: any) {
      setMessage("Oops, something went wrong!", "error");
    }
  });

  return (
    <>
      <Layout
        withPageTitle
        title={<div className="leading-none">Run Psikolog Fee</div>}
      >
        <>
          {page === "index" && (
            <div className="mt-4">
              <span>
                Silahkan masukkan rentang kalender pembayaran dan pilih psikolog
                terlebih dahulu!
              </span>
              <div className="mt-4">
                <div className="mt-3 max-w-4xl">
                  <div className="flex items-center gap-2 py-3">
                    <Controller
                      name="is_all"
                      control={forms.control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          id="withParticipant"
                          name="withAttachment"
                          value="1"
                          defaultChecked={forms.watch("is_all") ?? true}
                        />
                      )}
                    />
                    <Label htmlFor="withParticipant">
                      Pilih Semua Psikolog
                    </Label>
                  </div>
                  {!forms.watch("is_all") && (
                    <Controller
                      name="psikolog_ids"
                      control={forms.control}
                      render={({ field }) => (
                        <FormSelectAsync
                          {...field}
                          name="Psikolog"
                          label="Pilih Psikolog"
                          multiple={true}
                          loadOption={psikologs}
                          optionLabel={(option: PsikologType) =>
                            option.fullname
                          }
                          optionValue={(option: PsikologType) => option.id}
                        />
                      )}
                    />
                  )}
                </div>
                <DateRangePicker
                  onChange={(item) => {
                    setinitialDate([item.selection]);
                    console.log(item.selection.startDate);
                  }}
                  maxDate={new Date()}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={initialDate}
                  direction="horizontal"
                />

                <div className="flex items-center gap-5">
                  <div className="py-1">Status Asesmen</div>
                  <div className="flex items-center gap-2 py-3">
                    <Controller
                      name="status"
                      control={forms.control}
                      render={({ field }) => (
                        <Radio
                          {...field}
                          id="status_all"
                          name="status"
                          value="all"
                          defaultChecked={true}
                        />
                      )}
                    />
                    <Label htmlFor="status_all">Semua Status</Label>
                  </div>
                  <div className="flex items-center gap-2 py-3">
                    <Controller
                      name="status"
                      control={forms.control}
                      render={({ field }) => (
                        <Radio
                          {...field}
                          id="status_finish"
                          name="status"
                          value="finish"
                        />
                      )}
                    />
                    <Label htmlFor="status_finish">Selesai</Label>
                  </div>
                  <div className="flex items-center gap-2 py-3">
                    <Controller
                      name="status"
                      control={forms.control}
                      render={({ field }) => (
                        <Radio
                          {...field}
                          id="status_has_report"
                          name="status"
                          value="finish"
                        />
                      )}
                    />
                    <Label htmlFor="status_has_report">Laporan Diterima</Label>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    className="w-full max-w-sm"
                    onClick={handleGetPayment}
                  >
                    {loadingGet ? (
                      <Spinner />
                    ) : (
                      <div className="flex items-center justify-center gap-6">
                        <span>Step Selanjutnya</span>
                        <HiArrowRight />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>

        <>
          {page === "run" && (
            <FormProvider {...formSubmit}>
              <div className="mt-6">
                <Table>
                  <Table.Thead>
                    <Table.Th>No</Table.Th>
                    <Table.Th>Kode Aktivasi</Table.Th>
                    <Table.Th>Psikolog</Table.Th>
                    <Table.Th>Modul</Table.Th>
                    <Table.Th>Perusahaan</Table.Th>
                    <Table.Th>Peserta</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Fee</Table.Th>
                  </Table.Thead>
                  <Table.Tbody>
                    {initials?.map((item, key) => (
                      <Table.Tr>
                        <Table.Td>
                          <>{key + 1}</>
                        </Table.Td>
                        <Table.Td>
                          <>
                            {item.activation_code}
                            <Controller
                              control={formSubmit.control}
                              name={`psikolog_fees.${key}.activation_code`}
                              defaultValue={item.activation_code}
                              render={({ field }) => (
                                <input type="hidden" {...field} />
                              )}
                            />
                          </>
                        </Table.Td>
                        <Table.Td>
                          <>
                            {item.psikolog_name}
                            <Controller
                              control={formSubmit.control}
                              name={`psikolog_fees.${key}.psikolog_id`}
                              defaultValue={item.psikolog_id}
                              render={({ field }) => (
                                <input type="hidden" {...field} />
                              )}
                            />
                          </>
                        </Table.Td>
                        <Table.Td>{item.company_name ?? "-"}</Table.Td>
                        <Table.Td>{item.participant?.name ?? "-"}</Table.Td>
                        <Table.Td>{item.module_name ?? "-"}</Table.Td>
                        <Table.Td>
                          <>
                            {item.status === "not_finish" && (
                              <span className="text-red-600">
                                Belum selesai
                              </span>
                            )}

                            {item.status === "finish" && (
                              <span className="text-blue-700">Tes selesai</span>
                            )}

                            {item.status === "has_report" && (
                              <span className="text-green-700">
                                Sudah ada laporan
                              </span>
                            )}
                          </>
                        </Table.Td>
                        <Table.Td>
                          <Controller
                            control={formSubmit.control}
                            name={`psikolog_fees.${key}.psikolog_fee`}
                            defaultValue={item.psikolog_fee}
                            render={({ field }) => (
                              <FormInputCurrency
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value.replace(/\./g, "")
                                  )
                                }
                                label=""
                              />
                            )}
                          />
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
                <div className="py-2 flex items-center justify-end">
                  <Button
                    disabled={loadingSubmit}
                    onClick={handleSubmit}
                    className="px-12"
                  >
                    {loadingSubmit ? <Spinner /> : "Lanjutkan"}
                  </Button>
                </div>
              </div>
            </FormProvider>
          )}
        </>
      </Layout>
    </>
  );
};

export default IndexPsikologFee;

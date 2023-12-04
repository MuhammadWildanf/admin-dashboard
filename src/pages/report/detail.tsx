import { useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { useEffect, useState } from "react";
import LoadingPage from "../layout.tsx/loading";
import { Button } from "../../components/buttons";
import BaseModal from "../../components/modal/base";
import { FormProvider, useForm } from "react-hook-form";
import { FormTextArea } from "../../components/forms/input-textarea";
import { FileInput, Label, Spinner } from "flowbite-react";
import { useReport } from "../../stores/report";
import { request } from "../../api/config";
import { Check, Clock, FilePdf, WarningCircle } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import { parseDate } from "../../helper/date";
import { ReportType } from "../../types/report";

type FormValues = {
  notes: string;
  file: FileList;
};

type ErrorForms = {
  file: [] | null;
  notes: [] | null;
};

const ShowReport = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [modalReject, setModalReject] = useState<boolean>(false);
  const [modalApprove, setModalApprove] = useState<boolean>(false);
  const [selected, setSelected] = useState<ReportType | undefined>(undefined);
  const [errors, setErrors] = useState<ErrorForms | null>(null);

  const forms = useForm<FormValues>();

  const { code } = useParams();
  const { reports, setReports } = useReport();
  const { setMessage } = useAlert();

  const handleReject = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        notes: data.notes,
      };
      await request.post(`/report/${selected?.id}/revise`, payload).then(() => {
        setMessage("Berhasil merubah status laporan ke REVISI", "success");
        setModalReject(false);
        setSelected(undefined);
        forms.reset();
      });
    } catch (err: any) {
      setErrors(err.response.data.errors);
      setMessage("Oops, ada yang error nih", "error");
    }
    setLoadingSubmit(false);
  });

  const handleApprove = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    let payload = {
      file: data.file[0],
    };
    try {
      await request
        .post(`/report/${selected?.id}/approve`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setMessage("Berhasil menerima laporan", "success");
          setModalApprove(false);
          setSelected(undefined);
          forms.reset();
        });
    } catch (err: any) {
      setErrors(err.response.data.errors);
      setMessage("Oops, ada yang error nih", "error");
    }
    setLoadingSubmit(false);
  });

  const getReport = async () => {
    setLoading(true);
    try {
      const { data } = await request.get("/report", {
        params: {
          activation_code: code,
        },
      });
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([getReport()]).then((res) => {
      setReports(res[0]);
      setLoading(false);
    });
  }, [loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title={`Laporan Tes #${code}`}
      pageTitleContent={<Status items={reports?.data ?? null} />}
    >
      <>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            {reports?.data.length === 0 ? (
              <div className="mt-4 w-full h-[150px] flex items-center justify-center">
                <div className="text-center">
                  <span className="text-xl">Belum ada laporan</span> <br />
                </div>
              </div>
            ) : (
              <>
                {reports?.data.map((item, key) => (
                  <div className="w-full rounded-lg mb-2 p-3 border" key={key}>
                    <div className="w-full flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9">
                          <FilePdf size={32} />
                        </div>
                        <div className="leading-5">
                          <a
                            href={item.file ?? "-"}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-blue-700"
                          >
                            {item.filename ?? "-"}
                          </a>{" "}
                          <br />
                          <small>
                            Tgl Upload:{" "}
                            {item.created_at ? parseDate(item.created_at) : "-"}
                          </small>
                        </div>
                      </div>

                      <div>
                        {!item.revised_at && !item.approved_at && (
                          <div className="flex items-center gap-2 text-yellow-500">
                            <Clock />
                            <span className="text-sm">Belum Diperiksa</span>
                          </div>
                        )}
                        {item.revised_at && !item.has_revised_at && (
                          <div className="flex items-center gap-2 text-red-700">
                            <WarningCircle />
                            <span className="text-sm">Perlu direvisi!</span>
                          </div>
                        )}

                        {item.has_revised_at && (
                          <div className="flex items-center gap-2 text-blue-700">
                            <WarningCircle />
                            <span className="text-sm">Sudah Direvisi!</span>
                          </div>
                        )}

                        {item.approved_at && (
                          <div className="flex items-center gap-2 text-green-700">
                            <Check />
                            <span className="text-sm">Diterima</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.approved_file && (
                      <div className="mt-4 bg-green-50 py-2 px-4 rounded-lg">
                        <small className="text-green-700">
                          File laporan yang sudah disetujui
                        </small>
                        <div className="flex items-center gap-2">
                          <div className="w-9">
                            <FilePdf size={32} />
                          </div>
                          <div className="leading-5">
                            <a
                              href={item.approved_file ?? "-"}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline hover:text-blue-700"
                            >
                              {item.approved_filename ?? "-"}
                            </a>{" "}
                            <br />
                            <small>
                              Tgl Upload:{" "}
                              {item.updated_at
                                ? parseDate(item.updated_at)
                                : "-"}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 ">
                      <small>Catatan Psikolog:</small> <br />
                      <span>{item.notes}</span>
                    </div>

                    {item.revise_note && (
                      <div className="mt-3 p-3 border-t bg-red-50">
                        <small>Catatan Revisi:</small> <br />
                        <span>{item.revise_note}</span>
                      </div>
                    )}

                    {!item.revised_at &&
                      !item.has_revised_at &&
                      !item.approved_at && (
                        <div className="mt-3 flex items-center py-2 justify-end gap-2">
                          <Button
                            className="text-sm px-6 bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              setModalReject(true);
                              setSelected(item);
                            }}
                          >
                            Revisi
                          </Button>
                          <Button
                            className="text-sm px-12 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setModalApprove(true);
                              setSelected(item);
                            }}
                          >
                            Terima
                          </Button>
                        </div>
                      )}

                    {item.approved_at && (
                      <div className="mt-3 flex items-center py-2 justify-end gap-2">
                        <Button
                          className="text-sm px-6 bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            setModalReject(true);
                            setSelected(item);
                          }}
                        >
                          Ubah status ke REVISI
                        </Button>
                      </div>
                    )}

                    {key === 0 && item.revised_at && (
                      <div className="mt-3 flex items-center py-2 justify-end gap-2">
                        <Button
                          className="text-sm px-6 bg-teal-600 hover:bg-teal-700"
                          onClick={() => {
                            setModalApprove(true);
                            setSelected(item);
                          }}
                        >
                          Ubah status ke DITERIMA
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </>

      <BaseModal
        title={""}
        isOpen={modalReject}
        close={() => {
          setSelected(undefined);
          setModalReject(false);
        }}
        size="xl"
      >
        <h1 className="text-xl">
          Yakin ingin meminta untuk merivisi laporan ini?
        </h1>
        <div className="mt-4">
          <FormProvider {...forms}>
            <FormTextArea
              label="Mohon beri catatan revisi"
              control={forms.control}
              name="notes"
              error={errors?.notes}
            />

            <div className="mt-3 flex items-center gap-2 justify-end">
              <Button
                className="px-3"
                variant="danger"
                onClick={() => {
                  setModalReject(false);
                  setSelected(undefined);
                }}
              >
                Batal
              </Button>
              <Button className="px-12" onClick={handleReject}>
                {loadingSubmit ? <Spinner /> : "Revisi Laporan"}
              </Button>
            </div>
          </FormProvider>
        </div>
      </BaseModal>

      <BaseModal
        title={""}
        isOpen={modalApprove}
        close={() => {
          setSelected(undefined);
          setModalApprove(false);
        }}
      >
        <h1 className="text-xl">Yakin ingin menerima laporan ini?</h1>
        <div className="mt-5">
          <div className="mb-3">
            <span className="text-sm">
              Untuk menerima laporan, anda harus mengupload file format laporan
              berbentuk PDF, format ini akan dikirim secara langsung ke klien
              melalui dasbor klien
            </span>
          </div>
          <FormProvider {...forms}>
            <div id="fileUpload" className="mb-4">
              <div className="mb-2 block">
                <Label htmlFor="file" value="Upload Dokumen" />
              </div>
              <FileInput
                {...forms.register("file")}
                id="file"
                helperText="Format dokumen yang didukung hanya PDF atau .docx"
                className="w-full"
                accept=".pdf"
              />
              {errors?.file && (
                <small className="text-red-600">
                  <>{errors.file}</>
                </small>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2 justify-end">
              <Button
                className="px-3"
                variant="danger"
                onClick={() => {
                  setModalApprove(false);
                  setSelected(undefined);
                }}
              >
                Batal
              </Button>
              <Button
                className="px-12 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
              >
                {loadingSubmit ? <Spinner /> : "Iya!"}
              </Button>
            </div>
          </FormProvider>
        </div>
      </BaseModal>
    </Layout>
  );
};

const Status = ({ items }: { items: ReportType[] | null }) => {
  let lastItem = null;
  let statusText = "Belum ada laporan";

  if (items) {
    lastItem = items[0];
  }

  if (!lastItem?.approved_at && !lastItem?.revised_at) {
    statusText = "Belum Diperiksa";
  }

  if (lastItem?.revised_at) {
    statusText = "Perlu direvisi";
  }

  if (lastItem?.approved_at) {
    statusText = "Diterima";
  }

  return (
    <>
      {items && (
        <div
          className={`text-sm py-1 px-3  text-white rounded-lg 
            ${statusText === "Belum ada laporan" && "bg-gray-500"}
            ${statusText === "Belum Diperiksa" && "bg-gray-500"}
            ${statusText === "Perlu direvisi" && "bg-red-600"}
            ${statusText === "Diterima" && "bg-green-600"}
          `}
        >
          {statusText}
        </div>
      )}
    </>
  );
};

export default ShowReport;

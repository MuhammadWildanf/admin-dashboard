import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { useForm } from "react-hook-form";
import { request } from "../../api/config";
import { getData } from "../../api/get-data";
import Table from "../../components/tables/base";
import { Link, useNavigate, useParams } from "react-router-dom";
import BaseModal from "../../components/modal/base";
import moment from "moment-timezone";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import { useAsesmen } from "../../stores/asesmen";
import { currency } from "../../helper/currency";
import { FormInput } from "../../components/forms/input";
import { Spinner } from "flowbite-react";

type FormValues = {
  meeting_link: string;
};

type ErrorForm = {
  meeting_link: [] | null;
};

const DetailAsesmen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalApprve, setModalApprove] = useState<boolean>(false);

  const { handleSubmit, reset, control } = useForm<FormValues>();

  const { asesmen, setAsesmen, participants, setParticipants } = useAsesmen();

  const { asesmenId } = useParams();

  const getAsesmen = async () => {
    setLoading(true);
    try {
      const data = await getData(`/asesmen/${asesmenId}`);
      return data;
    } catch {}
  };

  const getParticipants = async () => {
    setLoading(true);
    try {
      const data = await getData(`/asesmen/${asesmenId}/participants`);
      return data;
    } catch {}
  };

  const handleApprove = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      await request.post(`/asesmen/${asesmenId}/approve`, data);
      setModalApprove(false);
      reset();
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const handleDelete = () => {};

  useEffect(() => {
    Promise.all([getAsesmen(), getParticipants()]).then((res) => {
      setAsesmen(res[0]);
      setParticipants(res[1]);
    });
    setLoading(false);
  }, [loadingSubmit]);

  return (
    <Layout
      withPageTitle={true}
      title={
        <div className="flex gap-2 items-center">
          <span>Asesmen #{asesmen?.reg_id}</span>
          <small
            className={`text-xs uppercase text-gray-800 px-2 rounded ${
              asesmen?.status === "draft" && "bg-gray-100"
            } ${asesmen?.status === "pending approval" && "bg-blue-100"} ${
              asesmen?.status === "approved" && "bg-green-100"
            }`}
          >
            {asesmen?.status}
          </small>
        </div>
      }
      pageTitleContent={
        asesmen?.status === "pending approval" ? (
          <Button
            onClick={() => setModalApprove(true)}
            className="px-8 text-sm"
          >
            Setujui
          </Button>
        ) : (
          <></>
        )
      }
    >
      <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="py-1 border-r">
          <small>Tanggal Tes:</small>
          <p>
            {asesmen?.test_date
              ? moment(asesmen?.test_date).format("dddd, D MMMM YYYY")
              : "-"}
          </p>
        </div>
        <div className="py-1 md:border-r">
          <small>Metode:</small> <br />
          <div
            className={`text-xs text-white uppercase inline-block py-1 px-3 rounded ${
              asesmen?.method === "online" && "bg-blue-600"
            }`}
          >
            {asesmen?.method}
          </div>
        </div>
        <div className="py-1 md:border-r">
          <small>Jumlah Peserta:</small> <br />
          <p>{asesmen?.number_participant}</p>
        </div>
        <div className="py-1 ">
          <small>Total Harga:</small> <br />
          <p>{asesmen?.total_price ? currency(asesmen?.total_price) : "-"}</p>
        </div>
        <div className="py-1 border-r">
          <small>Tanggal Pengajuan:</small>
          <p>
            {asesmen?.created_at
              ? moment(asesmen?.created_at).format("dddd, D MMMM YYYY, HH:s")
              : "-"}
          </p>
        </div>
        <div className="py-1 border-r">
          <small>Klien / Perusahaan:</small>
          <p>
            {asesmen?.client.name} - {asesmen?.company.name}
          </p>
        </div>
        <div className="py-1 col-span-2 ">
          <small>Link Meeting:</small>
          <p>
            {asesmen?.meeting_link ? (
              <Link
                to={asesmen?.meeting_link}
                target="_blank"
                className="hover:underline"
              >
                {asesmen?.meeting_link}
              </Link>
            ) : (
              "-"
            )}
          </p>
        </div>
      </div>
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>NIK</Table.Th>
          <Table.Th>Nama</Table.Th>
          <Table.Th>Jns. Asesmen</Table.Th>
          <Table.Th>Tujuan</Table.Th>
          <Table.Th>Kode Aktivasi</Table.Th>
          <Table.Th>Konfirmasi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={8} rows={5} />
          ) : (
            <>
              {participants?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={7} className="py-3 text-center">
                    Tidak ada data
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {participants?.data.map((item, key) => (
                    <Table.Tr>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          participants.per_page *
                            (participants.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.nik}</Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td>{item.product?.name ?? "-"}</Table.Td>
                      <Table.Td>
                        {item.purpose
                          ? item.purpose
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "-"}
                      </Table.Td>
                      <Table.Td>{item.activation_code ?? "-"}</Table.Td>
                      <Table.Td>
                        {item.confirmed_at ? (
                          <span>
                            {moment(item.confirmed_at).format(
                              "DD MMMM YYYY, H:i"
                            )}
                          </span>
                        ) : (
                          "Belum"
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}
            </>
          )}
        </Table.Tbody>
      </Table>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="kode aktivasi"
        name={``}
        loading={loadingSubmit}
        action={handleDelete}
      />

      <BaseModal
        title=""
        isOpen={modalApprve}
        close={() => setModalApprove(false)}
        size="lg"
      >
        <div className="">
          <h3 className="text-2xl font-bold">Setujui permintaan ini?</h3>
          <br />
          <div className="text-lg pb-3">
            Dengan menyetujui permintaan ini, sistem akan membuat kode aktivasi
            secara otomatis yang akan aktif di hari tes. <br />
            Aksi ini tidak dapat dikembalikan!
          </div>
          <div className="pt-3 border-t">
            <FormInput
              control={control}
              name="meeting_link"
              label="Link Meeting"
              error={errors?.meeting_link}
              hint="Hanya link saja yang berawalan https://..."
            />
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => setModalApprove(false)}
                className="px-4"
              >
                Batal
              </Button>
              <Button className="px-12" onClick={handleApprove}>
                {loadingSubmit ? <Spinner /> : "Ok!"}
              </Button>
            </div>
          </div>
        </div>
      </BaseModal>
    </Layout>
  );
};

export default DetailAsesmen;
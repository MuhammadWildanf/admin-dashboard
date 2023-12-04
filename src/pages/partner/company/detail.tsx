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
import { currency } from "../../../helper/currency";
import Table from "../../../components/tables/base";

const CompanyDetailPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [modalApprove, setModalApprove] = useState<boolean>(false);
  const [debt, setDebt] = useState<number>(0);
  const [loadingDebt, setLoadingDebt] = useState<boolean>(false);
  const [totalAsesmen, setTotalAsesmen] = useState<number>(0);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [loadingTotalAsesmen, setLoadingTotalAsesmen] =
    useState<boolean>(false);

  const { company, setCompany } = useCompany();
  const { companyId } = useParams();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const getCompany = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await request.get(`/company/${companyId}`);
      return data.data;
    } catch {}
  };

  const handleApprove = async () => {
    setLoadingSubmit(true);
    try {
      await request.post(`/company/${companyId}/approve`);
    } catch (err: any) {
      console.log(err);
      setMessage("Oops, something went wrong!", "error");
    }
    setModalApprove(false);
    setLoadingSubmit(false);
  };

  const getDebt = async () => {
    setLoadingDebt(true);
    try {
      const { data } = await request.get(`company/${companyId}/debt`);
      return data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalAsesmen = async () => {
    setLoadingTotalAsesmen(true);
    try {
      const { data } = await request.get(`company/${companyId}/total-asesmen`);
      return data.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([getCompany(), getDebt(), getTotalAsesmen()]).then((res) => {
      setCompany(res[0]);
      setDebt(res[1]);
      setTotalAsesmen(res[2].assessments);
      setTotalParticipants(res[2].participants);
    });
    setLoading(false);
    setLoadingDebt(false);
    setLoadingTotalAsesmen(false);
  }, [loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title={company?.name}
      pageTitleContent={
        <div className="flex items-center">
          {!company?.approved_at && (
            <Button onClick={() => setModalApprove(true)} className="px-6">
              Setujui
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <div className="bg-red-100 rounded-lg py-2 px-4">
              <small>Hutang Perusahaan</small> <br />
              <span className="text-xl font-bold">
                {loadingDebt ? <Spinner /> : currency(debt)}
              </span>
            </div>
            <div className="bg-yellow-100 border-yellow-700 rounded-lg py-2 px-4">
              <small>Total Pengajuan Asesmen</small> <br />
              <span className="text-xl font-bold">
                {loadingTotalAsesmen ? <Spinner /> : totalAsesmen}x
              </span>
            </div>
            <div className="bg-purple-100 rounded-lg py-2 px-4">
              <small>Total Peserta Asesmen</small> <br />
              <span className="text-xl font-bold">
                {loadingTotalAsesmen ? <Spinner /> : totalParticipants} Peserta
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-100 rounded-lg p-4 text-blue-700 font-semibold text-lg cursor-pointer hover:bg-blue-200">
              Permintaan Asesmen
            </div>
            <div
              onClick={() => navigate(`/partner/company/${companyId}/invoice`)}
              className="bg-green-100 rounded-lg p-4 text-green-700 font-semibold text-lg cursor-pointer hover:bg-green-200"
            >
              Tagihan dan Invoice
            </div>
          </div>

          <div className="mt-8">
            <span className=" font-bold">List Klien</span>
            <Table className="mt-2">
              <Table.Thead>
                <Table.Th>#</Table.Th>
                <Table.Th>Nama Klien</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>No. HP</Table.Th>
                <Table.Th>Tgl Join</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {company?.clients?.map((item, key) => (
                  <Table.Tr>
                    <Table.Td>
                      <>{key + 1}</>
                    </Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.email}</Table.Td>
                    <Table.Td>{item.phone}</Table.Td>
                    <Table.Td>
                      <>
                        {item.pivot.joined_at
                          ? parseDate(item.pivot.joined_at)
                          : "-"}
                      </>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
        <div className="md:col-span-2">
          <strong>Informasi Perusahaan</strong>
          <div className="py-2 grid grid-cols-1 gap-2">
            <div>
              <small>Nama Perusahaan</small> <br />
              <p>{company?.name}</p>
            </div>
            <div>
              <small>Alamat</small> <br />
              <p>{company?.address}</p>
            </div>
            <div>
              <small>Provinsi / Kota / Kode Pos</small> <br />
              <p>
                {company?.city?.province?.name} / {company?.city?.name} /{" "}
                {company?.postal_code}
              </p>
            </div>
            <div>
              <small>Email Perusahaan</small> <br />
              <p>{company?.email}</p>
            </div>
            <div>
              <small>No Telephone Perusahaan</small> <br />
              <p>{company?.phone}</p>
            </div>
            <div>
              <small>No. Registrasi Perusahaan</small> <br />
              <p>{company?.registration_id ?? "-"}</p>
            </div>
            <div>
              <small>No. NPWP</small> <br />
              <p>{company?.npwp}</p>
            </div>
            <div>
              <small>Klien yang mendaftarkan</small> <br />
              <p>{company?.registered_by?.name}</p>
            </div>
            <div>
              <small>Tanggal Mendaftar</small> <br />
              <p>
                {company?.created_at ? parseDate(company?.created_at) : "-"}
              </p>
            </div>
            <div>
              <small>Tanggal Disetujui</small> <br />
              <p>
                {company?.approved_at
                  ? parseDate(company?.approved_at)
                  : "Belum diverifikasi"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <BaseModal isOpen={modalApprove} close={() => setModalApprove(false)}>
        <h1 className="text-lg">
          Apakah anda yakin ingin memverifikasi <strong>{company?.name}</strong>
        </h1>
        <span>
          Setelah anda memverifikasi, klien dari perusahaan ini akan dapat
          mengakses dasbor klien
        </span>
        <div className="mt-4 flex justify-end">
          <div className="flex gap-2">
            <Button
              onClick={() => setModalApprove(false)}
              className="px-4"
              variant="danger"
            >
              Batal
            </Button>
            <Button onClick={handleApprove} className="px-16">
              {loadingSubmit ? <Spinner /> : "Ok!"}
            </Button>
          </div>
        </div>
      </BaseModal>
    </Layout>
  );
};

export default CompanyDetailPage;

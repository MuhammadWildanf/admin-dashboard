import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { useEffect, useState } from "react";
import { useActivationCode } from "../../stores/activation-code";
import { getData } from "../../api/get-data";
import { calculateAge, parseDate } from "../../helper/date";
import moment from "moment";
import Biodata from "./results/biodata";
import Cfit2Result from "./results/cfit2";
import LoadingPage from "../layout.tsx/loading";
import CfitResult from "./results/cfit";
import ISTResult from "./results/ist";
import EppsResult from "./results/epps";
import RmibResult from "./results/rmib";
import McResult from "./results/mc";
import PapiResult from "./results/papi";
import KraeplinResult from "./results/kraeplin";
import DiscResult from "./results/disc";
import MsdtResult from "./results/msdt";
import VakResult from "./results/vak";
import MinatResult from "./results/minat";
import GrafisResult from "./results/grafis";
import DocsResult from "./results/docs";
import TiuResult from "./results/tiu";
import { Button } from "../../components/buttons";
import { Printer } from "@phosphor-icons/react";

const DetailActivationCode = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { code } = useParams();
  const { detail, setDetail } = useActivationCode();

  const navigate = useNavigate();

  const getDetail = async () => {
    setLoading(true);
    try {
      const data = await getData(`/activation-code/${code}`);
      return data;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([getDetail()]).then((res) => {
      setDetail(res[0]);
      setLoading(false);
    });
  }, []);

  return (
    <Layout
      withPageTitle
      title={`Kode Aktivasi ${code}`}
      pageTitleContent={<></>}
    >
      <>
        {loading ? (
          <LoadingPage />
        ) : (
          <>
            <div className="mb-6 -mt-4 flex items-center justify-between">
              <span
                className={`py-1 px-4 rounded text-white uppercase text-sm ${
                  detail?.activation_code.status === "belum digunakan" &&
                  "bg-gray-600"
                }  ${
                  detail?.activation_code.status === "proses" && "bg-blue-600"
                } ${
                  detail?.activation_code.status === "selesai" && "bg-green-600"
                }`}
              >
                {detail?.activation_code.status}
              </span>
              <div className="">
                <Button
                  className="text-sm px-4"
                  onClick={() =>
                    navigate(
                      `/activation-code/${detail?.activation_code.code}/print`
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <Printer size={18} /> Print
                  </div>
                </Button>
              </div>
            </div>
            <div className="py-2 border-t grid grid-cols-2 gap-2 text-sm">
              <div className="flex gap-2">
                <div className="w-32">Kode</div>
                <div>: {detail?.activation_code.code}</div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Modul</div>
                <div>: {detail?.activation_code.module.name}</div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Tes dimulai</div>
                <div>
                  :{" "}
                  {detail?.activation_code.start_at
                    ? parseDate(detail.activation_code.start_at)
                    : "-"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Tes selesai</div>
                <div>
                  :{" "}
                  {detail?.activation_code.finish_at
                    ? parseDate(detail.activation_code.finish_at)
                    : "Belum selesai"}
                </div>
              </div>
            </div>

            <div className="py-2 border-t border-b grid grid-cols-2 gap-2 text-sm">
              <div className="flex gap-2">
                <div className="w-32">Nama Peserta</div>
                <div>: {detail?.activation_code.participant?.name}</div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Tanggal Lahir</div>
                <div>
                  :{" "}
                  {detail?.activation_code.participant?.birth
                    ? moment(detail.activation_code.participant?.birth).format(
                        "DD MMMM YYYY"
                      )
                    : "-"}{" "}
                  (
                  {detail?.activation_code?.participant?.birth
                    ? calculateAge(detail?.activation_code.participant?.birth)
                    : ""}
                  )
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Jenis Kelamin</div>
                <div className="capitalize">
                  :{" "}
                  {detail?.activation_code.participant?.gender === "female"
                    ? "Perempuan"
                    : "Laki-laki"}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-32">Pendidikan Terakhir</div>
                <div className="uppercase">
                  : {detail?.activation_code.participant?.education}
                </div>
              </div>
            </div>

            {detail?.activation_code?.asesmen_participant && (
              <div className="mt-4">
                <div className="py-2">
                  <strong>Tambahan Data Peserta</strong>
                </div>
                <div className="py-2 border-t border-b grid grid-cols-2 gap-2 text-sm">
                  <div className="flex gap-2">
                    <div className="w-32">Perusahaan</div>
                    <div>
                      :{" "}
                      {
                        detail?.activation_code.asesmen_participant?.company
                          ?.name
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Assessment ID</div>
                    <div>
                      :{" "}
                      {
                        detail?.activation_code.asesmen_participant
                          ?.assessment_id
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Jabatan</div>
                    <div className="capitalize">
                      : {detail?.activation_code.asesmen_participant?.role}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Tujuan Asesmen</div>
                    <div className="uppercase">
                      : {detail?.activation_code.asesmen_participant?.purpose}
                    </div>
                  </div>
                </div>

                <div className="py-2 border-b grid grid-cols-2 gap-2 text-sm">
                  <div className="flex gap-2">
                    <div className="w-32">Deskripsi Pekerjaan</div>
                    <div>
                      :{" "}
                      {detail?.activation_code.asesmen_participant?.job_desc ??
                        "-"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Kompetensi</div>
                    <div>
                      :{" "}
                      {detail?.activation_code.asesmen_participant?.kompetensi}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Jabatan saat ini</div>
                    <div className="capitalize">
                      :{" "}
                      {detail?.activation_code.asesmen_participant
                        ?.current_position ?? "-"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-32">Jabatan dituju</div>
                    <div className="uppercase">
                      :{" "}
                      {detail?.activation_code.asesmen_participant
                        ?.next_position ?? "-"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3">
              {detail?.result.map((item, key) => {
                switch (item.alias) {
                  case "form":
                    return <Biodata key={key} data={item} />;

                  case "cfit2":
                    return <Cfit2Result key={key} data={item} />;

                  case "cfit":
                    return <CfitResult key={key} data={item} />;

                  case "ist":
                    return <ISTResult key={key} data={item} />;

                  case "papi":
                    return <PapiResult key={key} data={item} />;

                  case "epps":
                    return <EppsResult key={key} data={item} />;

                  case "rmib":
                    return <RmibResult key={key} data={item} />;

                  case "mc":
                    return <McResult key={key} data={item} />;

                  case "kraeplin":
                    return <KraeplinResult key={key} data={item} />;

                  case "disc":
                    return <DiscResult key={key} data={item} />;

                  case "msdt":
                    return <MsdtResult key={key} data={item} />;

                  case "vak":
                    return <VakResult key={key} data={item} />;

                  case "minat":
                    return <MinatResult key={key} data={item} />;

                  case "grafis":
                    return <GrafisResult key={key} data={item} />;

                  case "docs":
                    return <DocsResult key={key} data={item} />;

                  case "tiu":
                    return <TiuResult key={key} data={item} />;
                }
                return <></>;
              })}
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

export default DetailActivationCode;

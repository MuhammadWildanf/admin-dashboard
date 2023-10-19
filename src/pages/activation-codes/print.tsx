import { useParams } from "react-router-dom";
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

const PrintActivationCode = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { code } = useParams();
  const { detail, setDetail } = useActivationCode();

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

  useEffect(() => {
    // Set a timer to run window.print() after 5 seconds (5000 milliseconds)
    const printTimer = setTimeout(() => {
      window.print();
    }, 2000);

    // Clear the timer when the component unmounts to prevent any memory leaks
    return () => {
      clearTimeout(printTimer);
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="py-2 text-xl font-bold">
            #{detail?.activation_code.code}
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
                {detail?.activation_code.start_at
                  ? parseDate(detail.activation_code.finish_at)
                  : "-"}
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
  );
};

export default PrintActivationCode;

import { useEffect, useState } from "react";
import { useActivationCode } from "../../stores/activation-code";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { useParams } from "react-router-dom";
import LoadingPage from "../layout.tsx/loading";
import { calculateAge, parseDate } from "../../helper/date";
import moment from "moment";
import Table from "../../components/tables/base";

const SheetActivationCode = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { detail, setDetail } = useActivationCode();
  const { code } = useParams();

  const getDetail = async () => {
    setLoading(true);
    try {
      const data = await getData(`/activation-code/${code}/sheet`);
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
    <>
      <Layout
        withPageTitle
        title={`Rekapitulasi Jawaban ${detail?.activation_code.code}`}
      >
        <>
          {loading ? (
            <LoadingPage />
          ) : (
            <>
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
                      ? moment(
                          detail.activation_code.participant?.birth
                        ).format("DD MMMM YYYY")
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
            </>
          )}

          <div className="mt-4">
            {detail?.result.map((item, key) => (
              <>
                {item.test_name !== "Data Diri" && (
                  <div className="py-3" key={key}>
                    <div className="flex justify-between items-center">
                      <strong>{item.test_name ?? ""}</strong>
                      <div className="flex gap-1 text-sm">
                        <div className="pr-2 border-r">
                          Mulai:{" "}
                          {item.created_at ? parseDate(item.creted_at) : "-"}
                        </div>
                        <div className="pl-1">
                          Selesai:{" "}
                          {item.created_at ? parseDate(item.updated_at) : "-"}
                        </div>
                      </div>
                    </div>
                    <Table className="mt-3">
                      <Table.Thead>
                        <Table.Th>Urutan Soal</Table.Th>
                        <Table.Th>Soal</Table.Th>
                        <Table.Th>Jawaban</Table.Th>
                        <Table.Th>Key</Table.Th>
                      </Table.Thead>
                      <Table.Tbody>
                        {item.value?.map((val: any, key: number) => (
                          <Table.Tr key={key}>
                            <Table.Td>{(key + 1).toString()}</Table.Td>
                            <Table.Td>
                              <>
                                {val.question ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: val.question,
                                    }}
                                  />
                                ) : (
                                  "-"
                                )}
                              </>
                            </Table.Td>
                            <Table.Td>
                              <span className="uppercase">{val.value}</span>
                            </Table.Td>
                            <Table.Td>
                              <span className="uppercase">{val.key}</span>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      </Layout>
    </>
  );
};

export default SheetActivationCode;

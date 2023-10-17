import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { useParams } from "react-router-dom";
import LoadingPage from "../layout.tsx/loading";
import { parseDate } from "../../helper/date";
import Table from "../../components/tables/base";
import { AccessDataType } from "../../types/activation-code";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import { request } from "../../api/config";

const AccessActivationCode = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accessData, setAccessData] = useState<AccessDataType | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const { code } = useParams();

  const getDetail = async () => {
    setLoading(true);
    try {
      const data = await getData(`/activation-code/${code}/access`);
      return data;
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.post(`/activation-code/access/${selected}/remove`);
      setSelected(null);
      setModalDelete(false);
    } catch (err) {}
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getDetail()]).then((res) => {
      setAccessData(res[0]);
      setLoading(false);
    });
  }, [loadingSubmit]);

  return (
    <>
      <Layout withPageTitle title={`Riwayat Akses ${accessData?.code}`}>
        <>
          {loading ? (
            <LoadingPage />
          ) : (
            <>
              <Table>
                <Table.Thead className="text-sm">
                  <Table.Th className="text-center">#</Table.Th>
                  <Table.Th className="">Tgl Akses / IP / Status</Table.Th>
                  <Table.Th className="">IP Detail</Table.Th>
                  <Table.Th className="">User Agent</Table.Th>
                  <Table.Th className="text-center">Opsi</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {accessData?.access?.map((item, key) => (
                    <Table.Tr>
                      <Table.Td className="text-center align-top">
                        {(key + 1).toString()}
                      </Table.Td>
                      <Table.Td className="align-top">
                        <>
                          <div>
                            {item.created_at ? parseDate(item.created_at) : "-"}
                          </div>
                          <span>IP: {item.ip}</span> <br />
                          <span
                            className={`${
                              item.is_active ? "bg-green-600" : "bg-red-600"
                            } text-white text-xs uppercase py-1 px-3 rounded`}
                          >
                            {item.is_active ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </>
                      </Table.Td>
                      <Table.Td className="align-top">
                        <>
                          {Object.entries(item.ip_detail).map(([key, ip]) => (
                            <ul>
                              <li key={key}>
                                <span className="capitalize">{key}</span> :{" "}
                                {String(ip)}
                              </li>
                            </ul>
                          ))}
                        </>
                      </Table.Td>
                      <Table.Td className="align-top">
                        <>
                          <span>
                            Browser: {item?.user_agent?.browser?.name ?? ""}
                            {", "}
                            versi {item?.user_agent?.browser?.version ?? ""}
                          </span>{" "}
                          <br />
                          <span>
                            OS/Platform:{" "}
                            {item?.user_agent?.platform?.name ?? ""}
                            {", "}
                            versi {item?.user_agent?.platform?.version ?? ""}
                          </span>
                        </>
                      </Table.Td>
                      <Table.Td className="align-top text-center">
                        <>
                          {item.is_active ? (
                            <Button
                              onClick={() => {
                                setSelected(item.id);
                                setModalDelete(true);
                              }}
                              className="text-sm px-4"
                              variant="danger"
                            >
                              Hapus Akses
                            </Button>
                          ) : (
                            <></>
                          )}
                        </>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </>
          )}
        </>

        <ModalDeleteConfirmation
          isOpen={modalDelete}
          close={() => setModalDelete(false)}
          subTitle="Akses Tes"
          loading={loadingSubmit}
          action={handleDelete}
        />
      </Layout>
    </>
  );
};

export default AccessActivationCode;

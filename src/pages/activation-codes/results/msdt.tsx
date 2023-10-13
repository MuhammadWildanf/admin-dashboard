import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const MsdtResult = ({ data }: Props) => {
  return (
    <>
      <div>
        {!data.result.value ? (
          <div className="py-2">
            <strong>{data.name}</strong> <br />
            <span>
              <i>Belum ada jawaban</i>
            </span>
          </div>
        ) : (
          <div className="w-full py-4">
            <div className="py-2 flex justify-between items-center">
              <strong>{data.name}</strong>
              <strong>
                Tipe: <span className="uppercase">{data.result.norma}</span>
              </strong>
            </div>
            <Table>
              <Table.Tbody>
                <>
                  {Array.from({ length: 8 }, (_, i) => (
                    <Table.Tr className="m-0" key={i}>
                      <Table.Td></Table.Td>
                      <>
                        {Array.from({ length: 8 }, (_, a) => (
                          <Table.Td className="text-center uppercase" key={a}>
                            <small className="text-xs">{a + 1 + i * 8}. </small>
                            {data.answer[a + i * 8]?.value}
                          </Table.Td>
                        ))}
                      </>
                    </Table.Tr>
                  ))}
                </>
                <Table.Tr
                  style={{ backgroundColor: "#f3f3f3" }}
                  className="font-weight-bold"
                >
                  <Table.Td className="text-center" style={{ width: "10%" }}>
                    A
                  </Table.Td>
                  <>
                    {data?.result?.value?.a?.map(
                      (value: string, aa: number) => (
                        <Table.Td
                          className="text-center text-uppercase"
                          key={aa}
                        >
                          {value}
                        </Table.Td>
                      )
                    )}
                  </>
                </Table.Tr>
                <Table.Tr
                  style={{ backgroundColor: "#f3f3f3" }}
                  className="font-weight-bold"
                >
                  <Table.Td className="text-center" style={{ width: "10%" }}>
                    B
                  </Table.Td>
                  <>
                    {data?.result?.value?.b?.map(
                      (value: string, aa: number) => (
                        <Table.Td
                          className="text-center text-uppercase"
                          key={aa}
                        >
                          {value}
                        </Table.Td>
                      )
                    )}
                  </>
                </Table.Tr>
                <Table.Tr
                  style={{ backgroundColor: "#f3f3f3" }}
                  className="font-weight-bold"
                >
                  <Table.Td className="text-center text-uppercase">
                    Koreksi
                  </Table.Td>
                  <Table.Td className="text-center">+1</Table.Td>
                  <Table.Td className="text-center">+2</Table.Td>
                  <Table.Td className="text-center">+1</Table.Td>
                  <Table.Td className="text-center">0</Table.Td>
                  <Table.Td className="text-center">+3</Table.Td>
                  <Table.Td className="text-center">-1</Table.Td>
                  <Table.Td className="text-center">0</Table.Td>
                  <Table.Td className="text-center">-4</Table.Td>
                </Table.Tr>

                <Table.Tr
                  style={{ backgroundColor: "#e6e6e6" }}
                  className="font-weight-bold"
                >
                  <Table.Td className="text-center text-uppercase">
                    Jumlah
                  </Table.Td>
                  <>
                    {Array.from({ length: 8 }, (_, index) => (
                      <Table.Td key={index} className="text-center">
                        {data?.result?.value.a[index] +
                          data?.result?.value.b[index] +
                          [1, 2, 1, 0, 3, -1, 0, -4][index]}
                      </Table.Td>
                    ))}
                  </>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default MsdtResult;

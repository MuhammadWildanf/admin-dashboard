import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const RmibResult = ({ data }: Props) => {
  return (
    <>
      <div>
        {!data.norma.result ? (
          <span>
            <i>Belum ada jawaban</i>
          </span>
        ) : (
          <div className="w-full py-4">
            <strong>{data.name}</strong>
            <Table>
              <Table.Thead>
                <Table.Th>Tugas</Table.Th>
                <Table.Th className="text-center">A</Table.Th>
                <Table.Th className="text-center">B</Table.Th>
                <Table.Th className="text-center">C</Table.Th>
                <Table.Th className="text-center">D</Table.Th>
                <Table.Th className="text-center">E</Table.Th>
                <Table.Th className="text-center">F</Table.Th>
                <Table.Th className="text-center">G</Table.Th>
                <Table.Th className="text-center">H</Table.Th>
                <Table.Th className="text-center">Hasil</Table.Th>
                <Table.Th className="text-center">Ranking</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {data?.norma?.result.map((item: any, key: number) => (
                  <Table.Tr
                    className={`${
                      data?.norma?.ranking.includes(key) && "bg-gray-200"
                    }`}
                  >
                    <>
                      {item.map((sub: any, key: number) => (
                        <Table.Td
                          key={key}
                          className={`${
                            key === 0 ? "text-left" : "text-center"
                          }  `}
                        >
                          {sub}
                        </Table.Td>
                      ))}
                      {
                        <Table.Td className="text-center">
                          {data.norma?.ranking.includes(key) &&
                            data.norma?.ranking.indexOf(key) + 1}
                        </Table.Td>
                      }
                    </>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default RmibResult;

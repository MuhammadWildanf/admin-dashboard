import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const ISTResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full py-2">
        <Table>
          <Table.Thead>
            <Table.Th>{data.name}</Table.Th>
            <Table.Td className="text-center">RW</Table.Td>
            <Table.Td className="text-center">SW</Table.Td>
          </Table.Thead>
          {data.list.map((item: any, key: number) => (
            <Table.Tr>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td className="text-center" style={{ width: "10%" }}>
                {item.result}
              </Table.Td>
              <Table.Td className="text-center" style={{ width: "10%" }}>
                {item.norma}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
        <Table>
          <Table.Thead>
            <Table.Th>Akumulasi {data.name}</Table.Th>
            <Table.Th className="text-center" style={{ width: "10%" }}>
              SW: {data?.result?.sw ?? "-"}
            </Table.Th>
            <Table.Th className="text-center" style={{ width: "10%" }}>
              IQ: {data?.result?.iq ?? "-"}
            </Table.Th>
            <Table.Th className="text-center" style={{ width: "10%" }}>
              %: {data?.result?.percent ?? "-"}
            </Table.Th>
          </Table.Thead>
        </Table>
      </div>
    </>
  );
};

export default ISTResult;

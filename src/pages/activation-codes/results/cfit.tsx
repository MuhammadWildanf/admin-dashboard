import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const CfitResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full py-2">
        <strong>{data.name}</strong>
        <Table>
          {data.list.map((item: any, key: number) => (
            <Table.Tr>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td className="text-right">
                <span className="bg-blue-600 text-white rounded py-1 px-2">
                  {item.result}
                </span>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table>
        <Table>
          <Table.Thead>
            <Table.Th>Akumulasi {data.name}</Table.Th>
            <Table.Th>Skor: {data?.result?.correct ?? "-"}</Table.Th>
            <Table.Th>IQ: {data?.result?.norma ?? "-"}</Table.Th>
          </Table.Thead>
        </Table>
      </div>
    </>
  );
};

export default CfitResult;

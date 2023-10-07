import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const EppsResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full py-4">
        <Table>
          <Table.Thead>
            <Table.Th>{data.name}</Table.Th>
            <Table.Th className="text-center">r</Table.Th>
            <Table.Th className="text-center">c</Table.Th>
            <Table.Th className="text-center">s</Table.Th>
            <Table.Th className="text-center">ss</Table.Th>
          </Table.Thead>
          {data?.norma?.list?.map((item: any, key: number) => (
            <Table.Tr key={key}>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td className="text-center">{item.r}</Table.Td>
              <Table.Td className="text-center">{item.c}</Table.Td>
              <Table.Td className="text-center">{item.s}</Table.Td>
              <Table.Td className="text-center">{item.ss}</Table.Td>
            </Table.Tr>
          ))}
        </Table>
      </div>
    </>
  );
};

export default EppsResult;

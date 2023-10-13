import { Check } from "@phosphor-icons/react";
import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const McResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full py-2 mt-4">
        <div className="flex justify-between items-center">
          <strong>{data.name}</strong>
          <div className="flex items-center gap-2">
            <div>Score: </div>
            <span className="px-2 rounded bg-blue-600 text-white">
              {data?.score ?? 0}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <Table>
          <Table.Thead>
            <Table.Th>Pertanyaan</Table.Th>
            <Table.Th>Key</Table.Th>
            <Table.Th>Jawaban</Table.Th>
            <Table.Th></Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {data?.answers?.map((item: any, key: number) => (
              <Table.Tr
                key={key}
                className={`${
                  item.answer === parseInt(item.key) ? "bg-gray-200" : ""
                }`}
              >
                <Table.Td>{item.question?.text ?? "-"}</Table.Td>
                <Table.Td className="text-center">{item.key ?? "-"}</Table.Td>
                <Table.Td className="text-center">
                  {item.answer ?? "-"}
                </Table.Td>
                <Table.Td>
                  {item.answer === parseInt(item.key) ? (
                    <Check className="text-green-600" />
                  ) : (
                    ""
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};

export default McResult;

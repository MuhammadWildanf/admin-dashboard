import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const PapiResult = ({ data }: Props) => {
  console.log(data);
  return (
    <>
      <div>
        {!data.result ? (
          <span>
            <i>Belum ada jawaban</i>
          </span>
        ) : (
          <div className="w-full py-4">
            <strong>{data.name}</strong>
            <Table>
              <Table.Tbody>
                {data?.result?.desc.map((item: any, key: number) => (
                  <Table.Tr key={key}>
                    <Table.Td className="uppercase">{item.key ?? ""}</Table.Td>
                    <Table.Td className="uppercase">
                      {item.short_desc ?? ""}
                    </Table.Td>
                    <Table.Td className="uppercase">
                      {data?.result?.vals[item.key] ?? ""}
                    </Table.Td>
                    <Table.Td className="capitalize">
                      {item.desc ?? ""}
                    </Table.Td>
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

export default PapiResult;

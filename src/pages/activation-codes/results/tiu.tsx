import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Table from "../../../components/tables/base";

type Props = {
  data: any;
};

const TiuResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full">
        <div className="py-2 flex items-center justify-between">
          <strong>{data.name}</strong>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white py-1 px-3 rounded">
              Score: <strong>{data?.result ?? ""}</strong>
            </div>
            <div className="bg-blue-600 text-white py-1 px-3 rounded">
              SS: <strong>{data?.norma?.result ?? ""}</strong>
            </div>
          </div>
        </div>
        <div className="">
          <table className="w-full">
            <tr className="text-sm border">
              <td rowSpan={2} className="border text-center py-2">
                TIU-5
              </td>
              <td rowSpan={2} className="border text-center py-2">
                SS
              </td>
              <td colSpan={2} className="border text-center py-2">
                Rendah
              </td>
              <td colSpan={2} className="border text-center py-2">
                Sedang
              </td>
              <td colSpan={2} className="border text-center py-2">
                Rendah
              </td>
            </tr>
            <tr className="text-sm border">
              <td className="border text-center py-2">1</td>
              <td className="border text-center py-2">2</td>
              <td className="border text-center py-2">1</td>
              <td className="border text-center py-2">2</td>
              <td className="border text-center py-2">1</td>
              <td className="border text-center py-2">2</td>
            </tr>
            {data?.norma?.table[0]?.map((item: any, key: number) => (
              <tr key={key} className="border">
                <td className="border text-center">
                  {data?.norma?.table[0][key]}
                </td>
                <td className="border text-center">
                  {data?.norma?.table[1][key]}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "rendah-1" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "rendah-2" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "sedang-1" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "sedang-2" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "tinggi-1" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
                <td className="border" style={{ width: "10%" }}>
                  {(() => {
                    let parse = data?.norma?.table[1][key].split("-");
                    if (
                      data?.norma?.grade === "tinggi-2" &&
                      data?.norma?.result >= parseInt(parse[0]) &&
                      data?.norma?.result <= parseInt(parse[1])
                    ) {
                      return (
                        <div className="flex items-center justify-center">
                          <CheckCircle size={22} />
                        </div>
                      );
                    }

                    return <></>;
                  })()}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default TiuResult;

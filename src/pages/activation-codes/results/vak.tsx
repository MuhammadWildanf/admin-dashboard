import Table from "../../../components/tables/base";

type Props = {
  data: {
    name: string;
    result: {
      score: {
        [key: string]: number;
      };
      total: { [key: string]: number }[];
    };
  };
};

const VakResult = ({ data }: Props) => {
  return (
    <>
      <div className="w-full flex items-center justify-between py-2">
        <strong>{data.name}</strong>
        <div className="flex items-center uppercase gap-1">
          {Object.entries(data.result?.score).map(([key, value]) => (
            <div key={key} className="py-1 px-3 rounded bg-gray-100">
              <p>
                {key}: {value}
              </p>
            </div>
          ))}
          <span
            className="bg-primary px-3 py-1 text-white rounded ml-3"
            style={{ fontSize: "12pt" }}
          >
            {Object.entries(data.result?.total[0]).map(([key, value]) => (
              <span
                key={key}
                className="bg-blue-600 px-3 py-1 text-white rounded ml-3"
                style={{ fontSize: "12pt" }}
              >
                {key === "k"
                  ? "Kinesthetic"
                  : key === "a"
                  ? "Auditory"
                  : key === "v"
                  ? "Visual"
                  : ""}
              </span>
            ))}
          </span>
        </div>
      </div>
    </>
  );
};

export default VakResult;

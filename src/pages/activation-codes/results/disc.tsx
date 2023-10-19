import { useRef } from "react";
import Table from "../../../components/tables/base";
import { Chart as ChartDOM } from "react-chartjs-2";
import { Chart as ChartJs, ChartArea, ChartData } from "chart.js";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useLocation } from "react-router-dom";

type Props = {
  data: any;
};
Chart.register(CategoryScale);
const DiscResult = ({ data }: Props) => {
  const chartRef = useRef<ChartJs>(null);

  const labels = ["D", "I", "S", "C"];
  const getUrl = useLocation();

  return (
    <>
      <div>
        {!data.result ? (
          <span>
            <i>Belum ada jawaban</i>
          </span>
        ) : (
          <div>
            <div className="py-2">
              <Table>
                <Table.Thead>
                  <Table.Th className="text-center">Line</Table.Th>
                  <Table.Th className="text-center">D</Table.Th>
                  <Table.Th className="text-center">I</Table.Th>
                  <Table.Th className="text-center">S</Table.Th>
                  <Table.Th className="text-center">C</Table.Th>
                  <Table.Th className="text-center">*</Table.Th>
                  <Table.Th className="text-center">Jml</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  <>
                    {data?.result?.disc.map((item: any, key: number) => (
                      <Table.Tr>
                        <Table.Td className="text-center">
                          {(key + 1).toString()}
                        </Table.Td>
                        <Table.Td className="text-center">{item[0]}</Table.Td>
                        <Table.Td className="text-center">
                          {data?.result?.disc[key][1]}
                        </Table.Td>
                        <Table.Td className="text-center">
                          {data?.result?.disc[key][2]}
                        </Table.Td>
                        <Table.Td className="text-center">
                          {data?.result?.disc[key][3]}
                        </Table.Td>
                        <Table.Td
                          className={`${
                            key === 2 && "bg-gray-300"
                          } text-center`}
                        >
                          {data?.result?.disc[key][4] ?? ""}
                        </Table.Td>
                        <Table.Td
                          className={`${
                            key === 2 && "bg-gray-300"
                          } text-center`}
                        >
                          {key === 2 ? "" : "24"}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </>
                </Table.Tbody>
              </Table>
            </div>
            <div
              className={`w-full gap-3 py-4 ${
                getUrl.pathname.split("/")[3] === "print"
                  ? "flex items-start gap-3"
                  : " grid grid-cols-3"
              }`}
            >
              <div>
                <div className="mb-3">
                  <h5 className="m-0 text-center">Graph 1 MOST</h5>
                  <p className="text-center m-0">Mask, Public Self</p>
                </div>
                <ChartDOM
                  type="line"
                  ref={chartRef}
                  height={`${
                    getUrl.pathname.split("/")[3] === "print"
                      ? "420px"
                      : "500px"
                  }`}
                  width={`${
                    getUrl.pathname.split("/")[3] === "print" ? "250px" : ""
                  }`}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "",
                        data: data?.result?.chart[0],
                        borderColor: "gray",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: {
                          font: {
                            size: 8,
                          },
                        },
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 8,
                        min: -8,
                        type: "linear",
                        grace: "1%",
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>

              <div>
                <div className="mb-3">
                  <h5 className="m-0 text-center">Graph 2 LEAST</h5>
                  <p className="text-center m-0">Core, Private Self</p>
                </div>
                <ChartDOM
                  type="line"
                  ref={chartRef}
                  height={`${
                    getUrl.pathname.split("/")[3] === "print"
                      ? "420px"
                      : "500px"
                  }`}
                  width={`${
                    getUrl.pathname.split("/")[3] === "print" ? "250px" : ""
                  }`}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "",
                        data: data?.result?.chart[1],
                        borderColor: "gray",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: {
                          font: {
                            size: 8,
                          },
                        },
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 8,
                        min: -8,
                        type: "linear",
                        grace: "1%",
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>

              <div>
                <div className="mb-3">
                  <h5 className="m-0 text-center">Graph 3 CHANGE</h5>
                  <p className="text-center m-0">Mirror, Perceived Self</p>
                </div>
                <ChartDOM
                  type="line"
                  ref={chartRef}
                  height={`${
                    getUrl.pathname.split("/")[3] === "print"
                      ? "420px"
                      : "500px"
                  }`}
                  width={`${
                    getUrl.pathname.split("/")[3] === "print" ? "250px" : ""
                  }`}
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "",
                        data: data?.result?.chart[2],
                        borderColor: "gray",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        labels: {
                          font: {
                            size: 8,
                          },
                        },
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 8,
                        min: -8,
                        type: "linear",
                        grace: "1%",
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DiscResult;

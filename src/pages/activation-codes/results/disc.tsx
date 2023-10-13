import { useRef } from "react";
import Table from "../../../components/tables/base";
import { Chart as ChartDOM } from "react-chartjs-2";
import { Chart as ChartJs, ChartArea, ChartData } from "chart.js";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

type Props = {
  data: any;
};
Chart.register(CategoryScale);
const DiscResult = ({ data }: Props) => {
  const chartRef = useRef<ChartJs>(null);
  const labels = ["D", "I", "S", "C"];
  return (
    <>
      <div>
        {!data.result ? (
          <span>
            <i>Belum ada jawaban</i>
          </span>
        ) : (
          <div className="w-full grid grid-cols-3 gap-3 py-4">
            <div>
              <div className="mb-3">
                <h5 className="m-0 text-center">Graph 1 MOST</h5>
                <p className="text-center m-0">Mask, Public Self</p>
              </div>
              <ChartDOM
                type="line"
                ref={chartRef}
                height={"300px"}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "",
                      data: data?.result[0],
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
                height={"300px"}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "",
                      data: data?.result[1],
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
                height={"300px"}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: "",
                      data: data?.result[2],
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
        )}
      </div>
    </>
  );
};

export default DiscResult;

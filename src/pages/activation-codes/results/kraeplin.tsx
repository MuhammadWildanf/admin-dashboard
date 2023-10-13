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
const KraeplinResult = ({ data }: Props) => {
  const chartRef = useRef<ChartJs>(null);
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
              <Table.Thead>
                <Table.Th className="text-center">Jumlah Hitungan</Table.Th>
                <Table.Th className="text-center">Jumlah Kesalahan</Table.Th>
                <Table.Th className="text-center">Puncak Tertinggi</Table.Th>
                <Table.Th className="text-center">Puncak Terendah</Table.Th>
                <Table.Th className="text-center">
                  Rata-rata tiap Menit
                </Table.Th>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="text-center">
                    {data?.result?.total}
                  </Table.Td>
                  <Table.Td className="text-center">
                    {data?.result?.wrong}
                  </Table.Td>
                  <Table.Td className="text-center">
                    {data?.result?.highest}
                  </Table.Td>
                  <Table.Td className="text-center">
                    {data?.result?.lowest}
                  </Table.Td>
                  <Table.Td className="text-center">
                    {data?.result?.avgPerMins}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}

        <div className="mt-3 w-full">
          <ChartDOM
            type="line"
            ref={chartRef}
            data={{
              labels: data?.norma?.labels,
              datasets: [
                {
                  label: "Jumlah",
                  data: data?.norma?.values,
                  borderColor: "black",
                },
                {
                  label: "Garis Timbang",
                  data: data?.norma?.garisTimbang,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 10,
                    },
                  },
                },
              },
              scales: {
                y: {
                  type: "linear",
                  // grace: '5%',
                  beginAtZero: true,
                  max: 30,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default KraeplinResult;

import { HiSearch } from "react-icons/hi";
import { Button } from "../../components/buttons";
import { DateRangeForm } from "../../components/forms/input-daterange";
import Layout from "../layout.tsx/app";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import moment, { invalid } from "moment";
import { Line } from "react-chartjs-2";
import { currency, formatToUnit } from "../../helper/currency";
import { Tick } from "chart.js";
import { request } from "../../api/config";

type FormValues = {
  start_at: Date;
  end_at: Date;
};

const JournalIndex = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [income, setIncome] = useState<number>(0);
  const [receivable, setReceivable] = useState<number>(0);
  const [filterIncome, setFilterIncome] = useState<string>("30d");
  const [filterReceivable, setFilterReceivable] = useState<string>("30d");
  const [data, setData] = useState<any>({ labels: [], datasets: [] });

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      start_at: new Date(moment().subtract(1, "month").format("YYYY-MM-DD")),
      end_at: new Date(moment().format("YYYY-MM-DD")),
    },
  });

  const getChartData = async () => {
    setLoading(true);
    try {
      const { data } = await request.get(`journal`);
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  const getIncome = async () => {
    setLoading(true);
    try {
      const { data } = await request.get(`journal/income`, {
        params: {
          filterBy: filterIncome,
        },
      });
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  const getRecivable = async () => {
    setLoading(true);
    try {
      const { data } = await request.get(`journal/receivable`, {
        params: {
          filterBy: filterReceivable,
        },
      });
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([getIncome()]).then((res) => {
      setIncome(res[0]);
    });
  }, [filterIncome]);

  useEffect(() => {
    Promise.all([getRecivable()]).then((res) => {
      setReceivable(res[0]);
    });
  }, [filterReceivable]);

  useEffect(() => {
    Promise.all([getChartData()]).then((res) => {
      setData(res[0]);
    });
    setLoading(false);
  }, [loading]);

  return (
    <Layout
      withPageTitle
      title={<div className="leading-none">Dasbor Jurnal Keuangan</div>}
    >
      <div className="mb-3 w-full grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 rounded-xl bg-green-50">
          <div className="flex items-center justify-between">
            <span>Uang Masuk</span>
            <select
              name=""
              id=""
              className="border-gray-300 rounded-xl py-1 px-3 text-sm"
              defaultValue="30d"
              onChange={(e) => setFilterIncome(e.target.value)}
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="60d">60 Hari Terakhir</option>
              <option value="90d">90 Hari Terakhir</option>
              <option value="6m">6 Bulan Terakhir</option>
              <option value="1y">1 Tahun Terakhir</option>
            </select>
          </div>

          <div className="mt-1 text-green-700 font-bold text-2xl">
            {currency(income ?? 0)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-yellow-50">
          <div className="flex items-center justify-between">
            <span>Receivable</span>
            <select
              name=""
              id=""
              className="border-gray-300 rounded-xl py-1 px-3 text-sm"
              defaultValue="30d"
              onChange={(e) => setFilterReceivable(e.target.value)}
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="60d">60 Hari Terakhir</option>
              <option value="90d">90 Hari Terakhir</option>
              <option value="6m">6 Bulan Terakhir</option>
              <option value="1y">1 Tahun Terakhir</option>
            </select>
          </div>

          <div className="mt-1 text-yellow-700 font-bold text-2xl">
            {currency(receivable ?? 0)}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="font-bold">Grafik Arus Keuangan</span>
        </div>
        {!loading && (
          <Line
            data={data}
            height={"120px"}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (
                      value: string | number,
                      index: number,
                      ticks: Tick[]
                    ) => formatToUnit(value as number),
                  },
                },
              },
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default JournalIndex;

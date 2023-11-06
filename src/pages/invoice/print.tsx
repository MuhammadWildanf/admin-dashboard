import React, { useEffect, useState } from "react";
import { request } from "../../api/config";
import { useInvoice } from "../../stores/invoice";
import { useParams } from "react-router-dom";
import moment from "moment";
import { currency } from "../../helper/currency";

const InvoicePrint: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { setInvoice, invoice } = useInvoice();
  const { invoiceId } = useParams();

  const getInvoice = async () => {
    try {
      const { data } = await request.get(
        `invoice/get-by-invoicenum/${invoiceId}`
      );
      return data.data;
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    Promise.all([getInvoice()]).then((res) => {
      setInvoice(res[0]);
    });
  }, []);

  // useEffect(() => {
  //   window.print();
  // }, [loading]);

  return (
    <div className="container py-5" style={{ margin: 0 }}>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2">
          <img src="/images/logo.png" alt="" className="w-64" />
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold">Invoice</h2>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="w-1/3">Tanggal:</td>
                <td className="w-2/3">
                  {invoice?.created_at
                    ? moment(invoice?.created_at).format("DD MMM YYYY, HH:ss")
                    : ""}
                </td>
              </tr>
              <tr>
                <td className="w-1/3">Nomor:</td>
                <td className="w-2/3">{invoice?.invoice_number}</td>
              </tr>
              <tr className="bg-blue-200">
                <td className="w-1/3">Tanggal:</td>
                <td className="w-2/3">
                  {invoice?.due_date
                    ? moment(invoice?.due_date).format("DD MMM YYYY, HH:ss")
                    : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap mt-3">
        <div className="w-full md:w-1/2">
          <div className="bg-blue-200 py-2 px-2 mb-2">
            Nama Perusahaan yang ditagihkan:
          </div>
          <strong className="block">{invoice?.payer_name}</strong>
          <p className="m-0">{invoice?.payer_address}</p>
        </div>
      </div>

      <div className="mt-3">
        <table className="table-auto border border-collapse w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2">Keterangan</th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2 text-center">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2 text-right">
                  {item.price ? currency(item.price) : "Rp. 0"}
                </td>
                <td className="px-4 py-2">{item.amount}</td>
                <td className="px-4 py-2 text-right">
                  {item.total_price ? currency(item.total_price) : "Rp. 0"}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="text-right">
                Sub Total
              </td>
              <td className="px-4 py-2 text-right">
                {invoice?.sub_total ? currency(invoice?.sub_total) : "Rp. 0"}
              </td>
            </tr>
            {invoice?.taxes && (
              <>
                {invoice.taxes.map((tax, index) => (
                  <tr key={index}>
                    <td colSpan={3} className="text-right">
                      {tax.name} ({tax.percent}%)
                    </td>
                    <td className="px-4 py-2 text-right">
                      {tax?.total ? currency(tax?.total) : "Rp. 0"}
                    </td>
                  </tr>
                ))}
              </>
            )}
            <tr>
              <td colSpan={3} className="text-right">
                Total Yang Harus Dibayar
              </td>
              <td className="px-4 py-2 text-right">
                {invoice?.grand_total
                  ? currency(invoice?.grand_total)
                  : "Rp. 0"}
              </td>
            </tr>
            <tr>
              <td className="text-right">Dalam Kalimat</td>
              <td colSpan={3} className="px-4 py-2 text-right text-capitalize">
                {invoice?.terbilang}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap mt-5">
        {invoice?.notes && (
          <div className="w-full md:w-1/2">
            <div className="border border-blue-200 p-4">{invoice.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePrint;

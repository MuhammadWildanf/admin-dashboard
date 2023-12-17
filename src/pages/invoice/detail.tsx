import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../layout.tsx/app";
import { useInvoice } from "../../stores/invoice";
import { parseDate } from "../../helper/date";
import { request } from "../../api/config";
import { useEffect, useState } from "react";
import { formatPhoneNumber } from "../../helper/phone";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import { Button } from "../../components/buttons";
import { useAlert } from "../../stores/alert";
import { Spinner } from "flowbite-react";
import { HiPrinter, HiTrash } from "react-icons/hi";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import { File } from "@phosphor-icons/react";

const InvoiceDetail = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalConfirm, setModalConfirm] = useState<boolean>(false);

  const { invoiceId } = useParams();

  const { setInvoice, invoice } = useInvoice();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const getInvoice = async () => {
    try {
      const { data } = await request.get(
        `invoice/get-by-invoicenum/${invoiceId}`
      );
      return data.data;
    } catch (err: any) {
      if (err.response.status === 404) {
        return navigate("/not-found");
      }
    }
  };

  const handlePrint = async () => {
    setLoadingExport(true);
    try {
      const response = await request.get(`invoice/${invoice?.id}/pdf`, {
        responseType: "arraybuffer",
      });

      // Create a Blob from the raw data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice #${invoiceId}.pdf`);

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (err: any) {
      if (err.response.status === 404) {
        return navigate("/not-found");
      }
    }
    setLoadingExport(false);
  };

  const handleCreateXenditLink = async () => {
    setLoadingSubmit(true);
    try {
      await request.post(`invoice/create-xendit/${invoice?.id}`).then(() => {
        setMessage("Yeey, berhasil membuat link pembayaran", "success");
      });
    } catch (err: any) {
      setMessage(
        "Oops, gagal membuat link Xendit! Mungkin invoice ini sudah memiliki Link",
        "error"
      );
    }
    setLoadingSubmit(false);
  };

  const handleDelete = async () => {
    try {
      await request.delete(`invoice/${invoice?.id}/destroy`).then(() => {
        navigate("/invoice");
        setMessage("Berhasil menghapus!", "success");
      });
    } catch (err: any) {
      setMessage("Oops, something went wrong", "error");
    }
    // setModalDelete(false);
    setLoadingSubmit(false);
  };

  const handleUpdateStatus = async () => {
    setLoadingSubmit(true);
    try {
      await request.post(`invoice/${invoice?.id}/update-status`).then(() => {
        setMessage("Berhasil merubah status", "success");
      });
    } catch (err: any) {
      setMessage("Oops, something went wrong!", "error");
    }
    setModalConfirm(false);
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getInvoice()]).then((res) => {
      setInvoice(res[0]);
    });
    setLoading(false);
  }, [loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title={
        <div className="leading-none">
          <div className="flex items-center gap-2">
            <span>Invoice {invoiceId} </span>
            <span
              className={`py-1 px-4 rounded-lg text-sm font-bold ${
                invoice?.status === "UNPAID" && "bg-yellow-100 text-yellow-600"
              } ${invoice?.status === "PAID" && "bg-green-100 text-green-600"}`}
            >
              {invoice?.status}
              {invoice?.status === "PAID" &&
                ` at (${invoice?.paid_at ? parseDate(invoice?.paid_at) : "-"})`}
            </span>
          </div>
          <small className="font-medium text-sm">
            Diterbitkan pada:{" "}
            {invoice?.created_at ? parseDate(invoice?.created_at) : "-"}
          </small>
        </div>
      }
      pageTitleContent={
        <div className="flex items-center gap-1">
          <Button className="px-5">
            <div
              className="flex items-center gap-2 text-sm"
              onClick={handlePrint}
            >
              {loadingExport ? (
                <Spinner />
              ) : (
                <>
                  <HiPrinter /> Print
                </>
              )}
            </div>
          </Button>
          <Button
            onClick={() => setModalConfirm(true)}
            className="px-4 text-sm bg-gray-600 hover:bg-gray-700"
          >
            Ubah Status Pembayaran
          </Button>
          {invoice?.status === "UNPAID" && !invoice.xenditPayment && (
            <Button
              onClick={() => navigate(`/invoice/${invoiceId}/edit`)}
              className="px-4 text-sm bg-purple-600 hover:bg-purple-700"
            >
              Edit Invoice
            </Button>
          )}
          <Button
            className="px-4 text-sm bg-red-600 hover:bg-red-700"
            onClick={() => setModalDelete(true)}
          >
            <div className="flex items-center gap-2 text-sm">
              <HiTrash /> Hapus!
            </div>
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 items-start md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="leading-5 md:col-span-2">
              <small>Ditagihkan kepada:</small> <br />
              <span>
                {invoice?.payer_name}{" "}
                {invoice?.payer_company && ` - ${invoice?.payer_company}`}
              </span>
            </div>
            <div className="leading-5">
              <small>Tgl Jatuh Tempo:</small> <br />
              <span>
                {invoice?.due_date ? parseDate(invoice?.due_date) : "-"}
              </span>
            </div>
            <div className="leading-5 md:col-span-2">
              <small>Alamat:</small> <br />
              <span>{invoice?.payer_address}</span>
            </div>
            <div className="leading-5">
              <small>Email / Phone:</small> <br />
              <span>
                {invoice?.payer_email}{" "}
                {invoice?.payer_phone && (
                  <>
                    {" - "}
                    <a
                      href={`https://wa.me/${formatPhoneNumber(
                        invoice?.payer_phone
                      )}`}
                      rel="noreferrer"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {invoice?.payer_phone}
                    </a>{" "}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="border p-3 rounded-lg">
          <strong className="text-sm">Link Pembayaran:</strong> <br />
          {invoice?.xenditPayment ? (
            <Link
              to={invoice?.xenditPayment?.invoice_url ?? ""}
              target="_blank"
              className="bg-gray-100 rounded-lg hover:bg-gray-200 block mt-1 cursor-pointer p-2"
            >
              {invoice?.xenditPayment && (
                <span className="break-all overflow-ellipsis">
                  {invoice?.xenditPayment?.invoice_url}
                </span>
              )}
            </Link>
          ) : (
            <Button
              className="text-xs uppercase py-2 w-full mt-2"
              onClick={handleCreateXenditLink}
            >
              {loadingSubmit ? <Spinner /> : "Buat link pembayaran"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        <div className="md:col-span-2">
          <div className="">
            <strong>Items: </strong>
            <Table className="mt-2 bg-gray-50">
              <Table.Thead>
                <Table.Th className="text-center">No</Table.Th>
                <Table.Th className="text-center">Item</Table.Th>
                <Table.Th className="text-right">Harga</Table.Th>
                <Table.Th className="text-center">Jumlah</Table.Th>
                <Table.Th className="text-right">Sub Total</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {invoice?.items.map((item, key) => (
                  <Table.Tr>
                    <Table.Td className="text-center">
                      <>{key + 1}</>
                    </Table.Td>
                    <Table.Td>{item.description}</Table.Td>
                    <Table.Td className="text-right">
                      {item.price ? currency(item.price) : "Rp. 0"}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <>{item.amount}</>
                    </Table.Td>
                    <Table.Td className="text-right">
                      <>
                        {item.price &&
                          item.amount &&
                          currency(item.price * item.amount)}
                      </>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Tbody className="bg-gray-100">
                <Table.Tr>
                  <Table.Td className="font-semibold" cols={4}>
                    Sub Total
                  </Table.Td>
                  <Table.Td className="font-semibold text-right" cols={4}>
                    {invoice?.sub_total
                      ? currency(invoice?.sub_total)
                      : "Rp. 0"}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody>
                {invoice?.taxes.map((tax, key) => (
                  <Table.Tr>
                    <Table.Td className="" cols={4}>
                      <>
                        {tax.name} ({tax.percent}%)
                      </>
                    </Table.Td>
                    <Table.Td className="text-right">
                      <>
                        {tax.type === "min" ? (
                          <>({tax.total && currency(tax.total)})</>
                        ) : (
                          <>{tax.total && currency(tax.total)}</>
                        )}
                      </>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
              <Table.Tbody className="bg-gray-100">
                <Table.Tr>
                  <Table.Td className="font-semibold" cols={4}>
                    Grand Total
                  </Table.Td>
                  <Table.Td className="font-extrabold text-right" cols={4}>
                    {invoice?.grand_total
                      ? currency(invoice?.grand_total)
                      : "Rp. 0"}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody className="bg-gray-100">
                <Table.Tr>
                  <Table.Td className="font-semibold" cols={5}>
                    <small>Terbilang:</small>
                    <br />
                    <span>{invoice?.terbilang}</span>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>

        <div>
          <div>
            <strong>Bukti Pembayaran</strong>
            {(!invoice?.transfer_proof || !invoice?.pph_proof) && (
              <div className="py-2">
                Belum ada bukti transfer ataupun potongan PPh
              </div>
            )}
            <div className="mt-2">
              {invoice?.transfer_proof && (
                <a
                  href={invoice?.transfer_proof ?? "#"}
                  rel="noreferrer"
                  target="_blank"
                  className="p-1 mb-2 hover:bg-gray-100 cursor-pointer rounded border border-gray-200 flex items-center text-sm gap-3"
                >
                  <File size={18} /> <span>File bukti transfer</span>
                </a>
              )}
              {invoice?.pph_proof && (
                <a
                  href={invoice?.pph_proof ?? "#"}
                  rel="noreferrer"
                  target="_blank"
                  className="p-1 mb-2 hover:bg-gray-100 cursor-pointer rounded border border-gray-200 flex items-center text-sm gap-3"
                >
                  <File size={18} /> <span>File bukti potongan PPh</span>
                </a>
              )}
            </div>
          </div>
          <div className="mt-3">
            <strong>Catatan:</strong>
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              {invoice?.notes ? (
                <div
                  dangerouslySetInnerHTML={{ __html: invoice?.notes ?? "" }}
                ></div>
              ) : (
                <span className="italic text-sm">Tidak ada catatan</span>
              )}
            </div>
            <div className="mt-5">
              <strong className="text-sm">Mengetahui:</strong> <br />
              <span>
                {invoice?.signed_by.name} - {invoice?.signed_by.title}
              </span>
            </div>
          </div>
        </div>

        {invoice?.attachment && invoice?.attachment?.length !== 0 && (
          <div className="md:col-span-2">
            <strong>Lampiran:</strong>
            <Table className="mt-2">
              <Table.Thead>
                <Table.Th>No</Table.Th>
                <Table.Th>Nama Peserta</Table.Th>
                <Table.Th>Modul</Table.Th>
                <Table.Th>Tgl Tes</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {invoice?.attachment?.map((item, key) => (
                  <Table.Tr>
                    <Table.Td>
                      <>{key + 1}</>
                    </Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.module}</Table.Td>
                    <Table.Td>{item.test_date}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle={`Invoice ${invoice?.invoice_number}`}
        action={handleDelete}
        loading={loadingSubmit}
      />

      <BaseModal isOpen={modalConfirm} close={() => setModalConfirm(false)}>
        <span className="text-lg">
          Yakin ingin merubah status pembayaran ini?
        </span>
        <div className="flex justify-end mt-4 items-right">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setModalConfirm(false)}
              variant="danger"
              className="px-4"
            >
              Batal
            </Button>
            <Button onClick={handleUpdateStatus} className="px-12">
              {loadingSubmit ? <Spinner /> : "Iya!"}
            </Button>
          </div>
        </div>
      </BaseModal>
    </Layout>
  );
};

export default InvoiceDetail;

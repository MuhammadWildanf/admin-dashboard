import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import Table from "../../components/tables/base";
import { currency, terbilang } from "../../helper/currency";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Checkbox, Label, Spinner } from "flowbite-react";
import { FormInput, FormInputCurrency } from "../../components/forms/input";
import { HiExclamationCircle, HiTrash } from "react-icons/hi";
import { Button } from "../../components/buttons";
import { FormSelectAsync } from "../../components/forms/input-select";
import { request } from "../../api/config";
import { Editor } from "@tinymce/tinymce-react";
import { ErrorForm, InvoiceValuesType } from "../../types/forms/invoice";
import { useSession } from "../../stores/session";

const CreateBlankInvoice = () => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [subTotal, setSubTotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<
    { name: string; type: string; amount: number }[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [terbilangField, setTerbilangField] = useState<string>("");
  const [errors, setErrors] = useState<ErrorForm | null>(null);

  const { me } = useSession();
  const navigate = useNavigate();

  const forms = useForm<InvoiceValuesType>();
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: forms.control,
    name: "items",
  });

  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control: forms.control,
    name: "participants",
  });

  const selectCompanies = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/select/companies", {
      params: params,
    });
    return data.data;
  };

  const selectTaxes = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/select/taxes", {
      params: params,
    });
    return data.data;
  };

  const handleCountSubTotal = () => {
    let countSubTotal = 0;
    forms.watch("items").forEach((i) => {
      countSubTotal += i.amount * parseInt(i.price);
    });

    setSubTotal(countSubTotal);
    handleCountTax();
    handleCountTotal();
  };

  const handleCountTax = () => {
    let getTaxes: { name: string; type: string; amount: number }[] = [];
    forms.watch("taxes")?.forEach((tax: any) => {
      getTaxes.push({
        name: `${tax.name} (${tax.percent}%)`,
        type: tax.type ?? "",
        amount: Math.ceil(subTotal * (tax.percent / 100)),
      });
    });
    setTaxes(getTaxes);
    handleCountTotal();
  };

  const handleCountTotal = () => {
    let countTaxes = 0;
    taxes.forEach((t) => {
      if (t.type === "min") {
        countTaxes -= t.amount;
      } else if (t.type === "plus") {
        countTaxes += t.amount;
      }
    });
    setTotal(Math.ceil(subTotal + countTaxes));
    setTerbilangField(`${terbilang(subTotal + countTaxes)} Rupiah`);
    forms.setValue("terbilang", `${terbilang(subTotal + countTaxes)} Rupiah`);
  };

  const handleSave = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    console.log(data);
    try {
      let payload = {
        ...data,
        company_id: data.company_id?.id ?? "",
      };
      // console.log(payload);
      const res = await request.post("/invoice", payload);
      forms.reset();
      navigate(`/invoice/${res.data.data.invoice_number}`);
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }

    setLoadingSubmit(false);
  });

  useEffect(() => {
    appendItem({ description: "", amount: 1, price: "0" });
  }, []);

  useEffect(() => {
    handleCountSubTotal();
  }, [forms.watch("items")]);

  useEffect(() => {
    handleCountTax();
  }, [subTotal, forms.watch("taxes")]);

  useEffect(() => {
    handleCountTotal();
  }, [subTotal, taxes]);

  return (
    <Layout
      withPageTitle
      title={<div className="leading-none">Buat Invoice</div>}
    >
      <FormProvider {...forms}>
        <form>
          <div className="max-w-5xl bg-gray-50 rounded-xl mx-auto">
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormSelectAsync
                  control={forms.control}
                  name="company_id"
                  label="Pilih Perusahaan"
                  loadOption={selectCompanies}
                  optionLabel={(item: any) => item.name}
                  optionValue={(item: any) => item.id}
                  error={errors?.company_id}
                />

                <FormInput
                  name="invoice_number"
                  label="No. Invoice"
                  control={forms.control}
                  error={errors?.invoice_number}
                />
                <FormInput
                  type="datetime-local"
                  name="due_date"
                  label="Tanggal Jatuh Tempo"
                  control={forms.control}
                  error={errors?.due_date}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  name="bill_to"
                  label="Ditagihkan kepada"
                  control={forms.control}
                  error={errors?.bill_to}
                />
                <FormInput
                  name="bill_address"
                  label="Alamat Penagihan"
                  control={forms.control}
                  error={errors?.bill_address}
                />

                <FormInput
                  name="email"
                  label="Email Penagihan"
                  control={forms.control}
                  error={errors?.email}
                />
                <FormInput
                  name="phone"
                  label="No Telephone/HP Penagihan"
                  control={forms.control}
                  error={errors?.phone}
                />
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <HiExclamationCircle className="text-yellow-400" />
                    <span className="text-xs text-gray-500">
                      Xendit akan mengirim notifikasi pembayaran melalui email
                      SMS dan WA ke email dan no HP pada formulir diatas.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 mb-3 bg-white">
                <Table>
                  <Table.Thead>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Harga</Table.Th>
                    <Table.Th>Jumlah</Table.Th>
                    <Table.Th>Sub Total</Table.Th>
                    <Table.Th>Opsi</Table.Th>
                  </Table.Thead>
                  <Table.Tbody>
                    <>
                      {itemFields.map((item, index) => (
                        <Table.Tr key={index}>
                          <Table.Td
                            style={{ width: "40%" }}
                            className="align-top"
                          >
                            <FormInput
                              name={`items.${index}.description`}
                              label=""
                              control={forms.control}
                              error={
                                errors?.[
                                  `items.${index}.description` as keyof ErrorForm
                                ]
                              }
                            />
                          </Table.Td>
                          <Table.Td
                            style={{ width: "20%" }}
                            className="align-top"
                          >
                            <FormInputCurrency
                              name={`items.${index}.price`}
                              label=""
                              control={forms.control}
                              onChange={handleCountSubTotal}
                              error={
                                errors?.[
                                  `items.${index}.price` as keyof ErrorForm
                                ]
                              }
                            />
                          </Table.Td>
                          <Table.Td
                            style={{ width: "10%" }}
                            className="align-top"
                          >
                            <FormInput
                              name={`items.${index}.amount`}
                              type="number"
                              label=""
                              onChange={handleCountSubTotal}
                              control={forms.control}
                              error={
                                errors?.[
                                  `items.${index}.amount` as keyof ErrorForm
                                ]
                              }
                            />
                          </Table.Td>
                          <Table.Td
                            style={{ width: "20%" }}
                            className="align-top"
                          >
                            <FormInput
                              name={`subtotal.${index}`}
                              label=""
                              disabled
                              value={currency(
                                Number(
                                  forms.watch(`items.${index}.price`) || 0
                                ) *
                                  Number(
                                    forms.watch(`items.${index}.amount`) || 0
                                  )
                              )}
                            />
                          </Table.Td>
                          <Table.Td>
                            <div
                              className="text-red-600 text-center cursor-pointer"
                              onClick={() => {
                                removeItem(index);
                                handleCountSubTotal();
                              }}
                            >
                              <HiTrash size={22} />
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </>
                    <Table.Tr>
                      <Table.Td cols={5}>
                        <div className="flex justify-end">
                          <Button
                            onClick={() =>
                              appendItem({
                                description: "",
                                amount: 1,
                                price: "0",
                              })
                            }
                            className="text-xs py-2 px-4"
                          >
                            Tambah
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td cols={3}>
                        <span className="text-base">Sub Total</span>
                      </Table.Td>
                      <Table.Td cols={2} className="text-right">
                        <strong>{currency(subTotal)}</strong>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td cols={3}>
                        <span className="text-base">Pajak</span>
                      </Table.Td>
                      <Table.Td
                        cols={2}
                        className=""
                        style={{ maxWidth: "20%" }}
                      >
                        <FormSelectAsync
                          control={forms.control}
                          name="taxes"
                          label=""
                          placeholder="Pilih Pajak"
                          multiple
                          loadOption={selectTaxes}
                          optionLabel={(item: any) => item.name}
                          optionValue={(item: any) => item.id}
                          onChange={handleCountTax}
                        />
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                  <>
                    {taxes?.map((tax) => (
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td cols={3}>
                            <span className="text-base">{tax.name}</span>
                          </Table.Td>
                          <Table.Td cols={2} className="text-right">
                            <>
                              {tax.type === "min" && (
                                <strong>({currency(tax.amount)})</strong>
                              )}
                              {tax.type === "plus" && (
                                <strong>{currency(tax.amount)}</strong>
                              )}
                            </>
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    ))}
                  </>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td cols={3}>
                        <span className="text-base">Grand Total</span>
                      </Table.Td>
                      <Table.Td cols={2} className="text-right">
                        <strong>{currency(total)}</strong>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>

              <FormInput
                name="terbilang"
                label="Terbilang"
                defaultValue={terbilangField}
                control={forms.control}
                error={errors?.terbilang}
              />
              <div className="py-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700">
                      Catatan
                    </label>
                    <Editor
                      init={{ menubar: false, height: "250px" }}
                      apiKey={process.env.REACT_APP_TINYMCE_API}
                      onEditorChange={(content, editor) =>
                        forms.setValue("notes", content)
                      }
                    />
                  </div>
                  <div>
                    <FormInput
                      name="signed_by_name"
                      label="Ditandatangani oleh"
                      defaultValue={me?.name ?? ""}
                      control={forms.control}
                      error={errors?.signed_by_name}
                    />
                    <FormInput
                      name="signed_by_title"
                      label="Jabatan"
                      control={forms.control}
                      error={errors?.signed_by_title}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 py-3">
                <Controller
                  name="withAttachment"
                  control={forms.control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      id="withParticipant"
                      name="withAttachment"
                      value="1"
                    />
                  )}
                />
                <Label htmlFor="withParticipant">
                  Buat Lampiran Peserta Tes
                </Label>
              </div>

              {forms.watch("withAttachment") && (
                <div className="mt-3">
                  <strong>Lampiran Peserta</strong>
                  <div className="mt-2 bg-white">
                    <Table>
                      <Table.Thead>
                        <Table.Th>No</Table.Th>
                        <Table.Th>Nama Peserta</Table.Th>
                        <Table.Th>Modul Tes</Table.Th>
                        <Table.Th>Tgl Tes</Table.Th>
                        <Table.Th>Opsi</Table.Th>
                      </Table.Thead>
                      <Table.Tbody>
                        <>
                          {participantFields.map((item, index) => (
                            <Table.Tr>
                              <Table.Td className="">
                                <>{index + 1}</>
                              </Table.Td>
                              <Table.Td className="align-top">
                                <FormInput
                                  name={`participants.${index}.name`}
                                  label=""
                                  control={forms.control}
                                  error={
                                    errors?.[
                                      `participants.${index}.name` as keyof ErrorForm
                                    ]
                                  }
                                />
                              </Table.Td>
                              <Table.Td className="align-top">
                                <FormInput
                                  name={`participants.${index}.module`}
                                  label=""
                                  control={forms.control}
                                  error={
                                    errors?.[
                                      `participants.${index}.module` as keyof ErrorForm
                                    ]
                                  }
                                />
                              </Table.Td>
                              <Table.Td className="align-top">
                                <FormInput
                                  name={`participants.${index}.test_date`}
                                  label=""
                                  type="date"
                                  control={forms.control}
                                  error={
                                    errors?.[
                                      `participants.${index}.test_date` as keyof ErrorForm
                                    ]
                                  }
                                />
                              </Table.Td>
                              <Table.Td className="">
                                <div
                                  className="text-red-600 text-center cursor-pointer"
                                  onClick={() => {
                                    removeParticipant(index);
                                    handleCountSubTotal();
                                  }}
                                >
                                  <HiTrash size={22} />
                                </div>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                          <Table.Tr>
                            <Table.Td cols={5}>
                              <div className="flex justify-end">
                                <Button
                                  onClick={() =>
                                    appendParticipant({
                                      name: "",
                                      module: "",
                                      test_date: "",
                                    })
                                  }
                                  className="text-xs py-2 px-4"
                                >
                                  Tambah
                                </Button>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        </>
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-200 px-5 py-2 rounded-b-xl flex items-center justify-between">
              <div>
                <div className="flex items-start gap-2 py-3">
                  <Controller
                    name="withPaymentLink"
                    control={forms.control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        id="withLink"
                        name="withPaymentLink"
                        value="1"
                      />
                    )}
                  />
                  <Label htmlFor="withLink">
                    <span>Buat link pembayaran Xendit</span>
                    <div className="text-xs">
                      Opsi Menyimpan dan Membuat Link Pembayaran akan membuat
                      otomatis link pembayaran Xendit. Setelah melakukan aksi
                      ini, anda tidak dapat mengubah invoice
                    </div>
                  </Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="px-8">
                  {loadingSubmit ? <Spinner /> : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default CreateBlankInvoice;
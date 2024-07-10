import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { FormInput } from "../../components/forms/input";
import { FormSelect } from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import AddButton from "../../components/buttons/add";
import { VoucherType } from "../../types/vouchers";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useVoucher } from "../../stores/voucher";

type FormValues = {
  code: string;
  description: string;
  amount: string;
  discount_type: SelectOptionType | undefined;
  expiry_date: string;
  user_type: SelectOptionType | undefined;
  max_discount: string;
  min_purchase: string;
  terms_conditions: string;
  for: string;
  usage_limit: string;
  claim_type: SelectOptionType | undefined;
  usage_count: string;
};

type ErrorForm = {
  code: [] | null;
  description: [] | null;
  amount: [] | null;
  discount_type: [] | null;
  expiry_date: [] | null;
  user_type: [] | null;
  max_discount: [] | null;
  min_purchase: [] | null;
  terms_conditions: [] | null;
  for: [] | null;
  usage_limit: [] | null;
  claim_type: [] | null;
  usage_count: [] | null;
};

const UserPsikolog = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<VoucherType | null>(null);


  const { setVouchers, getVouchers } = useVoucher();
  const { setMessage } = useAlert();
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();


  const discountTypes = [
    { label: "Fixed", value: "fixed" },
    { label: "Percentage", value: "percentage" },
  ];

  const userTypes = [
    { label: "User", value: "user" },
    { label: "Psikolog", value: "psikolog" },
  ];

  const claimTypes = [
    { label: "Single", value: "single" },
    { label: "Multiple", value: "multiple" },
  ];

  const getAllVoucher = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/voucher", page, search, searchMode);
      console.log('ini data getAllVoucher ==>>>', data)
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getAllVoucher(input ?? "", true);
    setVouchers(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === getVouchers?.last_page) {
      return;
    }

    setPage(page + 1);
  };

  const handlePrevious = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
  };

  const handleSave = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
        discount_type: data.discount_type?.value,
        claim_type: data.claim_type?.value,
        user_type: data.user_type?.value,
      };
      if (modalMode === "create") {
        await request.post("/voucher/create", payload);
      } else {
        await request.put(`/voucher/update/${selected?.id}`, payload);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Voucher saved!", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
      console.log(err);
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: VoucherType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("code", item.code ?? "");
    setValue("description", item.description ?? "");
    setValue("amount", item.amount ?? "");
    setValue(
      "discount_type",
      discountTypes.find((type) => type.value === item.discount_type) ?? undefined
    );
    setValue("expiry_date", item.expiry_date ?? "");
    setValue(
      "user_type",
      userTypes.find((type) => type.value === item.user_type) ?? undefined
    );
    setValue("max_discount", item.max_discount ?? "");
    setValue("min_purchase", item.min_purchase ?? "");
    setValue("terms_conditions", item.terms_conditions ?? "");
    setValue("for", item.for ?? "");
    setValue("usage_limit", item.usage_limit?.toString() ?? "");
    setValue(
      "claim_type",
      claimTypes.find((type) => type.value === item.claim_type) ?? undefined
    );
    setValue("usage_count", item.usage_count.toString() ?? "");
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/voucher/delete/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Voucher deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getAllVoucher()]).then((res) => {
      setVouchers(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Voucher"
      pageTitleContent={
        <div className="flex items-center">
          <input
            type="text"
            className="rounded-l-lg border-gray-300"
            placeholder={"Cari disini..."}
            onChange={(e) => setQ(e.target.value)}
            disabled={loading}
            value={q}
          />
          {q && (
            <button
              onClick={() => handleSearch("")}
              className="py-3 px-2 border border-red-600 bg-red-600 text-white"
            >
              <HiX />
            </button>
          )}
          <button
            className={`${loading ? "py-2 px-3" : "p-3"} text-lg rounded-r-lg ${loading
              ? "bg-blue-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            disabled={loading}
            onClick={() => handleSearch(q ?? "")}
          >
            {loading ? <Spinner size={"sm"} /> : <HiOutlineSearch />}
          </button>
        </div>
      }
    >
      <AddButton
        onClick={() => {
          setModalAdd(true);
          setModalMode("create");
          reset();
        }}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Code</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Amount</Table.Th>
          <Table.Th>Expiry Date</Table.Th>
          <Table.Th>User Type</Table.Th>
          <Table.Th>for</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {getVouchers?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {getVouchers?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          getVouchers.per_page *
                          (getVouchers.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.code || "Belum ada kode"}</Table.Td>
                      <Table.Td>{item.description}</Table.Td>
                      <Table.Td>{item.amount}</Table.Td>
                      <Table.Td>{moment(item.expiry_date).format("DD-MM-YYYY")}</Table.Td>
                      <Table.Td>{item.user_type}</Table.Td>
                      <Table.Td>{item.for}</Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-1">
                          <Trash
                            className="text-red-600 text-xl cursor-pointer"
                            onClick={() => {
                              setSelected(item);
                              setModalDelete(true);
                            }}
                          />
                          <Pencil
                            className="text-blue-600 text-xl cursor-pointer"
                            onClick={() => handleFormEdit(item)}
                          />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </>
              )}
            </>
          )}
        </Table.Tbody>
      </Table>
      <Pagination
        currentPage={getVouchers?.current_page ?? 1}
        totalPage={getVouchers?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Voucher" : "Edit Voucher"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <form>
          <FormInput
            name="code"
            control={control}
            label="Kode"
            error={errors?.code}
          />
          <FormInput
            name="description"
            control={control}
            label="Description"
            error={errors?.description}
          />
          <FormInput
            name="amount"
            type="number"
            control={control}
            label="Amount"
            error={errors?.amount}
          />
          <FormSelect
            name="discount_type"
            control={control}
            label="Discount Type"
            options={discountTypes}
          />
          <FormInput
            name="expiry_date"
            control={control}
            type="date"
            label="Expiry Date"
            error={errors?.expiry_date}
          />
          <FormSelect
            name="user_type"
            control={control}
            label="User Type"
            options={userTypes}
          />
          <FormInput
            name="max_discount"
            control={control}
            label="Max Discount"
            error={errors?.max_discount}
          />
          <FormInput
            name="min_purchase"
            control={control}
            label="Min Purchase"
            error={errors?.min_purchase}
          />
          <FormInput
            name="terms_conditions"
            control={control}
            label="Terms Conditions"
            error={errors?.terms_conditions}
          />
          <FormInput
            name="for"
            control={control}
            label="For"
            error={errors?.for}
          />
          <FormInput
            name="usage_limit"
            control={control}
            type="number"
            label="Usage Limit"
            error={errors?.usage_limit}
          />
          <FormSelect
            name="claim_type"
            control={control}
            label="Claim Type"
            options={claimTypes}
          />
          <FormInput
            name="usage_count"
            control={control}
            type="number"
            label="Usage Count"
            error={errors?.usage_count}
          />
          <div className="mt-3 flex items-center justify-end">
            <Button className="px-8" onClick={handleSave}>
              {loadingSubmit ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </form>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="Kode"
        name={selected?.code ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default UserPsikolog;

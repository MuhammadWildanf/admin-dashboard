import React, { useEffect, useState } from "react";
import Layout from "../../layout.tsx/app";
import { getData } from "../../../api/get-data";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../../components/buttons/add";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/buttons";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import BaseModal from "../../../components/modal/base";
import Pagination from "../../../components/tables/pagination";
import Table from "../../../components/tables/base";
import { FormInput } from "../../../components/forms/input";
import { PriceType } from "../../../types/price";
import { request } from "../../../api/config";
import { Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../../stores/alert";
import { usePrice } from "../../../stores/price";
import { FormSelectAsync } from "../../../components/forms/input-select";
import { CounselingProductType } from "../../../types/counselingProduct";


type FormValues = {
  productable_id: CounselingProductType | null;
  name: string;
  year_of_experience: string;
  notes: string;
  chat_min_price: number | null;
  chat_max_price: number | null;
  video_call_min_price: number | null;
  video_call_max_price: number | null;
  face2face_min_price: number | null;
  face2face_max_price: number | null;
  default_share_profit: number | null;
};

type ErrorForm = {
  productable_id: [] | null;
  name: [] | null;
  year_of_experience: [] | null;
  notes: [] | null;
  chat_min_price: [] | null;
  chat_max_price: [] | null;
  video_call_min_price: [] | null;
  video_call_max_price: [] | null;
  face2face_min_price: [] | null;
  face2face_max_price: [] | null;
  default_share_profit: [] | null;
};

const Price = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(undefined);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<PriceType | null>(null);
  const { setValue, reset, handleSubmit, control, watch } = useForm<FormValues>();
  const { setPrice, GetPrice } = usePrice();
  const { setMessage } = useAlert();

  const getPriceVariable = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/pricing-variable", page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getPriceVariable(input ?? "", true);
    setPrice(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetPrice?.last_page) {
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
      const Productableid = data.productable_id?.id;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("productable_type", "CounselingProduct");
      formData.append("productable_id", Productableid?.toString() ?? "");
      formData.append("year_of_experience", data.year_of_experience ?? "");
      formData.append("notes", data.notes ?? "");
      formData.append("chat_min_price", data.chat_min_price?.toString() || "0");
      formData.append("chat_max_price", data.chat_max_price?.toString() || "0");
      formData.append("video_call_min_price", data.video_call_min_price?.toString() || "0");
      formData.append("video_call_max_price", data.video_call_max_price?.toString() || "0");
      formData.append("face2face_min_price", data.face2face_min_price?.toString() || "0");
      formData.append("face2face_max_price", data.face2face_max_price?.toString() || "0");
      formData.append("default_share_profit", data.default_share_profit?.toString() || "0");

      if (modalMode === "create") {
        await request.post("/pricing-variable/create", formData);
      } else {
        await request.post(`/pricing-variable/${selected?.id}`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Price saved!", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
      console.log(err);
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: PriceType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue("year_of_experience", item.year_of_experience ?? "");
    setValue("notes", item.notes ?? "");
    setValue("chat_min_price", item.chat_min_price);
    setValue("chat_max_price", item.chat_max_price);
    setValue("video_call_min_price", item.video_call_min_price);
    setValue("video_call_max_price", item.video_call_max_price);
    setValue("face2face_min_price", item.face2face_min_price);
    setValue("face2face_max_price", item.face2face_max_price);
    setValue("default_share_profit", item.default_share_profit);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/pricing-variable/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Price deleted", "success");
    } catch (err: any) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors); // Update state with errors
      }
      setMessage(err.response.data.message, "error");
    }
    setLoadingSubmit(false);
  };

  const selectCounselingProduct = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/counseling-products/counseling-product", {
      params: params,
    });

    return data.data;
};



  useEffect(() => {
    Promise.all([getPriceVariable()]).then((res) => {
      setPrice(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Variable Pricing Management"
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
          <Table.Th>Name</Table.Th>
          <Table.Th>Years of Experience</Table.Th>
          <Table.Th>Chat Min Price</Table.Th>
          <Table.Th>Chat Max Price</Table.Th>
          <Table.Th>Video Call Min Price</Table.Th>
          <Table.Th>Video Call Max Price</Table.Th>
          <Table.Th>Face2Face Min Price</Table.Th>
          <Table.Th>Face2Face Max Price</Table.Th>
          <Table.Th>Default Share Profit</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetPrice?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetPrice?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetPrice.per_page * (GetPrice.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name ?? "-"}</Table.Td>
                      <Table.Td>{item.year_of_experience ?? "-"}</Table.Td>
                      <Table.Td>
                        {item.chat_min_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.chat_max_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.video_call_min_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.video_call_max_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.face2face_min_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.face2face_max_price?.toString() ?? "-"}
                      </Table.Td>
                      <Table.Td>
                        {item.default_share_profit?.toString() ?? "-"}
                      </Table.Td>
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
        currentPage={GetPrice?.current_page ?? 1}
        totalPage={GetPrice?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Counseling" : "Edit Counseling"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <form>
          <FormSelectAsync
            label="Counseling Product"
            name="productable_id"
            control={control}
            loadOption={selectCounselingProduct}
            optionLabel={(option: CounselingProductType) => option.name}
            optionValue={(option: CounselingProductType) => option.id}  // Pastikan mengembalikan string ID
            error={errors?.productable_id}
          />
          <FormInput
            name="name"
            label="Name"
            control={control}
            error={errors?.name}
          />
          <FormInput
            name="year_of_experience"
            label="Years of Experience"
            control={control}
            error={errors?.year_of_experience}
          />
          <FormInput
            name="notes"
            label="Notes"
            control={control}
            error={errors?.notes}
          />
          <FormInput
            name="chat_min_price"
            label="Chat Min Price"
            control={control}
            error={errors?.chat_min_price}
          />
          <FormInput
            name="chat_max_price"
            label="Chat Max Price"
            control={control}
            error={errors?.chat_max_price}
          />
          <FormInput
            name="video_call_min_price"
            label="Video Call Min Price"
            control={control}
            error={errors?.video_call_min_price}
          />
          <FormInput
            name="video_call_max_price"
            label="Video Call Max Price"
            control={control}
            error={errors?.video_call_max_price}
          />
          <FormInput
            name="face2face_min_price"
            label="Face2Face Min Price"
            control={control}
            error={errors?.face2face_min_price}
          />
          <FormInput
            name="face2face_max_price"
            label="Face2Face Max Price"
            control={control}
            error={errors?.face2face_max_price}
          />
          <FormInput
            name="default_share_profit"
            label="Default Share Profit"
            control={control}
            error={errors?.default_share_profit}
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
        name={selected?.name ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default Price;

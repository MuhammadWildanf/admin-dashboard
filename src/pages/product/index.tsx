import { Spinner } from "flowbite-react";
import Layout from "../layout.tsx/app";
import { HiEye, HiOutlineSearch, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getData } from "../../api/get-data";
import { useProduct } from "../../stores/product";
import AddButton from "../../components/buttons/add";
import { ModuleType } from "../../types/assessment-tools/module";
import { FormProvider, useForm } from "react-hook-form";
import Table from "../../components/tables/base";
import { currency } from "../../helper/currency";
import BaseModal from "../../components/modal/base";
import { FormInput, FormInputCurrency } from "../../components/forms/input";
import { FormInputRadio } from "../../components/forms/input-radio";
import { request } from "../../api/config";
import { FormSelectAsync } from "../../components/forms/input-select";
import { Button } from "../../components/buttons";
import { useAlert } from "../../stores/alert";
import { ProductType } from "../../types/product";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/tables/pagination";

type FormValues = {
  name: string;
  sku: string;
  modul_id: { id: number | string; name: string } | null;
  product_type: string;
  product_category: string;
  with_screening: string;
  screening_modul_id: { id: number | string; name: string } | null;
  base_price: string;
};

type ErrorValues = {
  name: [] | null;
  sku: [] | null;
  modul_id: [] | null;
  product_type: [] | null;
  product_category: [] | null;
  with_screening: [] | null;
  screening_modul_id: [] | null;
  base_price: [] | null;
};

const ProductIndex = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ProductType | null>(null);
  const [errors, setErrors] = useState<ErrorValues | null>(null);

  const { products, setProducts } = useProduct();
  const forms = useForm<FormValues>();
  const { setMessage } = useAlert();
  const navigate = useNavigate();

  const getProducts = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const data = await getData("/product", page, search, searchMode);
      return data.data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getProducts(input ?? "", true);
    setProducts(data);
    setLoading(false);
  };

  const selectModules = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/select/modules", {
      params: params,
    });
    return data.data;
  };

  const handleEditForm = async (item: ProductType) => {
    await setSelected(item);
    forms.setValue("base_price", item?.base_price.toString() ?? "");
    forms.setValue("name", item.name ?? "");
    forms.setValue("sku", item.sku ?? "");
    forms.setValue("product_category", item.product_category ?? "");
    forms.setValue("product_type", item.product_type ?? "");
    forms.setValue("with_screening", item.with_screening ? "1" : "0");
    forms.setValue("modul_id", item.module ?? null);
    forms.setValue("screening_modul_id", item.screening_module ?? null);

    setModalAdd(true);
    setModalMode("edit");
  };

  const onSubmit = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
        modul_id: data?.modul_id?.id ?? "",
        screening_modul_id: data?.screening_modul_id?.id ?? "",
      };

      if (modalMode === "create") {
        await request.post(`product/create`, payload).then((res) => {
          setMessage("Berhasil menambah produk", "success");
        });
      } else if (modalMode === "edit") {
        await request
          .post(`product/update/${selected?.id}`, payload)
          .then((res) => {
            setMessage("Berhasil mengubah produk", "success");
          });
      }
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setModalAdd(false);
    setSelected(null);
    setLoadingSubmit(false);
    forms.reset();
  });

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/product/destroy/${selected?.id}`).then(() => {
        setMessage("Berhasil menghapus produk", "success");
      });
    } catch (err) {
      console.log(err);
    }
    setSelected(null);
    setModalDelete(false);
    setLoadingSubmit(false);
  };

  const handleNext = () => {
    if (page === products?.last_page) {
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

  useEffect(() => {
    Promise.all([getProducts()]).then((res) => {
      setProducts(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Produk"
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
            className={`${loading ? "py-2 px-3" : "p-3"} text-lg rounded-r-lg ${
              loading
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
          forms.reset();
        }}
      />

      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Nama Produk</Table.Th>
          <Table.Th>Tipe Produk</Table.Th>
          <Table.Th>Kategori</Table.Th>
          <Table.Th>Harga Dasar</Table.Th>
          <Table.Th className="text-center">Jml Harga Variabel</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          <>
            {loading ? (
              <Table.TrLoading cols={7} rows={10} />
            ) : (
              <>
                {products?.data?.length === 0 ? (
                  <Table.Tr>
                    <Table.Td cols={7} className="text-center py-4">
                      Tidak ada data
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  <>
                    {products?.data.map((item, key) => (
                      <Table.Tr key={key}>
                        <Table.Td>
                          {(
                            key +
                            1 +
                            products.per_page * (products.current_page - 1)
                          ).toString()}
                        </Table.Td>
                        <Table.Td>{item.name}</Table.Td>
                        <Table.Td>
                          <span
                            className={`${
                              item.product_type === "asesmen"
                                ? "bg-blue-600"
                                : "bg-pink-600"
                            } text-white text-xs capitalize py-1 px-2 rounded`}
                          >
                            {item.product_type}
                          </span>
                        </Table.Td>
                        <Table.Td>{item.product_category}</Table.Td>
                        <Table.Td>
                          {item.base_price ? currency(item.base_price) : ""}
                        </Table.Td>
                        <Table.Td>
                          <div className="flex justify-center items-center gap-2">
                            {item.prices.length}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex justify-center items-center gap-2">
                            <HiEye
                              size={18}
                              className="text-gray-600 cursor-pointer hover:text-gray-700"
                              onClick={() => navigate(`/product/${item.id}`)}
                            />
                            <HiPencil
                              size={18}
                              className="text-blue-600 cursor-pointer hover:text-blue-700"
                              onClick={() => handleEditForm(item)}
                            />
                            <HiTrash
                              size={18}
                              className="text-red-600 cursor-pointer hover:text-red-700"
                              onClick={async () => {
                                await setSelected(item);
                                setModalDelete(true);
                              }}
                            />
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        </Table.Tbody>
      </Table>
      <Pagination
        currentPage={products?.current_page ?? 1}
        totalPage={products?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <BaseModal
        title="Tambah Produk"
        size="3xl"
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <FormProvider {...forms}>
          <form>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <FormInput
                  name="name"
                  label="Name"
                  control={forms.control}
                  error={errors?.name}
                />
              </div>
              <div className="">
                <FormInput
                  name="sku"
                  label="SKU"
                  control={forms.control}
                  error={errors?.sku}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <FormInputRadio
                  name="product_category"
                  label="Kategori Produk"
                  control={forms.control}
                  display="flex"
                  defaultValue={selected?.product_category}
                  options={[
                    { label: "Perusahaan / Client", value: "company" },
                    { label: "Personal / Customer", value: "personal" },
                    { label: "Umum", value: "general" },
                  ]}
                  error={errors?.product_category}
                />
              </div>
              <div className="">
                <FormInputRadio
                  name="product_type"
                  label="Tipe Produk"
                  control={forms.control}
                  display="flex"
                  defaultValue={selected?.product_type}
                  options={[
                    { label: "Asesmen", value: "asesmen" },
                    { label: "Konseling", value: "konseling" },
                  ]}
                  error={errors?.product_type}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInputCurrency
                name="base_price"
                label="Harga Produk"
                control={forms.control}
                defaultValue={
                  selected?.base_price
                    ? selected?.base_price.toLocaleString("id-ID")
                    : null
                }
                error={errors?.base_price}
              />

              {forms.watch("product_type") === "asesmen" && (
                <FormSelectAsync
                  label="Pilih Modul"
                  name="modul_id"
                  control={forms.control}
                  loadOption={selectModules}
                  defaultValue={selected?.module}
                  optionLabel={(option: ModuleType) => `${option.name}`}
                  optionValue={(option: ModuleType) => `${option.id}`}
                  error={errors?.modul_id}
                />
              )}

              {forms.watch("product_type") === "konseling" && (
                <FormInputRadio
                  name="with_screening"
                  label="Perlu Screening?"
                  control={forms.control}
                  display="flex"
                  defaultValue={selected?.with_screening ? "1" : "0"}
                  options={[
                    { label: "Iya", value: "1" },
                    { label: "Tidak", value: "0" },
                  ]}
                  error={errors?.with_screening}
                />
              )}

              {forms.watch("product_type") === "konseling" &&
                forms.watch("with_screening") === "1" && (
                  <FormSelectAsync
                    label="Pilih Modul Screening"
                    name="screening_modul_id"
                    control={forms.control}
                    loadOption={selectModules}
                    defaultValue={selected?.screening_module}
                    optionLabel={(option: ModuleType) => `${option.name}`}
                    optionValue={(option: ModuleType) => `${option.id}`}
                    error={errors?.screening_modul_id}
                  />
                )}
            </div>

            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <Button
                  className="px-3"
                  variant="danger"
                  onClick={() => setModalAdd(false)}
                >
                  Batal
                </Button>
                <Button className="px-8" onClick={onSubmit}>
                  {loadingSubmit ? <Spinner /> : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle={`Produk ${selected?.name}`}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default ProductIndex;

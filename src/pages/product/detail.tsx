import { Spinner } from "flowbite-react";
import Layout from "../layout.tsx/app";
import { HiPencil, HiPlus, HiSearch, HiTrash, HiX } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getData } from "../../api/get-data";
import { useProduct } from "../../stores/product";
import { useForm } from "react-hook-form";
import { request } from "../../api/config";
import { useAlert } from "../../stores/alert";
import { ProductPriceType } from "../../types/product";
import { useParams } from "react-router-dom";
import Table from "../../components/tables/base";
import { Button } from "../../components/buttons";
import { FormInputCurrency } from "../../components/forms/input";
import { currency } from "../../helper/currency";
import Pagination from "../../components/tables/pagination";
import BaseModal from "../../components/modal/base";
import { FormSelectAsync } from "../../components/forms/input-select";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";

type FormValues = {
  company_id: { id: number | string; name: string } | null;
  modul_id: { id: number | string; name: string };
  price: string;
};

type ErrorValues = {
  company_id: [] | null;
  modul_id: [] | null;
  price: [] | null;
};

const ProductDetail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ProductPriceType | null>(null);
  const [errors, setErrors] = useState<ErrorValues | null>(null);

  const { productPrice, setProductPrice, product, setProduct } = useProduct();
  const { setMessage } = useAlert();
  const { productId } = useParams();

  const { control, setValue, reset, handleSubmit } = useForm<FormValues>();

  const getProduct = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const data = await getData(
        `/product/${productId}`,
        page,
        search,
        searchMode
      );
      return data;
    } catch {}
  };

  const getProductPrice = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData(
        `/product/${productId}/prices`,
        page,
        search,
        searchMode
      );
      return data.data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getProductPrice(input ?? "", true);
    setProductPrice(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === productPrice?.last_page) {
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

  const selectCompany = async (inputValue: string) => {
    let params = {
      q: inputValue,
      product_id: product?.id,
    };
    const { data } = await request.get("/select/companies-withnoprice", {
      params: params,
    });
    return data.data;
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

  const handleEditForm = async (item: ProductPriceType) => {
    await setSelected(item);
    setModalMode("edit");

    setValue("modul_id", item.module ?? null);
    setValue("price", item.price.toString() ?? "");

    setModalAdd(true);
  };

  const handleSave = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      if (modalMode === "create") {
        let payload = {
          ...data,
          modul_id: data.modul_id?.id ?? "",
          company_id: data.company_id?.id ?? "",
        };

        await request.post(`/product/${product?.id}/add-price`, payload);
        setModalAdd(false);
        reset();
      } else if (modalMode === "edit") {
        let payload = {
          ...data,
          modul_id: data.modul_id?.id ?? "",
        };

        await request.post(`/product/${selected?.id}/update-price`, payload);
        setModalAdd(false);
        setLoadingSubmit(false);
        reset();
      }
      setErrors(null);
    } catch (err: any) {
      setMessage("Oops, something went wrong!", "error");
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/product/${selected?.id}/delete-price`);
      setSelected(null);
      setModalDelete(false);
    } catch (err) {
      setMessage("Oops, Something went wrong!", "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getProduct(), getProductPrice()]).then((res) => {
      setProduct(res[0]);
      setProductPrice(res[1]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title={
        <div className="flex items-center gap-3">
          <div>{product?.name}</div>
          <div
            className={`${
              product?.product_type === "asesmen"
                ? "bg-blue-600"
                : "bg-pink-600"
            } text-white text-xs capitalize py-1 px-2 rounded`}
          >
            {product?.product_type}
          </div>
        </div>
      }
    >
      <div className="mb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-r">
            <label htmlFor="" className="text-xs">
              Nama Produk
            </label>
            <br />
            <span className="font-medium">{product?.name}</span>
          </div>

          <div className="md:border-r">
            <label htmlFor="" className="text-xs">
              Tipe Produk
            </label>
            <br />
            <span className="font-medium capitalize">
              {product?.product_type}
            </span>
          </div>

          <div className="border-r">
            <label htmlFor="" className="text-xs">
              Kategori Produk
            </label>
            <br />
            <span className="font-medium capitalize">
              {product?.product_category}
            </span>
          </div>

          <div>
            <label htmlFor="" className="text-xs">
              Harga Dasar
            </label>
            <br />
            <span className="font-medium capitalize">
              IDR. {product?.base_price.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="border-r">
            <label htmlFor="" className="text-xs">
              Modul Default
            </label>
            <br />
            <span className="font-medium capitalize">
              {product?.module ? product?.module?.name : "-"}
            </span>
          </div>

          <div className="md:border-r">
            <label htmlFor="" className="text-xs">
              Perlu Screening (jika produk konseling)
            </label>
            <br />
            <span className="font-medium capitalize">
              {product?.with_screening ? "Iya" : "Tidak"}
            </span>
          </div>

          <div>
            <label htmlFor="" className="text-xs">
              Modul Screening (jika produk konseling)
            </label>
            <br />
            <span className="font-medium capitalize">
              {product?.screening_module
                ? product?.screening_module?.name
                : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="md:flex md:items-center justify-between py-2">
          <div className="leading-none">
            <h2 className="font-semibold text-xl">Harga Variabel</h2>
            <small>
              Anda juga dapat mengatur harga variabel di pengaturan client
            </small>
          </div>
          <div className="flex gap-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Cari Perusahaan..."
                onChange={(e) => setQ(e.target.value)}
                value={q}
                className="border-gray-300 rounded-l-lg py-2 text-sm"
              />
              {q && (
                <button
                  onClick={() => handleSearch("")}
                  className="py-3 px-2 border border-red-600 bg-red-600 text-white"
                >
                  <HiX />
                </button>
              )}
              <button className="rounded-r-lg bg-gray-600 text-white px-3">
                <HiSearch onClick={() => handleSearch(q ?? "")} />
              </button>
            </div>
            <Button
              className="rounded-full px-3"
              onClick={() => {
                setModalAdd(true);
                setModalMode("create");
              }}
            >
              <HiPlus />
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Table>
            <Table.Thead>
              <Table.Th>#</Table.Th>
              <Table.Th>Nama Perushaan/Client</Table.Th>
              <Table.Th>Modul Khusus</Table.Th>
              <Table.Th>Harga</Table.Th>
              <Table.Th>Opsi</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                <Table.TrLoading cols={5} rows={5} />
              ) : (
                <>
                  {productPrice?.data.length === 0 && (
                    <>
                      <Table.Tr>
                        <Table.Td cols={5} className="py-2 text-center">
                          Tidak ada data
                        </Table.Td>
                      </Table.Tr>
                    </>
                  )}
                  {productPrice?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          productPrice.per_page *
                            (productPrice.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.company.name}</Table.Td>
                      <Table.Td>{item.module?.name ?? "-"}</Table.Td>
                      <Table.Td>
                        {item.price ? currency(item.price) : "-"}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          <HiPencil
                            className="text-blue-600 cursor-pointer hover:text-blue-700"
                            size={18}
                            onClick={() => handleEditForm(item)}
                          />
                          <HiTrash
                            className="text-red-600 cursor-pointer hover:text-red-700"
                            size={18}
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
            </Table.Tbody>
          </Table>
          <Pagination
            currentPage={productPrice?.current_page ?? 1}
            totalPage={productPrice?.last_page ?? 1}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>

      <BaseModal
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
        title={
          modalMode === "create" ? (
            "Tambah Harga Variabel"
          ) : (
            <div className="">
              <span> Ubah Harga Variabel</span>
              <br />
              <small className="font-regular">{selected?.company?.name}</small>
            </div>
          )
        }
      >
        <>
          {modalMode === "create" && (
            <FormSelectAsync
              control={control}
              name="company_id"
              label="Peruhsaan/Client"
              loadOption={selectCompany}
              optionLabel={(option: any) => option.name}
              optionValue={(option: any) => option.id}
              error={errors?.company_id}
            />
          )}
        </>

        <FormSelectAsync
          control={control}
          name="modul_id"
          label="Modul"
          loadOption={selectModules}
          optionLabel={(option: any) => option.name}
          optionValue={(option: any) => option.id}
          error={errors?.modul_id}
        />

        <FormInputCurrency
          control={control}
          name="price"
          label="Harga"
          defaultValue={
            selected?.price ? selected?.price.toLocaleString("id-ID") : null
          }
          error={errors?.price}
        />

        <div className="pt-2 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="px-3"
              variant="danger"
              onClick={() => setModalAdd(false)}
            >
              Batal
            </Button>
            <Button className="px-8" onClick={handleSave}>
              {loadingSubmit ? <Spinner /> : "Simpan"}
            </Button>
          </div>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle={`Harga produk untuk ${selected?.company.name}`}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default ProductDetail;

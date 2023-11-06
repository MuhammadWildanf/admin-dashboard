import { useEffect, useState } from "react";
import { HiOutlineSearch, HiPencil, HiTrash, HiX } from "react-icons/hi";
import { Button, Spinner } from "flowbite-react";
import Layout from "../layout.tsx/app";
import Pagination from "../../components/tables/pagination";
import { request } from "../../api/config";
import { useTax } from "../../stores/tax";
import Table from "../../components/tables/base";
import { TaxType } from "../../types/tax";
import { getData } from "../../api/get-data";
import AddButton from "../../components/buttons/add";
import { useForm } from "react-hook-form";
import BaseModal from "../../components/modal/base";
import { FormInput } from "../../components/forms/input";
import { FormSelect } from "../../components/forms/input-select";
import { FormTextArea } from "../../components/forms/input-textarea";
import { useAlert } from "../../stores/alert";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";

type FormValues = {
  name: string;
  percent: string | number;
  type: { label: string; value: number | string } | undefined;
  notes: string;
};

type ErrorForm = {
  name: [] | null;
  percent: [] | null;
  type: [] | null;
  notes: [] | null;
};

const TaxPage = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<TaxType | undefined>(undefined);
  const [errors, setErrors] = useState<ErrorForm | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { taxes, setTaxes } = useTax();
  const { setMessage } = useAlert();

  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();

  const getAsesmens = async (search?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      const data = await getData("/tax");
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getAsesmens(input ?? "", true);
    setTaxes(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === taxes?.last_page) {
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
        type: data.type?.value ?? "",
      };
      if (modalMode === "create") {
        await request.post("/tax", payload);
      } else {
        await request.post(`/tax/${selected?.id}/update`, payload);
      }
      setSelected(undefined);
      setModalAdd(false);
      setModalMode(undefined);
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const optionType = [
    { label: "Pengurangan", value: "min" },
    { label: "Penambahan", value: "plus" },
  ];

  const handleEditForm = (item: TaxType) => {
    setSelected(item);
    setValue("name", item.name ?? "");
    setValue("notes", item.notes ?? "");
    setValue("percent", item.percent ?? "");
    setValue(
      "type",
      item.type
        ? optionType.find((type) => type.value === item.type)
        : undefined
    );
    setModalMode("edit");
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/tax/${selected?.id}/destroy`);
      setModalDelete(false);
      setSelected(undefined);
    } catch (err: any) {
      setMessage("Oops, something went wrong", "error");
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getAsesmens()]).then((res) => {
      setTaxes(res[0]);
    });
    setLoading(false);
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="List Pajak"
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
          reset();
        }}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Nama Tax</Table.Th>
          <Table.Th className="text-center">Nominal</Table.Th>
          <Table.Th>Tipe</Table.Th>
          <Table.Th>Catatan</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={5} rows={5} />
          ) : (
            <>
              {taxes?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={5} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {taxes?.data.map((item, key) => (
                    <Table.Tr
                      key={key}
                      className={`cursor-pointer `}
                      // onClick={() => navigate(`/partner/client/${item}`)}
                    >
                      <Table.Td>
                        {(
                          key +
                          1 +
                          taxes.per_page * (taxes.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td className="text-center">
                        <>{item.percent}%</>
                      </Table.Td>
                      <Table.Td>
                        {item.type === "min" ? (
                          <span className="text-xs uppercase bg-green-50 py-1 px-3 rounded text-green-700">
                            Pengurangan
                          </span>
                        ) : (
                          <span className="text-xs uppercase bg-red-50 py-1 px-3 rounded text-red-700">
                            Penambahan
                          </span>
                        )}
                      </Table.Td>
                      <Table.Td>{item.notes ?? "-"}</Table.Td>
                      <Table.Td>
                        <div className="flex items-center justify-center gap-2">
                          <HiPencil
                            size={18}
                            onClick={() => handleEditForm(item)}
                            className="text-blue-600 hover:text-blue-700"
                          />
                          <HiTrash
                            size={18}
                            onClick={() => {
                              setSelected(item);
                              setModalDelete(true);
                            }}
                            className="text-red-600 hover:text-red-700"
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
        currentPage={taxes?.current_page ?? 1}
        totalPage={taxes?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <BaseModal
        title={modalMode === "create" ? "Tambah Pajak" : "Edit Pajak"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <FormInput
          name="name"
          control={control}
          label="Nama Pajak"
          error={errors?.name}
        />

        <FormSelect
          label="Jenis Pajak"
          name="type"
          control={control}
          options={optionType}
          error={errors?.type}
        />

        <FormInput
          name="percent"
          type="number"
          control={control}
          label="Nominal Persentase (%)"
          error={errors?.percent}
        />

        <FormTextArea
          name="notes"
          control={control}
          label="Catatan"
          error={errors?.notes}
        />

        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleSave}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle={`Tax ${selected?.name}`}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default TaxPage;

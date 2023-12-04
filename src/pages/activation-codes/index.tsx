import { useEffect, useState } from "react";
import AddButton from "../../components/buttons/add";
import Layout from "../layout.tsx/app";
import { useForm } from "react-hook-form";
import { useActivationCode } from "../../stores/activation-code";
import { request } from "../../api/config";
import { getData } from "../../api/get-data";
import {
  HiClipboardList,
  HiExclamationCircle,
  HiKey,
  HiOutlineSearch,
  HiTrash,
  HiX,
} from "react-icons/hi";
import { Spinner } from "flowbite-react";
import Table from "../../components/tables/base";
import { parseDate } from "../../helper/date";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/tables/pagination";
import BaseModal from "../../components/modal/base";
import { ModuleType } from "../../types/assessment-tools/module";
import { FormInput } from "../../components/forms/input";
import {
  FormSelect,
  FormSelectAsync,
} from "../../components/forms/input-select";
import moment from "moment-timezone";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import { ActivationCodeType } from "../../types/activation-code";
import { PsikologType } from "../../types/psikolog";
import { SelectOptionType } from "../../types/form";
import { Pencil } from "@phosphor-icons/react";

type FormValues = {
  modul_id: ModuleType;
  timezone: string;
  start_at: string;
  end_at: string;
  amount: number;
  type: SelectOptionType;
  psikolog_id: PsikologType;
};

type ErrorForm = {
  modul_id: [] | null;
  timezone: [] | null;
  start_at: [] | null;
  end_at: [] | null;
  amount: [] | null;
  psikolog_id: [] | null;
  type: [] | null;
};

const IndexActivationCode = () => {
  const [q, setQ] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalEditPsikolog, setModalEditPsikolog] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ActivationCodeType | null>(null);
  const [selectedPsikolog, setSelectedPsikolog] = useState<PsikologType | null>(
    null
  );

  const { handleSubmit, reset, control, watch, setValue } =
    useForm<FormValues>();
  const { activationCodes, setActivationCode } = useActivationCode();

  const navigate = useNavigate();

  const codeType = [
    { label: "Logos", value: "logos" },
    { label: "Deeptalk", value: "deeptalk" },
  ];

  const getActivationCode = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/activation-code", page, search, searchMode);
      return data;
    } catch {}
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getActivationCode(input ?? "", true);
    setActivationCode(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === activationCodes?.last_page) {
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

  const selectModules = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/tools/get-modules", {
      params: params,
    });
    return data.data.data;
  };

  const selectPsikolog = async (inputValue: string) => {
    let params = {
      q: inputValue,
      type: watch("type") ? watch("type").value : null,
    };
    const { data } = await request.get("/select/psikolog", {
      params: params,
    });
    return data.data?.data;
  };

  const selectPsikologById = async (id: string) => {
    let params = {
      id: id,
      type: watch("type") ? watch("type").value : null,
    };
    const { data } = await request.get("/select/psikolog", {
      params: params,
    });
    return data.data.data[0] ?? null;
  };

  const handleSave = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
        modul_id: data?.modul_id?.id,
        psikolog_id: data?.psikolog_id?.id ?? "",
        type: data?.type?.value,
        timezone: moment.tz.guess(),
      };
      await request.post("/activation-code", payload);
      setModalAdd(false);
      setModalMode(undefined);
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/activation-code/${selected?.id}/destroy`);
      setSelected(null);
      setModalDelete(false);
    } catch (err) {}
    reset();
    setLoadingSubmit(false);
  };

  const handleChangePsikolog = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        psikolog_id: data?.psikolog_id?.id,
      };
      await request.post(
        `/activation-code/${selected?.id}/change-psikolog`,
        payload
      );
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    reset();
    setModalEditPsikolog(false);
    setLoadingSubmit(false);
  });

  useEffect(() => {
    Promise.all([getActivationCode()]).then((res) => {
      setActivationCode(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Kode Aktivasi Asesmen"
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
          <Table.Th>Kode Aktivasi</Table.Th>
          <Table.Th>Modul</Table.Th>
          <Table.Th>Peserta</Table.Th>
          <Table.Th>Perusahaan</Table.Th>
          <Table.Th>Psikolog</Table.Th>
          <Table.Th>Tgl. Aktif</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={8} rows={5} />
          ) : (
            <>
              {activationCodes?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {activationCodes?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          activationCodes.per_page *
                            (activationCodes.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-1">
                          <span>{item.code}</span>
                          <span
                            className={`text-xs uppercase text-white font-bold px-2 rounded ${
                              item.type === "logos"
                                ? "bg-blue-600"
                                : "bg-pink-600"
                            }`}
                          >
                            {item.type === "logos" ? "L" : "D"}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td>{item.module_name ?? "-"}</Table.Td>
                      <Table.Td>{item.participant ?? "-"}</Table.Td>
                      <Table.Td>{item.company_name ?? "-"}</Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          {item.psikolog?.name ?? "-"}
                          <div>
                            <Pencil
                              onClick={async () => {
                                setSelected(item);
                                setModalEditPsikolog(true);
                                setValue(
                                  "psikolog_id",
                                  item.psikolog
                                    ? await selectPsikologById(
                                        item.psikolog?.id
                                      )
                                    : null
                                );
                              }}
                              className="text-blue-600 cursor-pointer"
                            />
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        {item.start_at
                          ? item.end_at &&
                            `${parseDate(item.start_at)} - ${parseDate(
                              item.end_at
                            )}`
                          : "-"}
                      </Table.Td>
                      <Table.Td>
                        <span
                          className={`${
                            item.status === "belum digunakan" &&
                            "text-yellow-400"
                          } ${item.status === "proses" && "text-blue-600"} ${
                            item.status === "selesai" && "text-green-500"
                          } p-1 rounded text-xs inline-block uppercase`}
                        >
                          {item.status}
                        </span>
                      </Table.Td>
                      <Table.Td>
                        <>
                          {item.status === "belum digunakan" ? (
                            <div className="flex items-center gap-1">
                              <div
                                onClick={() => {
                                  setModalDelete(true);
                                  setSelected(item);
                                }}
                                className="bg-red-600 text-white p-1 cursor-pointer hover:bg-red-700 rounded"
                              >
                                <HiTrash />
                              </div>
                              <div className="bg-green-600 text-white p-1 cursor-pointer hover:bg-green-700 rounded">
                                <HiKey />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <div
                                onClick={() =>
                                  navigate(`/activation-code/${item.code}`)
                                }
                                className="bg-blue-600 text-white p-1 cursor-pointer hover:bg-blue-700 rounded"
                              >
                                <HiExclamationCircle />
                              </div>
                              <div
                                className="bg-gray-600 text-white p-1 cursor-pointer hover:bg-gray-700 rounded"
                                onClick={() =>
                                  navigate(
                                    `/activation-code/${item.code}/sheet`
                                  )
                                }
                              >
                                <HiClipboardList />
                              </div>
                              <div className="bg-green-600 text-white p-1 cursor-pointer hover:bg-green-700 rounded">
                                <HiKey
                                  onClick={() =>
                                    navigate(
                                      `/activation-code/${item.code}/access`
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
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
        currentPage={activationCodes?.current_page ?? 1}
        totalPage={activationCodes?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title="Tambah Kode Aktivasi"
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <FormInput
          name="amount"
          control={control}
          type="number"
          label="Jumlah Kode"
          error={errors?.amount}
          defaultValue={1}
        />

        <FormSelectAsync
          label="Pilih Modul"
          name="modul_id"
          control={control}
          loadOption={selectModules}
          optionLabel={(option: ModuleType) => `${option.name}`}
          optionValue={(option: ModuleType) => `${option.id}`}
          error={errors?.modul_id}
        />

        <FormSelect
          label="Digunakan untuk"
          name="type"
          control={control}
          defaultValue={{ label: "Logos", value: "logos" }}
          options={codeType}
          error={errors?.type}
        />

        <FormSelectAsync
          label="Pilih Psikolog"
          name="psikolog_id"
          control={control}
          loadOption={selectPsikolog}
          optionLabel={(option: PsikologType) => `${option.fullname}`}
          optionValue={(option: PsikologType) => `${option.id}`}
          error={errors?.modul_id}
        />

        <FormInput
          name="start_at"
          control={control}
          type="datetime-local"
          label="Tanggal Mulai"
          error={errors?.start_at}
        />

        <FormInput
          name="end_at"
          control={control}
          type="datetime-local"
          label="Tanggal Akhir"
          error={errors?.end_at}
        />
        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleSave}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <BaseModal
        title={`Ubah Psikolog #${selected?.code}`}
        isOpen={modalEditPsikolog}
        close={() => setModalEditPsikolog(false)}
      >
        <FormSelectAsync
          label="Pilih Psikolog"
          name="psikolog_id"
          control={control}
          loadOption={selectPsikolog}
          defaultValue={selectedPsikolog}
          optionLabel={(option: PsikologType) => `${option.fullname}`}
          optionValue={(option: PsikologType) => `${option.id}`}
          error={errors?.modul_id}
        />

        <div className="mt-3 flex items-center justify-end">
          <Button className="px-8" onClick={handleChangePsikolog}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="kode aktivasi"
        name={selected?.code}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default IndexActivationCode;

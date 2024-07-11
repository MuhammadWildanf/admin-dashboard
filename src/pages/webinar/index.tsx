import { useEffect, useState } from "react";
import Layout from "../layout.tsx/app";
import { getData } from "../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../components/buttons/add";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../components/buttons";
import ModalDeleteConfirmation from "../../components/modal/delete-confirmation";
import BaseModal from "../../components/modal/base";
import Pagination from "../../components/tables/pagination";
import Table from "../../components/tables/base";
import { FormInput, FormInputPassword } from "../../components/forms/input";
import {
  FormSelect,
  FormSelectTimezone,
} from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { WebinarType } from "../../types/webinar";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useWebinar } from "../../stores/webinar";

type FormValues = {
  title: string;
  limit_peserta: number;
  author: string;
  image: FileList | null;
  date: string;
  time_start: string;
  time_end: string;
  media_layanan: string;
  harga_sertifikat: string;
  link: string;
};

type ErrorForm = {
  title: [] | null;
  limit_peserta: [] | null;
  author: [] | null;
  image: [] | null;
  date: [] | null;
  time_start: [] | null;
  time_end: [] | null;
  media_layanan: [] | null;
  harga_sertifikat: [] | null;
  link: [] | null;
};

const Webinar = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );
  const [modalReset, setModalReset] = useState<boolean>(false);
  const [randomString, setRandomString] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<WebinarType | null>(null);
  const { setWebinars, webinars } = useWebinar();
  const { setMessage } = useAlert();
  const { setValue, reset, handleSubmit, control } = useForm<FormValues>();



  const getWebinar = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/webinar", page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getWebinar(input ?? "", true);
    setWebinars(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === webinars?.last_page) {
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
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("limit_peserta", data.limit_peserta.toString());
      formData.append("author", data.author);
      formData.append("date", data.date);
      formData.append("time_start", data.time_start);
      formData.append("time_end", data.time_end);
      formData.append("media_layanan", data.media_layanan);
      formData.append("harga_sertifikat", data.harga_sertifikat);
      formData.append("link", data.link);
      if (data.image) {
        formData.append("image", data.image[0]);
      }
      if (modalMode === "create") {
        await request.post("/webinar/create", formData);
      } else {
        await request.post(`/webinar/${selected?.id}/update`, formData);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Webinar saved!", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
      console.log(err);
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: WebinarType) => {
    setSelected(item);
    setModalMode("edit");
    setValue("title", item.title ?? "");
    setValue("limit_peserta", item.limit_peserta);
    setValue("author", item.author);
    setValue("date", item.date);
    setValue("time_start", item.time_start);
    setValue("time_end", item.time_end);
    setValue("media_layanan", item.media_layanan);
    setValue("harga_sertifikat", item.harga_sertifikat);
    setValue("link", item.link);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/webinar/${selected?.id}/destroy`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Webinar deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getWebinar()]).then((res) => {
      setWebinars(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Webinar"
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
          <Table.Th>Title</Table.Th>
          <Table.Th>Limit Peserta</Table.Th>
          <Table.Th>Author</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Media Layanan</Table.Th>
          <Table.Th>Harga Sertifikat</Table.Th>
          <Table.Th>Link</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {webinars?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {webinars?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          webinars.per_page *
                          (webinars.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.title ?? ""}</Table.Td>
                      <Table.Td>{item.limit_peserta?.toString() ?? ""}</Table.Td>
                      <Table.Td>{item.author ?? ""}</Table.Td>
                      <Table.Td>{item.date ?? ""}</Table.Td>
                      <Table.Td>{item.media_layanan ?? ""}</Table.Td>
                      <Table.Td>{item.harga_sertifikat ?? ""}</Table.Td>
                      <Table.Td>{item.link ?? ""}</Table.Td>
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
        currentPage={webinars?.current_page ?? 1}
        totalPage={webinars?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Counseling" : "Edit Counseling"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <form>
          <FormInput
            name="title"
            control={control}
            label="Title"
            error={errors?.title}
          />
          <FormInput
            name="limit_peserta"
            control={control}
            label="Limit Peserta"
            error={errors?.limit_peserta}
          />
          <FormInput
            name="author"
            control={control}
            label="Author"
            error={errors?.author}
          />
          <FormInput
            name="date"
            type="date"
            control={control}
            label="Date"
            error={errors?.date}
          />
          <FormInput
            name="time_start"
            type="time"
            control={control}
            label="Time Start"
            error={errors?.time_start}
          />
          <FormInput
            name="time_end"
            type="time"
            control={control}
            label="Time End"
            error={errors?.time_end}
          />
          <FormInput
            name="media_layanan"
            control={control}
            label="Media Layanan"
            error={errors?.media_layanan}
          />
          <FormInput
            name="harga_sertifikat"
            control={control}
            label="Harga Sertifikat"
            error={errors?.harga_sertifikat}
          />
          <FormInput
            name="link"
            control={control}
            label="Link"
            error={errors?.link}
          />
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) =>
                setValue("image", e.target.files ? e.target.files : null)
              }
            />
            {errors?.image && (
              <p className="mt-2 text-sm text-red-600">{errors.image}</p>
            )}
          </div>
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
        name={selected?.title ?? ""}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default Webinar;

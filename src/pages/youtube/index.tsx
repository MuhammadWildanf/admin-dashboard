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
import { YoutubeType } from "../../types/youtube";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";
import { useYouTube } from "../../stores/youtube";

type FormValues = {
  title: string;
  categories_id: number;
  link: string;
  image: string;
};

type ErrorForm = {
  title: [] | null;
  categories_id: [] | null;
  link: [] | null;
  image: [] | null;
};

const Counseling = () => {
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
  const [selected, setSelected] = useState<YoutubeType | null>(null);

  const forms = useForm<FormValues>({
    defaultValues: {
      
    },
  });
  const { setYouTubeVideos, youTubeVideos } = useYouTube();
  const { setMessage } = useAlert();

  const getYoutubevideo = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/youtube" , page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await getYoutubevideo(input ?? "", true);
    setYouTubeVideos(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === youTubeVideos?.last_page) {
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

  const handleSave = forms.handleSubmit(async (data) => {
    setLoadingSubmit(true);
    try {
      let payload = {
        ...data,
      };
      if (modalMode === "create") {
        await request.post("/youtube/create", payload);
      } else {
        await request.post(`/youtube/${selected?.id}/update`, payload);
      }
      setModalAdd(false);
      setModalMode(undefined);
      setMessage("Youtube saved!", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
      console.log(err);
    }
    setErrors(null);
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: YoutubeType) => {
    setSelected(item);
    setModalMode("edit");
    forms.setValue("title", item.title ?? "");
    forms.setValue("categories_id", item.categories_id);
    forms.setValue("link", item.link);
    forms.setValue("image", item.image);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/youtube/${selected?.id}/destroy`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Youtube deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([getYoutubevideo()]).then((res) => {
      setYouTubeVideos(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Youtube"
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
          forms.reset();
        }}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Categories</Table.Th>
          <Table.Th>Link</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {youTubeVideos?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {youTubeVideos?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          youTubeVideos.per_page *
                          (youTubeVideos.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.title ?? ""}</Table.Td>
                      <Table.Td>{item.categories_id?.toString() ?? ""}</Table.Td>
                      <Table.Td>{item.link ?? ""}</Table.Td>
                      <Table.Td>{item.image ?? ""}</Table.Td>
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
        currentPage={youTubeVideos?.current_page ?? 1}
        totalPage={youTubeVideos?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <BaseModal
        title={modalMode === "create" ? "Tambah Counseling" : "Edit Counseling"}
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
      >
        <FormProvider {...forms}>
          <form>
            <FormInput
              name="title"
              control={forms.control}
              label="Title"
              error={errors?.title}
            />
            <FormInput
              name="categories_id"
              control={forms.control}
              label="Categories"
              error={errors?.categories_id}
            />
            <FormInput
              name="link"
              control={forms.control}
              label="Link"
              error={errors?.link}
            />
            <FormInput
              name="image"
              control={forms.control}
              label="Image"
              error={errors?.image}
            />
            <div className="mt-3 flex items-center justify-end">
              <Button className="px-8" onClick={handleSave}>
                {loadingSubmit ? <Spinner /> : "Simpan"}
              </Button>
            </div>
          </form>
        </FormProvider>
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

export default Counseling;

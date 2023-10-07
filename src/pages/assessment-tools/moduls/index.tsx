import { useEffect, useState } from "react";
import { InputSearch } from "../../../components/forms/input-search";
import Layout from "../../layout.tsx/app";
import { request } from "../../../api/config";
import { useTestModules } from "../../../stores/assessment-tools/modules";
import Table from "../../../components/tables/base";
import Pagination from "../../../components/tables/pagination";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import AddButton from "../../../components/buttons/add";
import BaseModal from "../../../components/modal/base";
import { FormInput } from "../../../components/forms/input";
import { TestType } from "../../../types/assessment-tools/test";
import { useForm } from "react-hook-form";
import { FormSelectAsync } from "../../../components/forms/input-select";
import { FormTextArea } from "../../../components/forms/input-textarea";
import { Button } from "../../../components/buttons";
import { Spinner } from "flowbite-react";
import { error } from "console";
import { ModuleType } from "../../../types/assessment-tools/module";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import { useAlert } from "../../../stores/alert";

type FormValues = {
  name: string;
  test: TestType[] | [];
  notes: string;
};

type ErrorForm = {
  name: [] | null;
  test: [] | null;
  notes: [] | null;
};

const IndexModule = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [moduleSelected, setModuleSelected] = useState<ModuleType | undefined>(
    undefined
  );
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorForm | undefined>(undefined);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>(
    undefined
  );

  const { modules, setModules } = useTestModules();
  const { control, handleSubmit, setValue, reset } = useForm<FormValues>();
  const { setMessage } = useAlert();

  const getModules = async (q?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      let params = {
        q: q ?? "",
        page: searchMode ? 1 : page ?? 1,
      };
      const { data } = await request.get("/tools/get-modules", {
        params: params,
      });
      return data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async (input: string) => {
    setQ(input);
    const data = await getModules(input, true);
    setModules(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === modules?.last_page) {
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

  const selectTest = async (inputValue: string) => {
    let params = {
      q: inputValue,
    };
    const { data } = await request.get("/tools/get-test-tools", {
      params: params,
    });
    return data.data.data;
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoadingSubmit(true);
    if (modalMode === "create") {
      try {
        let payload = {
          ...data,
          test: data.test ? data.test.map((item) => item.id) : [],
        };
        const { data: res } = await request.post(
          "/tools/create-module",
          payload
        );
        await getModules();
        setLoading(false);
        setModalAdd(false);
        setMessage(res.message, "success");
      } catch (err: any) {
        setErrors(err.response.data.errors);
      }
    } else if (modalMode === "edit") {
      try {
        let payload = {
          ...data,
          test: data.test ? data.test.map((item) => item.id) : [],
          _method: "PUT",
        };
        const { data: res } = await request.post(
          `/tools/update-module/${moduleSelected?.id}`,
          payload
        );
        await getModules();
        setLoading(false);
        setModuleSelected(undefined);
        setModalAdd(false);
        setMessage(res.message, "success");
      } catch (err: any) {
        setErrors(err.response.data.errors);
      }
    }
    setLoadingSubmit(false);
  });

  const handleFormEdit = (item: ModuleType) => {
    setModuleSelected(item);
    setModalMode("edit");
    setValue("name", item.name ?? "");
    setValue("notes", item.notes ?? "");
    setValue("test", item.detail.map((item) => item.test) ?? []);
    setModalAdd(true);
  };

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/tools/delete-module/${moduleSelected?.id}`);
      setModuleSelected(undefined);
      await getModules();
      setLoading(false);
    } catch {}
    setLoadingSubmit(false);
    setModalDelete(false);
  };

  useEffect(() => {
    Promise.all([getModules()]).then((res) => {
      setModules(res[0]);
    });

    setLoading(false);
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Alat Tes"
      pageTitleContent={
        <InputSearch onChange={(e) => handleSearch(e.target.value)} q={q} />
      }
    >
      <AddButton
        onClick={() => {
          setModalAdd(true);
          setModalMode("create");
          reset();
        }}
      />
      <div className="w-full bg-white rounded-lg">
        <Table>
          <Table.Thead>
            <Table.Th>#</Table.Th>
            <Table.Th>Nama Modul</Table.Th>
            <Table.Th>List Alat Test</Table.Th>
            <Table.Th className="text-center">Opsi</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td>
                  <Table.Loading />
                </Table.Td>
                <Table.Td>
                  <Table.Loading />
                </Table.Td>
                <Table.Td>
                  <Table.Loading />
                </Table.Td>
                <Table.Td>
                  <Table.Loading />
                </Table.Td>
              </Table.Tr>
            ) : (
              <>
                {modules?.data.map((item, key) => (
                  <Table.Tr>
                    <Table.Td>
                      {(
                        key +
                        1 +
                        modules.per_page * (modules.current_page - 1)
                      ).toString()}
                    </Table.Td>
                    <Table.Td>{item?.name ?? "-"}</Table.Td>
                    <Table.Td style={{ minWidth: "50%" }}>
                      <div className="block gap-2 items-center">
                        {item.detail.map((item, key) => (
                          <div
                            key={key}
                            className="p-1 px-2 text-xs bg-blue-50 rounded inline-flex mr-1 mb-1"
                          >
                            {item?.test?.name ?? "-"}
                          </div>
                        ))}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleFormEdit(item)}
                          className="text-lg cursor-pointer text-blue-700 hover:text-blue-800"
                        >
                          <HiOutlinePencil />
                        </button>
                        <button
                          onClick={() => {
                            setModuleSelected(item);
                            setModalDelete(true);
                          }}
                          className="text-lg cursor-pointer text-red-700 hover:text-red-800"
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </>
            )}
          </Table.Tbody>
        </Table>
        <Pagination
          currentPage={modules?.current_page ?? 1}
          totalPage={modules?.last_page ?? 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>

      <BaseModal
        title="Tambah Modul"
        isOpen={modalAdd}
        close={() => setModalAdd(false)}
        size="xl"
      >
        <FormInput
          label="Nama Modul"
          name="name"
          control={control}
          error={errors?.name}
        />
        <FormSelectAsync
          label="Pilih Alat Test"
          name="test"
          control={control}
          loadOption={selectTest}
          multiple={true}
          optionLabel={(option: TestType) => `${option.name}`}
          optionValue={(option: TestType) => `${option.id}`}
          error={errors?.test}
        />
        <FormTextArea
          label="Catatan"
          name="notes"
          control={control}
          error={errors?.notes}
        />
        <div className="mt-3 flex items-center justify-end">
          <Button className="px-6" disabled={loadingSubmit} onClick={onSubmit}>
            {loadingSubmit ? <Spinner /> : "Simpan"}
          </Button>
        </div>
      </BaseModal>

      <ModalDeleteConfirmation
        isOpen={modalDelete}
        close={() => setModalDelete(false)}
        subTitle="modul"
        name={moduleSelected?.name}
        loading={loadingSubmit}
        action={handleDelete}
      />
    </Layout>
  );
};

export default IndexModule;

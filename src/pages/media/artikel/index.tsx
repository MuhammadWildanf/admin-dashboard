import { useEffect, useState, ChangeEvent, useRef } from "react";
import Layout from "../../layout.tsx/app";
import { getData } from "../../../api/get-data";
import { HiOutlineSearch, HiTrash, HiX } from "react-icons/hi";
import { Spinner } from "flowbite-react";
import AddButton from "../../../components/buttons/add";
import ModalDeleteConfirmation from "../../../components/modal/delete-confirmation";
import Pagination from "../../../components/tables/pagination";
import Table from "../../../components/tables/base";
import { ArticleType } from "../../../types/articles";
import { request } from "../../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../../stores/alert";
import { useArticles } from "../../../stores/articles";
import { useNavigate } from "react-router-dom";


type ErrorForm = {
  title: [] | null;
  author: [] | null;
  categories_id: [] | null;
  date: [] | null;
  image: [] | null;
  link: [] | null;
  categories: [] | null;
};

const IndexArticle = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [errors, setErrors] = useState<ErrorForm | null>(null);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selected, setSelected] = useState<ArticleType | null>(null);
  const { setArticles, GetArticles } = useArticles();
  const { setMessage } = useAlert();
  const navigate = useNavigate();



  const GetAllArticle = async (
    search?: string,
    searchMode: boolean = false
  ) => {
    setLoading(true);
    try {
      const data = await getData("/artikel", page, search, searchMode);
      return data;
    } catch { }
  };

  const handleSearch = async (input: string | undefined) => {
    setQ(input);
    const data = await GetAllArticle(input ?? "", true);
    setArticles(data);
    setLoading(false);
  };

  const handleNext = () => {
    if (page === GetArticles?.last_page) {
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

  const handleDelete = async () => {
    setLoadingSubmit(true);
    try {
      await request.delete(`/artikel/${selected?.id}`);
      setSelected(null);
      setModalDelete(false);
      setMessage("Article deleted", "success");
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  };

  useEffect(() => {
    Promise.all([GetAllArticle()]).then((res) => {
      setArticles(res[0]);
      setLoading(false);
    });
  }, [page, loadingSubmit]);

  return (
    <Layout
      withPageTitle
      title="Manajemen Artikel"
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
        onClick={() => navigate('create')}
      />
      <Table>
        <Table.Thead>
          <Table.Th>#</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Author</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Sub Category</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Image</Table.Th>
          <Table.Th className="text-center">Opsi</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.TrLoading cols={7} rows={4} />
          ) : (
            <>
              {GetArticles?.data.length === 0 ? (
                <Table.Tr>
                  <Table.Td cols={8} className="text-center py-3">
                    Tidak ada data ditemukan!
                  </Table.Td>
                </Table.Tr>
              ) : (
                <>
                  {GetArticles?.data.map((item, key) => (
                    <Table.Tr key={key}>
                      <Table.Td>
                        {(
                          key +
                          1 +
                          GetArticles.per_page *
                          (GetArticles.current_page - 1)
                        ).toString()}
                      </Table.Td>
                      <Table.Td>{item.title ?? ""}</Table.Td>
                      <Table.Td>{item.author ?? ""}</Table.Td>
                      <Table.Td>{item.categories_id?.name ?? ""}</Table.Td>
                      <Table.Td>
                        {item.sub_categories.map((e, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                          >
                            {e.name}
                          </span>
                        ))}
                      </Table.Td>
                      <Table.Td>{item.date ?? ""}</Table.Td>
                      <Table.Td>
                        {item.image && (
                          <img
                            src={item.image}
                            alt="Image"
                            className="h-10 w-10 object-cover"
                          />
                        )}
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
                            onClick={() => navigate(`${item.id}`)}
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
        currentPage={GetArticles?.current_page ?? 1}
        totalPage={GetArticles?.last_page ?? 1}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

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

export default IndexArticle;

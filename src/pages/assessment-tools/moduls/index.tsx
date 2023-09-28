import { useEffect, useState } from "react";
import { InputSearch } from "../../../components/forms/input-search";
import Layout from "../../layout.tsx/app";
import { request } from "../../../api/config";
import { useTestModules } from "../../../stores/assessment-tools/modules";
import Table from "../../../components/tables/base";
import Pagination from "../../../components/tables/pagination";

const IndexModule = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { modules, setModules } = useTestModules();

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
    setLoading(false);
  };

  const handleSearch = async (input: string) => {
    setQ(input);
    const data = await getModules(input, true);
    setModules(data);
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

  useEffect(() => {
    Promise.all([getModules()]).then((res) => {
      setModules(res[0]);
    });
  }, [loading, page]);

  return (
    <Layout
      withPageTitle
      title="Alat Tes"
      pageTitleContent={
        <InputSearch onChange={(e) => handleSearch(e.target.value)} q={q} />
      }
    >
      <div className="w-full bg-white rounded-lg">
        <Table>
          <Table.Thead>
            <Table.Th>#</Table.Th>
            <Table.Th>Nama Modul</Table.Th>
            <Table.Th>List Alat Test</Table.Th>
            <Table.Th>Opsi</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {modules?.data.map((item, key) => (
              <Table.Tr>
                <Table.Td>
                  {(
                    key +
                    1 +
                    modules.per_page * (modules.current_page - 1)
                  ).toString()}
                </Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td style={{ minWidth: "50%" }}>
                  <div className="block gap-2 items-center">
                    {item.detail.map((item, key) => (
                      <div
                        key={key}
                        className="p-1 px-2 text-xs bg-blue-50 rounded inline-flex mr-1 mb-1"
                      >
                        {item.test.name}
                      </div>
                    ))}
                  </div>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Pagination
          currentPage={modules?.current_page ?? 1}
          totalPage={modules?.last_page ?? 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </Layout>
  );
};

export default IndexModule;

import { useEffect, useState } from "react";
import Table from "../../../components/tables/base";
import { useTestTools } from "../../../stores/assessment-tools/test";
import Layout from "../../layout.tsx/app";
import { request } from "../../../api/config";
import { InputSearch } from "../../../components/forms/input-search";
import Pagination from "../../../components/tables/pagination";

const IndexTestTool = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const { setTestTools, testTools } = useTestTools();

  const getTestTools = async (q?: string, searchMode: boolean = false) => {
    setLoading(true);
    try {
      let params = {
        q: q ?? "",
        page: searchMode ? 1 : page ?? 1,
      };
      const { data } = await request.get("/tools/get-test-tools", {
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
    const data = await getTestTools(input, true);
    setTestTools(data);
  };

  const handleNext = () => {
    if (page === testTools?.last_page) {
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
    Promise.all([getTestTools()]).then((res) => {
      setTestTools(res[0]);
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
            <Table.Th>Kode Tes</Table.Th>
            <Table.Th>Nama Tes</Table.Th>
            <Table.Th>Jenis Tes</Table.Th>
            <Table.Th>Opsi</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {testTools?.data.map((item, key) => (
              <Table.Tr>
                <Table.Td>
                  {(
                    key +
                    1 +
                    testTools.per_page * (testTools.current_page - 1)
                  ).toString()}
                </Table.Td>
                <Table.Td>{item.code}</Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.type}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Pagination
          currentPage={testTools?.current_page ?? 1}
          totalPage={testTools?.last_page ?? 1}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </Layout>
  );
};

export default IndexTestTool;

import { useEffect, useState } from "react";
import { useCounseling } from "../../stores/counseling";
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
import { useNavigate } from "react-router-dom";
import { FormInput, FormInputPassword } from "../../components/forms/input";
import {
    FormSelect,
    FormSelectTimezone,
} from "../../components/forms/input-select";
import { SelectOptionType } from "../../types/form";
import { Counseling } from "../../types/counseling";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";

const IndexCounseling = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [q, setQ] = useState<string | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const { setCounseling, counseling } = useCounseling();

    const navigate = useNavigate();

    const getCounseling = async (search?: string, searchMode: boolean = false) => {
        setLoading(true);
        try {
            const data = await getData("/manage-counseling/", page, search, searchMode);
            return data;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (input: string | undefined) => {
        setQ(input);
        const data = await getCounseling(input ?? "", true);
        setCounseling(data);
    };

    const handleNext = () => {
        if (counseling && page === counseling.last_page) {
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
        const fetchData = async () => {
            const data = await getCounseling();
            setCounseling(data);
        };
        fetchData();
    }, [page, loadingSubmit, setCounseling]);

    return (
        <Layout
            withPageTitle
            title="Manage Counseling Request"
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
            <Table>
                <Table.Thead>
                    {/* <Table.Th>#</Table.Th> */}
                    {/* <Table.Th>ID</Table.Th> */}
                    <Table.Th>Psikolog</Table.Th>
                    <Table.Th>Counseling Service</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                    {loading ? (
                        <Table.TrLoading cols={7} rows={4} />
                    ) : (
                        <>
                            {counseling?.data?.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td cols={8} className="text-center py-3">
                                        Tidak ada data ditemukan!
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                <>
                                    {counseling?.data?.map((item, key) => (
                                        <Table.Tr
                                            key={key}
                                            className={`cursor-pointer hover:bg-gray-100`}
                                            onClick={() => navigate(`/manage-request/${item.id}`)}
                                        >
                                            {/* <Table.Td>
                                                {(
                                                    key +
                                                    1 +
                                                    counseling.per_page * (counseling.current_page - 1)
                                                ).toString()}
                                            </Table.Td> */}
                                            {/* <Table.Td>{item.id ?? ""}</Table.Td> */}
                                            <Table.Td>{item.psikolog.name ?? ""}</Table.Td>
                                            <Table.Td>{item.counseling_service.name ?? ""}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </Table.Tbody>
            </Table>
            <Pagination
                currentPage={counseling?.current_page ?? 1}
                totalPage={counseling?.last_page ?? 1}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />
        </Layout>
    );
};

export default IndexCounseling;

import { useEffect, useState } from "react";
import { useBooking } from "../../stores/booking";
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
import { Booking } from "../../types/booking";
import { request } from "../../api/config";
import { Key, Pencil, Trash } from "@phosphor-icons/react";
import { useAlert } from "../../stores/alert";
import moment from "moment";


const IndexBooking = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [q, setQ] = useState<string | undefined>(undefined);
    const [page, setPage] = useState<number>(1);
    const { setBooking, booking } = useBooking();

    const roles = [
        { label: "Super Admin", value: "superadmin" },
        { label: "Admin", value: "admin" },
        { label: "Finance", value: "finance" },
        { label: "QC", value: "qc" },
    ];

  const navigate = useNavigate();


    const getBooking = async (search?: string, searchMode: boolean = false) => {
        setLoading(true);
        try {
            const data = await getData("/manage-request/", page, search, searchMode);
            return data;
        } catch { }
    };

    const handleSearch = async (input: string | undefined) => {
        setQ(input);
        const data = await getBooking(input ?? "", true);
        setBooking(data);
        setLoading(false);
    };

    const handleNext = () => {
        if (page === booking?.last_page) {
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
        Promise.all([getBooking()]).then((res) => {
            setBooking(res[0]);
            setLoading(false);
        });
    }, [page, loadingSubmit]);
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
                    <Table.Th>#</Table.Th>
                    <Table.Th>Psikolog</Table.Th>
                    <Table.Th>Peserta</Table.Th>
                    <Table.Th>Status</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                    {loading ? (
                        <Table.TrLoading cols={7} rows={4} />
                    ) : (
                        <>
                            {booking?.data.length === 0 ? (
                                <Table.Tr>
                                    <Table.Td cols={8} className="text-center py-3">
                                        Tidak ada data ditemukan!
                                    </Table.Td>
                                </Table.Tr>
                            ) : (
                                <>
                                    {booking?.data.map((item, key) => (
                                        <Table.Tr 
                                        key={key}
                                        className={`cursor-pointer hover:bg-gray-100 ${item.status.value === "disetujui" && "bg-green-50"}`}
                                          onClick={() => navigate(`/manage-request/${item.id}`)}
                                        >
                                            <Table.Td>
                                                {(
                                                    key +
                                                    1 +
                                                    booking.per_page * (booking.current_page - 1)
                                                ).toString()}
                                            </Table.Td>
                                            <Table.Td>{item.psikolog.fullname ?? ""}</Table.Td>
                                            <Table.Td>{item.user.fullname ?? ""}</Table.Td>
                                            <Table.Td>
                                                <span
                                                    className="text-xs py-1 px-3 rounded"
                                                    style={{ backgroundColor: item.status.color, color: '#fff' }}
                                                >
                                                    {item.status.label}
                                                </span>
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
                currentPage={booking?.current_page ?? 1}
                totalPage={booking?.last_page ?? 1}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />

        </Layout>
    );
};

export default IndexBooking;
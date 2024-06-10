import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBooking } from "../../stores/booking";
import LoadingPage from "../layout.tsx/loading";
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


const DetailBooking = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const { setDetail, detail } = useBooking();
    const { id } = useParams();


    const getBooking = async () => {
        setLoading(true);
        try {
            const { data } = await request.get(`/manage-request/${id}`);
            console.log(data.data);
            return data.data;
        } catch (err: any) {
            console.log(err);

        }
    };

    useEffect(() => {
        Promise.all([getBooking()]).then((res) => {
            setDetail(res[0]);
            setLoading(false);
        });
    }, [page, loadingSubmit]);
    return (
        <Layout
            withPageTitle
            title="Manage Counseling Request"
        >
            <h5>detail</h5>
            {detail ? (
                <div>
                    <h6>Status: {detail.status.label}</h6>
                    <h6>User: {detail.user.fullname}</h6>
                    <img src={detail.user.avatar} alt="User Avatar" />
                    <h6>Psikolog: {detail.psikolog.fullname}</h6>
                    <img src={detail.psikolog.avatar} alt="Psikolog Avatar" />
                    <h6>Counseling Service: {detail.counseling_service.name}</h6>
                    <h6>Date: {detail.date}</h6>
                    <h6>Session Time: {detail.session.start_at} - {detail.session.end_at}</h6>
                    <h6>Method: {detail.method.name}</h6>
                    <h6>Sub Total: {detail.sub_total}</h6>
                    <h6>Discount: {detail.discount}</h6>
                    <h6>Grand Total: {detail.grand_total}</h6>
                    <h6>Notes: {detail.notes || 'None'}</h6>
                    <h6>Confirmation Notes: {detail.confirmation.notes}</h6>
                    <h6>Location: {detail.confirmation.face2face_location_name}</h6>
                    <h6>Location Address: {detail.confirmation.face2face_location_address}</h6>
                    <a href={`detail.confirmation.face2face_location_maps`}>Open Location in Maps</a>
                    {/* <h6>Report Notes: {detail.report.notes}</h6> */}
                    <a href={`detail.report.report_url`} target="_blank" rel="noopener noreferrer">Download Report</a>
                    <h6>Invoice: <a href={detail.invoice_url} target="_blank" rel="noopener noreferrer">View Invoice</a></h6>
                </div>
            ) : (
                <p>No booking details available.</p>
            )}
        </Layout>
    );
};

export default DetailBooking;
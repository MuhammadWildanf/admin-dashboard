import {
  HiChartPie,
  HiUserGroup,
  HiClock
} from "react-icons/hi";

import { MdOutlineDashboard } from "react-icons/md";

import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";

type Menu = {
  label: string;
  icon: any | null;
  href: string | null;
  name: string | null;
  notif?: number | string;
  child?: {
    label: string;
    name: string;
    href: string;
    notif?: number | string;
  }[];
};

const dashboardMenu = {
  label: "Dasbor",
  name: "dashboard",
  icon: MdOutlineDashboard,
  href: "/",
};


const ManagementPsikolog = {
  label: "Psikolog",
  name: "Psikolog",
  icon: FiFolder,
  href: "/psikolog",
};

const ManagementVoucher = {
  label: "Voucher",
  name: "Voucher",
  icon: FiFolder,
  href: "/voucher",
};

const ManagementArtikel = {
  label: "Artikel",
  name: "Artikel",
  icon: FiFolder,
  href: "/artikel",
};

const ManagementCategory = {
  label: "Category",
  name: "Category",
  icon: FiFolder,
  href: "/category",
};

const ManagementCounselings = {
  label: "Counselings",
  name: "Counselings",
  icon: FiFolder,
  href: "/counselings",
};

const ManagementCounselingProduct = {
  label: "Counseling Products",
  name: "CounselingProduct",
  icon: FiFolder,
  href: "/counseling-products",
};
const ManagementWebinar = {
  label: "Webinar",
  name: "Webinar",
  icon: FiFolder,
  href: "/webinar",
};
const ManagementYoutube = {
  label: "Youtube",
  name: "Youtube",
  icon: FiFolder,
  href: "/youtube",
};
const ManagementPrice = {
  label: "price",
  name: "price",
  icon: FiFolder,
  href: "/price",
};
const AssessmentProduct = {
  label: "Assessment Product",
  name: "assessmentProduct",
  icon: FiFolder,
  href: "/assessment-product",
};


export const menuUser: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ManagementArtikel,
  ManagementCategory,
  ManagementCounselings,
  ManagementCounselingProduct,
  ManagementWebinar,
  ManagementYoutube,
  AssessmentProduct
];

export const menuPsikolog: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ManagementArtikel,
  ManagementCategory,
  ManagementCounselings,
  ManagementCounselingProduct,
  ManagementWebinar,
  ManagementYoutube,
  AssessmentProduct
];
export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ManagementArtikel,
  ManagementCategory,
  ManagementCounselings,
  ManagementCounselingProduct,
  ManagementWebinar,
  ManagementYoutube,
  AssessmentProduct
];

export const menuAdmin: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ManagementArtikel,
  ManagementCategory,
  ManagementCounselings,
  ManagementCounselingProduct,
  ManagementWebinar,
  ManagementYoutube,
  ManagementPrice,
  AssessmentProduct
];




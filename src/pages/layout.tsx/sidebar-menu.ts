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


const ProductMenu = {
  label:"Product",
  name:"product",
  icon: FiFolder,
  href:"#",
  child:[
    { label: "Counselings", name: "Counselings", href: "/product/counselings"},
    { label: "Counseling Products", name: "CounselingProduct", href: "/product/counseling-products"},
    { label: "price", name: "price",  href: "/product/price"}
  ],
}

const MediaMenu = {
  label:"Media",
  name:"media",
  icon: FiFolder,
  href:"#",
  child:[
    { label: "Category", name: "Category", href: "/media/category"},
    { label: "Artikel", name: "Artikel", href: "/media/artikel"},
    { label: "Webinar", name: "Webinar",  href: "/media/webinar"},
    { label: "Youtube", name: "Youtube",  href: "/media/youtube"},
  ],
}


const AssessmentMenu = {
  label:"Assestment",
  name:"assestment",
  icon: FiFolder,
  href:"#",
  child:[
    { label: "Group", name: "Group", href: "/assestment/group"},
    { label: "Product", name: "Product", href: "/assestment/product"},
  ],
}


export const menuUser: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ProductMenu,
  MediaMenu,
];

export const menuAdmin: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
  ManagementVoucher,
  ProductMenu,
  MediaMenu,
];




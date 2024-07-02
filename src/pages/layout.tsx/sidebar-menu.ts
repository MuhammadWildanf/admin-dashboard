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
;


export const menuUser: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
];

export const menuPsikolog: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
];
export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
];

export const menuAdmin: Menu[] = [
  dashboardMenu,
  ManagementPsikolog,
];




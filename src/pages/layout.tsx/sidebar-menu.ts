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




const ManagementCounselingServicesMenu = {
  label: "Counseling Services",
  name: "CounselingService",
  icon: FiFolder,
  href: "/manage-counseling",
};
const timeSlotManagementMenu = {
  label: "Time Slot",
  name: "timeslot",
  icon: HiClock,
  href: "/time-slot-management",
};

const bookingMenu = {
  label: "Booking",
  name: "booking",
  icon: HiChartPie,
  href: "/manage-request",
};


export const menuUser: Menu[] = [
  dashboardMenu,
  ManagementCounselingServicesMenu,
  timeSlotManagementMenu,
  bookingMenu,
];

export const menuPsikolog: Menu[] = [
  dashboardMenu,
  ManagementCounselingServicesMenu,
  timeSlotManagementMenu,
  bookingMenu,
];
export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  ManagementCounselingServicesMenu,
  timeSlotManagementMenu,
  bookingMenu,
];

export const menuAdmin: Menu[] = [
  dashboardMenu,
  ManagementCounselingServicesMenu,
  timeSlotManagementMenu,
  bookingMenu,
];




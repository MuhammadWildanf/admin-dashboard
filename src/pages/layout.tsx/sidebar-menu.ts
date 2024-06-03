import {
  HiChartPie,
  HiUserGroup,
} from "react-icons/hi";

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
  icon: HiChartPie,
  href: "/",
};

const userManagementMenu = {
  label: "Manajemen User",
  name: "users",
  icon: HiUserGroup,
  href: "#",
  child: [
    { label: "Admin", name: "admin", href: "/users/admin" },
    { label: "Psikolog", name: "psikolog", href: "/users/psikolog" },
  ],
};




export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  userManagementMenu,
];

export const menuAdmin: Menu[] = [
  dashboardMenu,
];




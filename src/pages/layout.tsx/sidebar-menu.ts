import {
  HiChartPie,
  HiDocumentText,
  HiOutlineKey,
  HiUserGroup,
} from "react-icons/hi";
import { useSession } from "../../stores/session";

type Menu = {
  label: string;
  icon: any | null;
  href: string | null;
  name: string | null;
  child?: { label: string; name: string; href: string }[];
};

const dashboardMenu = {
  label: "Dasbor",
  name: "dashboard",
  icon: HiChartPie,
  href: "/",
};

const testToolMenu = {
  label: "Modul dan Alat Tes",
  name: "tools",
  icon: HiDocumentText,
  href: "#",
  child: [
    { label: "Modul", name: "modules", href: "/tools/modules" },
    { label: "Alat Test", name: "test-tools", href: "/tools/test-tools" },
  ],
};

const userManagementMenu = {
  label: "Manajemen User",
  name: "users",
  icon: HiUserGroup,
  href: "#",
  child: [{ label: "Admin", name: "admin", href: "/users/admin" }],
};

const activationCodeMenu = {
  label: "Kode Aktivasi",
  name: "activation-code",
  icon: HiOutlineKey,
  href: "/activation-code",
};

export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  activationCodeMenu,
  testToolMenu,
  userManagementMenu,
];

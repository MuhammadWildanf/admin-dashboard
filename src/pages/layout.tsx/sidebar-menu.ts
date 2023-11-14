import {
  HiBriefcase,
  HiCalculator,
  HiChartPie,
  HiClipboardList,
  HiCube,
  HiDocumentText,
  HiOutlineKey,
  HiReceiptTax,
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

const ProductMenu = {
  label: "Manajemen Produk",
  name: "product",
  icon: HiCube,
  href: "/product",
};

const CompanyMenu = {
  label: "Perusahaan & Klien",
  name: "partner",
  icon: HiBriefcase,
  href: "#",
  child: [
    { label: "Klien", name: "client", href: "/partner/client" },
    { label: "Perusahaan", name: "company", href: "/partner/company" },
  ],
};

const AsesmenMenu = {
  label: "Assessment Center",
  name: "asesmen",
  icon: HiClipboardList,
  href: "/asesmen",
};

const InvoiceMenu = {
  label: "Invoice & Tagihan",
  name: "invoice",
  icon: HiDocumentText,
  href: "#",
  child: [
    { label: "List Invoice", name: "", href: "/invoice/" },
    {
      label: "Buat Invoice Kosongan",
      name: "create-blank",
      href: "/invoice/create-blank",
    },
  ],
};

const JournalMenu = {
  label: "Jurnal Keuangan",
  name: "journal",
  icon: HiCalculator,
  href: "#",
  child: [
    {
      label: "Dasbor Jurnal",
      name: "dasbor",
      href: "/journal/dasbor",
    },
    {
      label: "Uang Masuk",
      name: "income",
      href: "/journal/income",
    },
    {
      label: "Invoice belum dibayar",
      name: "debt",
      href: "/journal/debt",
    },
    {
      label: "Pajak",
      name: "journal",
      href: "/journal/journal",
    },
  ],
};

const TaxMenu = {
  label: "Pajak",
  name: "tax",
  icon: HiReceiptTax,
  href: "#",
  child: [{ label: "Pengaturan", name: "setting", href: "/tax/setting" }],
};

export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  activationCodeMenu,
  testToolMenu,
  ProductMenu,
  CompanyMenu,
  AsesmenMenu,
  InvoiceMenu,
  JournalMenu,
  TaxMenu,
  userManagementMenu,
];

import {
  HiBriefcase,
  HiCalculator,
  HiChartPie,
  HiClipboardList,
  HiCog,
  HiCube,
  HiDocumentReport,
  HiDocumentText,
  HiOutlineKey,
  HiReceiptTax,
  HiUserGroup,
} from "react-icons/hi";

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
  child: [
    { label: "Admin", name: "admin", href: "/users/admin" },
    { label: "Psikolog", name: "psikolog", href: "/users/psikolog" },
  ],
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
  label: "Pendaftaran Asesmen",
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
      label: "Invoice belum dibayar",
      name: "unpaid",
      href: "/invoice/unpaid",
    },
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
      label: "Pajak",
      name: "taxes",
      href: "/journal/taxes",
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

const SettingMenu = {
  label: "Setting & Log",
  name: "setting",
  icon: HiCog,
  href: "#",
  child: [{ label: "Email Log", name: "email", href: "/setting/email" }],
};

const ReportMenu = {
  label: "Laporan Asesmen",
  name: "report",
  icon: HiDocumentReport,
  href: "/report",
};

export const menuSuperAdmin: Menu[] = [
  dashboardMenu,
  activationCodeMenu,
  ReportMenu,
  testToolMenu,
  ProductMenu,
  CompanyMenu,
  AsesmenMenu,
  InvoiceMenu,
  JournalMenu,
  TaxMenu,
  userManagementMenu,
  SettingMenu,
];

export const menuFinance: Menu[] = [
  dashboardMenu,
  CompanyMenu,
  InvoiceMenu,
  JournalMenu,
  TaxMenu,
];

export const menuQC: Menu[] = [dashboardMenu, ReportMenu];

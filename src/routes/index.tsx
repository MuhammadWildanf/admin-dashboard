import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import IndexTestTool from "../pages/assessment-tools/testtools";
import IndexTools from "../pages/assessment-tools";
import IndexModule from "../pages/assessment-tools/moduls";
import IndexActivationCode from "../pages/activation-codes";
import DetailActivationCode from "../pages/activation-codes/detail";
import SheetActivationCode from "../pages/activation-codes/sheet";
import AccessActivationCode from "../pages/activation-codes/access";
import ProfilePage from "../pages/profile";
import UserAdmin from "../pages/users/admins";
import PrintActivationCode from "../pages/activation-codes/print";
import ProductIndex from "../pages/product";
import ProductDetail from "../pages/product/detail";
import IndexAsesmen from "../pages/asesment-center";
import PendingAsesmen from "../pages/asesment-center/pending";
import DetailAsesmen from "../pages/asesment-center/detail";
import PartnerPage from "../pages/partner";
import ClientPage from "../pages/partner/client";
import CompanyPage from "../pages/partner/company";
import CompanyPendingPage from "../pages/partner/company/pending";
import CompanyDetailPage from "../pages/partner/company/detail";
import TaxPage from "../pages/tax";
import Maintenance from "../pages/maintenance";
import CreateInvoice from "../pages/invoice/create";
import CreateFromInvoice from "../pages/invoice/create-from";
import CreateBlankInvoice from "../pages/invoice/create-blank";
import InvoiceIndex from "../pages/invoice";
import InvoiceDetail from "../pages/invoice/detail";
import EditInvoice from "../pages/invoice/edit";
import InvoicePrint from "../pages/invoice/print";
import CompanyInvoice from "../pages/partner/company/invoice";
import AddCompanyInvoice from "../pages/partner/company/add-invoice";
import CreateClientInvoice from "../pages/partner/company/create-invoice";
import JournalIndex from "../pages/journal";
import InvoiceUnpaid from "../pages/invoice/unpaid";
import JournalIncome from "../pages/journal/income";
import JournalTax from "../pages/journal/taxes";
import AllAsesmen from "../pages/asesment-center/all";
import UserPsikolog from "../pages/users/psikolog";
import IndexReport from "../pages/report";
import ShowReport from "../pages/report/detail";
import SettingEmail from "../pages/settings/email";

export const routes = createBrowserRouter([
  {
    path: "/auth/login",
    element: (
      <Guest>
        <Login />
      </Guest>
    ),
  },
  {
    path: "/",
    element: (
      <Private>
        <Homepage />
      </Private>
    ),
  },
  {
    path: "/profile",
    element: (
      <Private>
        <ProfilePage />
      </Private>
    ),
  },
  {
    path: "/tools",
    element: (
      <Private>
        <IndexTools />
      </Private>
    ),
  },
  {
    path: "/tools/test-tools",
    element: (
      <Private>
        <IndexTestTool />
      </Private>
    ),
  },
  {
    path: "/tools/modules",
    element: (
      <Private>
        <IndexModule />
      </Private>
    ),
  },
  {
    path: "/activation-code",
    element: (
      <Private>
        <IndexActivationCode />
      </Private>
    ),
  },
  {
    path: "/activation-code/:code",
    element: (
      <Private>
        <DetailActivationCode />
      </Private>
    ),
  },
  {
    path: "/activation-code/:code/sheet",
    element: (
      <Private>
        <SheetActivationCode />
      </Private>
    ),
  },
  {
    path: "/activation-code/:code/access",
    element: (
      <Private>
        <AccessActivationCode />
      </Private>
    ),
  },
  {
    path: "/activation-code/:code/print",
    element: (
      <Private>
        <PrintActivationCode />
      </Private>
    ),
  },
  {
    path: "/users/admin",
    element: (
      <Private>
        <UserAdmin />
      </Private>
    ),
  },
  {
    path: "/users/psikolog",
    element: (
      <Private>
        <UserPsikolog />
      </Private>
    ),
  },
  {
    path: "/product",
    element: (
      <Private>
        <ProductIndex />
      </Private>
    ),
  },
  {
    path: "/product/:productId",
    element: (
      <Private>
        <ProductDetail />
      </Private>
    ),
  },
  {
    path: "/asesmen",
    element: (
      <Private>
        <IndexAsesmen />
      </Private>
    ),
  },
  {
    path: "/asesmen/all",
    element: (
      <Private>
        <AllAsesmen />
      </Private>
    ),
  },
  {
    path: "/asesmen/pending",
    element: (
      <Private>
        <PendingAsesmen />
      </Private>
    ),
  },
  {
    path: "/asesmen/:asesmenId",
    element: (
      <Private>
        <DetailAsesmen />
      </Private>
    ),
  },
  {
    path: "/partner",
    element: (
      <Private>
        <PartnerPage />
      </Private>
    ),
  },
  {
    path: "/partner/client",
    element: (
      <Private>
        <ClientPage />
      </Private>
    ),
  },
  {
    path: "/partner/company",
    element: (
      <Private>
        <CompanyPage />
      </Private>
    ),
  },
  {
    path: "/partner/company/pending",
    element: (
      <Private>
        <CompanyPendingPage />
      </Private>
    ),
  },
  {
    path: "/partner/company/:companyId",
    element: (
      <Private>
        <CompanyDetailPage />
      </Private>
    ),
  },
  {
    path: "/partner/company/:companyId/invoice",
    element: (
      <Private>
        <CompanyInvoice />
      </Private>
    ),
  },
  {
    path: "/partner/company/:companyId/add-invoice",
    element: (
      <Private>
        <AddCompanyInvoice />
      </Private>
    ),
  },
  {
    path: "/partner/company/:companyId/create-invoice",
    element: (
      <Private>
        <CreateClientInvoice />
      </Private>
    ),
  },
  {
    path: "/tax",
    element: (
      <Private>
        <TaxPage />
      </Private>
    ),
  },
  {
    path: "/tax/setting",
    element: (
      <Private>
        <TaxPage />
      </Private>
    ),
  },
  {
    path: "/tax/journal",
    element: (
      <Private>
        <Maintenance />
      </Private>
    ),
  },
  {
    path: "/invoice",
    element: (
      <Private>
        <Maintenance />
      </Private>
    ),
  },
  {
    path: "/invoice/create",
    element: (
      <Private>
        <CreateInvoice />
      </Private>
    ),
  },
  {
    path: "/invoice/create-from/:asesmenId",
    element: (
      <Private>
        <CreateFromInvoice />
      </Private>
    ),
  },
  {
    path: "/invoice/create-blank",
    element: (
      <Private>
        <CreateBlankInvoice />
      </Private>
    ),
  },
  {
    path: "/invoice/",
    element: (
      <Private>
        <InvoiceIndex />
      </Private>
    ),
  },
  {
    path: "/invoice/unpaid",
    element: (
      <Private>
        <InvoiceUnpaid />
      </Private>
    ),
  },
  {
    path: "/invoice/:invoiceId",
    element: (
      <Private>
        <InvoiceDetail />
      </Private>
    ),
  },
  {
    path: "/invoice/:invoiceId/edit",
    element: (
      <Private>
        <EditInvoice />
      </Private>
    ),
  },
  {
    path: "/invoice/:invoiceId/print",
    element: (
      <Private>
        <InvoicePrint />
      </Private>
    ),
  },
  {
    path: "/journal",
    element: (
      <Private>
        <JournalIndex />
      </Private>
    ),
  },
  {
    path: "/journal/dasbor",
    element: (
      <Private>
        <JournalIndex />
      </Private>
    ),
  },
  {
    path: "/journal/income",
    element: (
      <Private>
        <JournalIncome />
      </Private>
    ),
  },
  {
    path: "/journal/taxes",
    element: (
      <Private>
        <JournalTax />
      </Private>
    ),
  },
  {
    path: "/report",
    element: (
      <Private>
        <IndexReport />
      </Private>
    ),
  },
  {
    path: "/report/:code",
    element: (
      <Private>
        <ShowReport />
      </Private>
    ),
  },
  {
    path: "/setting/email",
    element: (
      <Private>
        <SettingEmail />
      </Private>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

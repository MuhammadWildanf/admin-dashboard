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
    path: "*",
    element: <NotFound />,
  },
]);

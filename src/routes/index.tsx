import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import IndexTestTool from "../pages/assessment-tools/testtools";
import IndexTools from "../pages/assessment-tools";
import IndexModule from "../pages/assessment-tools/moduls";

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
    path: "*",
    element: <NotFound />,
  },
]);

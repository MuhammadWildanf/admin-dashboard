import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import ProfilePage from "../pages/profile";
import UserAdmin from "../pages/users/admins";
import UserPsikolog from "../pages/users/psikolog";

import { createBrowserRouter } from "react-router-dom";

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
    path: "*",
    element: <NotFound />,
  },
]);

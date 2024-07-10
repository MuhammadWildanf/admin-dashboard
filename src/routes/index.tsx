import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import ProfilePage from "../pages/profile";
import IndexPsikolog from "../pages/psikolog/index";
import IndexVoucher from "../pages/voucher/index";
import IndexArtikel from "../pages/artikel/index";
import IndexCategory from "../pages/category/index";
import IndexCounselings from "../pages/counselings/index";
import IndexcounselingProduct from "../pages/counselingProduct/index";
import IndexWebinar from "../pages/webinar/index";
import IndexYoutube from "../pages/youtube/index";
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
    path: "/psikolog",
    element: (
      <Private>
        <IndexPsikolog />
      </Private>

    )
  },
  {
    path: "/voucher",
    element: (
      <Private>
        <IndexVoucher />
      </Private>

    )
  },
  {
    path: "/artikel",
    element: (
      <Private>
      <IndexArtikel />
      </Private>
    )
  },
  {
    path: "/category",
    element: (
      <Private>
      <IndexCategory />
      </Private>
    )
  },
  {
    path: "/counselings",
    element: (
      <Private>
      <IndexCounselings />
      </Private>
    )
  },
  {
    path: "/counseling-products",
    element: (
      <Private>
      <IndexcounselingProduct />
      </Private>
    )
  },
  {
    path: "/webinar",
    element: (
      <Private>
      <IndexWebinar />
      </Private>
    )
  },
  {
    path: "/youtube",
    element: (
      <Private>
      <IndexYoutube />
      </Private>
    )
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import ProfilePage from "../pages/profile";
import IndexPsikolog from "../pages/psikolog/index";
import IndexVoucher from "../pages/voucher/index";
import DetailVoucher from "../pages/voucher/list";
import IndexArtikel from "../pages/artikel/index";
import IndexCategory from "../pages/category/index";
import IndexCounselings from "../pages/counselings/index";
import IndexcounselingProduct from "../pages/counselingProduct/index";
import DetailcounselingProduct from "../pages/counselingProduct/list";
import IndexWebinar from "../pages/webinar/index";
import DetailWebinar from "../pages/webinar/list";
import IndexYoutube from "../pages/youtube/index";
import IndexPricing from "../pages/price/index";
import IndexAssessment from "../pages/assessmentProduct/index";
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
    path: "/voucher/create",
    element: (
      <Private>
        <DetailVoucher />
      </Private>

    )
  },
  {
    path: "/voucher/:id",
    element: (
      <Private>
        <DetailVoucher />
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
    path: "/counseling-products/create",
    element: (
      <Private>
        <DetailcounselingProduct />
      </Private>
    )
  },
  {
    path: "/counseling-products/:id",
    element: (
      <Private>
        <DetailcounselingProduct />
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
    path: "/webinar/create",
    element: (
      <Private>
        <DetailWebinar />
      </Private>
    )
  },
  {
    path: "/webinar/:id",
    element: (
      <Private>
        <DetailWebinar />
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
    path: "/price",
    element: (
      <Private>
        <IndexPricing />
      </Private>
    )
  },
  {
    path: "/assessment-product",
    element: (
      <Private>
        <IndexAssessment />
      </Private>
    )
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

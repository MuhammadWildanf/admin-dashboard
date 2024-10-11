import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import ProfilePage from "../pages/profile";
import IndexPsikolog from "../pages/psikolog/index";
import IndexVoucher from "../pages/voucher/index";
import DetailVoucher from "../pages/voucher/list";
import IndexArtikel from "../pages/media/artikel/index";
import IndexCategory from "../pages/media/category/index";
import IndexSubCategory from "../pages/media/subcategory/index";
import IndexCounselings from "../pages/product/counselings/index";
import IndexcounselingProduct from "../pages/product/counselingProduct/index";
import DetailcounselingProduct from "../pages/product/counselingProduct/list";
import IndexWebinar from "../pages/media/webinar/index";
import DetailWebinar from "../pages/media/webinar/list";
import DetailArtikel from "../pages/media/artikel/list";
import IndexYoutube from "../pages/media/youtube/index";
import IndexPricing from "../pages/product/price/index";
import IndexAssessment from "../pages/assesment/Product/index";
import IndexAssessmentGroup from "../pages/assesment/Group/index";
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
    path: "media/artikel",
    element: (
      <Private>
        <IndexArtikel />
      </Private>
    )
  },
  {
    path: "media/artikel/create",
    element: (
      <Private>
        <DetailArtikel />
      </Private>
    )
  },
  {
    path: "media/artikel/:id",
    element: (
      <Private>
        <DetailArtikel />
      </Private>
    )
  },
  {
    path: "media/category",
    element: (
      <Private>
        <IndexCategory />
      </Private>
    )
  },
  {
    path: "media/sub-category",
    element: (
      <Private>
        <IndexSubCategory />
      </Private>
    )
  },
  {
    path: "product/counselings",
    element: (
      <Private>
        <IndexCounselings />
      </Private>
    )
  },
  {
    path: "product/counseling-products",
    element: (
      <Private>
        <IndexcounselingProduct />
      </Private>
    )
  },
  {
    path: "product/counseling-products/create",
    element: (
      <Private>
        <DetailcounselingProduct />
      </Private>
    )
  },
  {
    path: "product/counseling-products/:id",
    element: (
      <Private>
        <DetailcounselingProduct />
      </Private>
    )
  },
  {
    path: "media/webinar",
    element: (
      <Private>
        <IndexWebinar />
      </Private>
    )
  },
  {
    path: "media/webinar/create",
    element: (
      <Private>
        <DetailWebinar />
      </Private>
    )
  },
  {
    path: "media/webinar/:id",
    element: (
      <Private>
        <DetailWebinar />
      </Private>
    )
  },
  {
    path: "media/youtube",
    element: (
      <Private>
        <IndexYoutube />
      </Private>
    )
  },
  {
    path: "product/price",
    element: (
      <Private>
        <IndexPricing />
      </Private>
    )
  },
  {
    path: "assestment/product",
    element: (
      <Private>
        <IndexAssessment />
      </Private>
    )
  },
  {
    path: "assestment/group",
    element: (
      <Private>
        <IndexAssessmentGroup />
      </Private>
    )
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

import Guest from "../middleware/guest";
import Private from "../middleware/private";
import Login from "../pages/auth/login";
import Homepage from "../pages/homepage";
import NotFound from "../pages/404";
import ProfilePage from "../pages/profile";
import IndexTimeSLot from "../pages/timeslot";
import IndexBooking from "../pages/booking";
import DetailBooking from "../pages/booking/detail";
import IndexCounseling from "../pages/counseling";
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
    path:"/manage-counseling",
    element:(
      <Private>
        <IndexCounseling />  
      </Private>
    )
  },
  {
    path:"/time-slot-management",
    element:(
      <Private>
        <IndexTimeSLot />  
      </Private>
    )
  },
  {
    path:"/manage-request",
    element:(
      <Private>
        <IndexBooking />  
      </Private>
    )
  },
  {
    path:"/manage-request/:id",
    element:(
      <Private>
        <DetailBooking />  
      </Private>
    )
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// import { Sidebar } from "flowbite-react";
// import { twMerge } from "tailwind-merge";
// import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
// import { useMenu } from "../../stores/menu";
// import { User } from "@phosphor-icons/react";
import { useSession } from "../../stores/session";
import { User } from "@phosphor-icons/react";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
import { HiMenuAlt3, HiCode } from "react-icons/hi";
import { menuAdmin, menuSuperAdmin, menuPsikolog, menuUser } from "./sidebar-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Dropdown, Navbar, Spinner } from "flowbite-react";
import { logout } from "../../services/auth";




const SidebarLayout = () => {
  let menus = menuUser;
  const { me } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [showUserIconOnly, setShowUserIconOnly] = useState(false); // New state to determine whether to show only user icon
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <div className={`bg-blue-800 min-h-screen ${open ? "w-72" : "w-16"} duration-500 text-gray-100 px-4 flex flex-col`}>
      <div className="py-3 flex justify-end">
        {/* <Link to="/" className="ml-3 flex items-center font-semibold text-xl tracking-tight">
            <HiCode className="mr-2" size={30} />
            Deeptalk
          </Link> */}
        <div className="flex items-center">
          <HiMenuAlt3 size={26} className="cursor-pointer ml-3" onClick={() => setOpen(!open)} />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4 relative">
        {menus?.map((menu, i) => (
          <Link
            to={menu.href || "/"} // Providing a fallback for 'to' prop
            key={i}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
          >
            <div>{React.createElement(menu.icon, { size: "20" })}</div>
            <h2
              style={{
                transitionDelay: `${i + 3}00ms`,
              }}
              className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
            >
              {menu.label}
            </h2>
            <h2
              className={`${open && "hidden"} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
            >
              {menu.label}
            </h2>
          </Link>
        ))}
      </div>
      {/* Profile Section */}
      <div className={`border-t flex p-3 ${!open && "hidden"} mt-auto`}>
        {showUserIconOnly ? (
          <User />
        ) : (
          <>
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
              <User size={30} className="text-gray-600" />
            </div>
            <div className="flex flex-col ml-3">
              <h4 className="font-semibold text-sm">{me?.fullname}</h4>
              <span className="text-xs text-white">{me?.email}</span>
            </div>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="ml-auto">
                  <MoreVertical size={20} />
                </div>
              }
              className="w-44"
            >

              <Dropdown.Item onClick={() => navigate("/profile")}>
                Profil
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner /> Logging out...
                  </div>
                ) : (
                  "Logout"
                )}
              </Dropdown.Item>
            </Dropdown>

          </>
        )}
      </div>
    </div>
  );
};

export default SidebarLayout;


// type Props = {
//   className?: string;
// };

// type MenuType = {
//   label: string;
//   icon: any | null;
//   href: string | null;
//   name: string | null;
//   notif?: number | string;
//   child?: {
//     label: string;
//     name: string;
//     href: string;
//     notif?: number | string;
//   }[];
// };

// const SidebarItems = ({ className }: Props) => {
//   const [menus, setMenus] = useState<MenuType[] | null>(null);
//   const { notification } = useSession();
//   const theme = {
//     root: {
//       base: "h-full flex flex-col",
//       collapsed: {
//         on: "w-16",
//         off: "w-64",
//       },
//       inner: `h-full overflow-y-auto overflow-x-hidden rounded bg-blue-600 shadow-lg py-4 px-3 flex flex-col justify-between`,
//     },
//     item: {
//       base: "text-gray-500",
//       active: "bg-gray-500 dark:bg-gray-700",
//       content: {
//         base: "text-red-400",
//       },
//     },
//   };

//   const { me } = useSession();

//   const location = useLocation();
//   const { pathname } = location;
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (me?.role === "superadmin") {
//       setMenus(menuSuperAdmin);
//     }

//     if (me?.role === "admin") {
//       setMenus(menuAdmin);
//     }

//     if (me?.role === "psikolog") {
//       setMenus(menuPsikolog);
//     }
//     setMenus(menuUser);
//   }, []);

//   return (
//     <Sidebar
//       className={`fixed h-screen select-none top-0 ${className}`}
//       theme={theme}
//     >
//       <Sidebar.Items className="pt-16 flex flex-col justify-between h-full">
//         <Sidebar.ItemGroup>
//           <>
//             {menus?.map((item, key) => (
//               <>
//                 {item.child ? (
//                   <Sidebar.Collapse
//                     key={key}
//                     icon={item.icon}
//                     label={item.label}
//                     className="text-sm text-white font-semibold" // Set text color for labels
//                     open={item.name === pathname.split("/")[1]}
//                     renderChevronIcon={(theme, open) => {
//                       const IconComponent = open ? HiOutlineMinusSm : HiOutlinePlusSm;
//                       return (
//                         <IconComponent aria-hidden className="text-red-400" />
//                       );
//                     }}
//                   >
//                     {item.child.map((child, key) => (
//                       <Sidebar.Item
//                         onClick={() => navigate(child.href ?? "/")}
//                         key={key}
//                         className={`text-sm cursor-pointer ${child.name === pathname.split("/")[2]
//                             ? "bg-gray-500 text-black" // Set text color for active item
//                             : "text-white font-semibold hover:text-black" // Set text color for hover state
//                           }`}
//                         active={child.name === pathname.split("/")[2]}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div>{child.label}</div>
//                         </div>
//                       </Sidebar.Item>
//                     ))}
//                   </Sidebar.Collapse>
//                 ) : (
//                   <Sidebar.Item
//                     key={key}
//                     onClick={() => navigate(item.href ?? "/")}
//                     icon={item.icon}
//                     className={`cursor-pointer text-sm ${item.name === pathname.split("/")[1]
//                         ? "bg-gray-500 text-black" // Set text color for active item
//                         : "text-white font-semibold hover:text-black" // Set text color for hover state
//                       }`}
//                     active={(item.name === "dashboard" && !pathname.split("/")[1]) || item.name === pathname.split("/")[1]}
//                   >
//                     <div className="flex items-center justify-between gap-3">
//                       <div>{item.label}</div>
//                       {item.name === "asesmen" && notification.new_assessment > 0 && (
//                         <div className="px-1 font-semibold text-sm bg-pink-600 rounded text-white font-semibold">
//                           {notification.new_assessment}
//                         </div>
//                       )}

//                       {item.name === "company" && notification.new_companies > 0 && (
//                         <div className="px-1 font-semibold text-sm bg-pink-600 rounded text-white font-semibold">
//                           {notification.new_companies}
//                         </div>
//                       )}
//                     </div>
//                   </Sidebar.Item>
//                 )}
//               </>
//             ))}
//           </>
//         </Sidebar.ItemGroup>
//         <div className="border-t flex p-3 mt-auto">
//           <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
//             <User size={30} className="text-gray-600" />
//           </div>
//           <div className="ml-3 flex justify-between items-center overflow-hidden transition-all">
//             <div className="leading-4">
//               <h4 className="text-white font-semibold">{me?.fullname}</h4>
//               <span className="text-xs text-white">{me?.email}</span>
//             </div>
//           </div>
//         </div>
//       </Sidebar.Items>
//     </Sidebar>
//   );
// };


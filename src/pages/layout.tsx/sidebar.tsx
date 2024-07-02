import { useSession } from "../../stores/session";
import { User } from "@phosphor-icons/react";
import { MoreVertical } from "lucide-react";
import { HiMenuAlt3 } from "react-icons/hi";
import { menuAdmin, menuSuperAdmin, menuPsikolog, menuUser } from "./sidebar-menu";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Dropdown, Spinner } from "flowbite-react";
import { logout } from "../../services/auth";

const SidebarLayout = () => {
  const { me } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  let menus = menuUser;
  if (me?.role === "superadmin") menus = menuSuperAdmin;
  if (me?.role === "admin") menus = menuAdmin;
  if (me?.role === "psikolog") menus = menuPsikolog;

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    navigate('/login');
  };
  
  return (
    <div className={`bg-blue-800 min-h-screen ${open ? "w-64" : "w-16"} duration-300 text-gray-100 px-4 flex flex-col`}>
      <div className="py-3 flex justify-end">
        <HiMenuAlt3 size={26} className={`cursor-pointer w-7 ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)} />
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
              style={{ transitionDelay: `${i + 3}00ms` }}
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
      <div className={`border-t flex items-center p-3 mt-auto ${!open && "justify-center"}`}>
        <div className="w-10 h-10 flex-shrink-0">
          {me?.avatar ? (
            <img src={me.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover border-2 border-white" />
          ) : (
            <User size={30} className="text-gray-600" />
          )}
        </div>
        {open && (
          <>
            <div className="flex flex-col ml-3">
              <h4 className="font-semibold text-sm">{me?.fullname}</h4>
              <span className="text-xs text-white">{me?.email}</span>
            </div>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <div className="ml-auto">
                  <MoreVertical size={30} />
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

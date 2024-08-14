import { useSession } from "../../stores/session";
import { User } from "@phosphor-icons/react";
import { MoreVertical } from "lucide-react";
import { HiMenuAlt3, HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
import { menuAdmin, menuUser } from "./sidebar-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Dropdown, Spinner } from "flowbite-react";
import { logout } from "../../services/auth";

const SidebarLayout = () => {
  const { me } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [collapsedMenus, setCollapsedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  let menus = menuUser;
  if (me?.role === "admin") menus = menuAdmin;

  useEffect(() => {
    // Buka menu collapse jika child aktif
    const initialCollapsedMenus = menus.reduce((acc, menu) => {
      if (menu.child && menu.child.some(child => location.pathname === child.href)) {
        acc[menu.name || ""] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setCollapsedMenus(initialCollapsedMenus);
  }, [location.pathname, menus]);

  const handleCollapseToggle = (name: string) => {
    setCollapsedMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = async () => {
    setLoading(true);
    logout();
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className={`bg-blue-800 min-h-screen ${open ? "w-64" : "w-16"} duration-300 text-gray-100 px-4 flex flex-col`}>
      <div className="py-3 flex justify-end">
        <HiMenuAlt3 size={26} className={`cursor-pointer w-7 ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)} />
      </div>

      {/* Sidebar Menu Section */}
      <div className="mt-4 flex flex-col gap-4 relative mb-4">
        {menus?.map((menu, i) => {
          const isActive = location.pathname === menu.href || menu.child?.some(child => location.pathname === child.href);
          return (
            <div key={i}>
              <Link
                to={menu.child ? "#" : menu.href || "/"}
                className={`group flex items-center text-sm gap-3.5 font-medium p-2 ${isActive ? "bg-blue-600" : "hover:bg-blue-600"} rounded-md cursor-pointer`}
                onClick={() => menu.child && handleCollapseToggle(menu.name || "")}
              >
                <div>{React.createElement(menu.icon, { size: "20" })}</div>
                <h2
                  style={{ transitionDelay: `${i + 3}00ms` }}
                  className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
                >
                  {menu.label}
                </h2>
                {menu.child && (
                  <div className="ml-auto">
                    {collapsedMenus[menu.name || ""] ? (
                      <HiOutlineMinusSm size={20} />
                    ) : (
                      <HiOutlinePlusSm size={20} />
                    )}
                  </div>
                )}
              </Link>

              {/* Child Menu Section */}
              {menu.child && open && collapsedMenus[menu.name || ""] && (
                <div className="ml-6">
                  {menu.child.map((child, j) => (
                    <Link
                      to={child.href}
                      key={j}
                      className={`flex items-center text-sm gap-3.5 font-medium p-2 ${location.pathname === child.href ? "bg-blue-600" : "hover:bg-blue-600"} rounded-md`}
                    >
                      <h2 className="whitespace-pre duration-500">{child.label}</h2>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className={`border-t flex items-center p-3 mt-auto ${!open && "justify-center"}`}>
        <div className="w-10 h-10 flex-shrink-0">
          {me?.avatar ? (
            <img src={me.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover border-2 border-white" />
          ) : (
            <User size={23} className="w-full h-full rounded-full object-cover border-2 border-white" />
          )}
        </div>
        {open && (
          <>
            <div className="flex flex-col ml-3">
              <h4 className="font-semibold text-sm">{me?.name}</h4>
              <span className="text-xs text-white">{me?.email}</span>
            </div>
            <div className="ml-auto">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarLayout;

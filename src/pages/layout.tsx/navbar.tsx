import { Dropdown, Navbar, Spinner } from "flowbite-react";
import { useMenu } from "../../stores/menu";
import { useSession } from "../../stores/session";
import Clock from "../../components/clock";
import { User } from "@phosphor-icons/react";
import { useState } from "react";
import { logout } from "../../services/auth";
import { useNavigate } from "react-router-dom";

const NavbarLayout = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setOpen, open } = useMenu();
  const { me } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <Navbar fluid className="shadow-lg z-50 w-full fixed top-0 bg-white">
      <div className="flex items-center gap-2">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          onClick={() => setOpen(open ? false : true)}
          className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-black-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <Navbar.Brand href="/" className="w-64 h-full flex items-center">
          <img
            alt="Flowbite React Logo"
            className="mr-3 h-8 bg-white"
            src="/images/logo.png"
          />
        </Navbar.Brand>
      </div>
      <div className="hidden md:block">
        <Clock />
      </div>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
              <User size={30} className="text-gray-600" />
            </div>
          }
          className="w-44"
        >
          <Dropdown.Header>
            <span className="block text-sm">{me?.name}</span>
            <span className="block truncate text-sm font-medium">
              {me?.role}
            </span>
          </Dropdown.Header>
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
    </Navbar>
  );
};

export default NavbarLayout;

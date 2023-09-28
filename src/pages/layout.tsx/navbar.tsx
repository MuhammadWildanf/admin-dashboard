import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useMenu } from "../../stores/menu";
import { useSession } from "../../stores/session";
import Clock from "../../components/clock";

const NavbarLayout = () => {
  const { setOpen, open } = useMenu();
  const { me } = useSession();

  return (
    <Navbar fluid className="shadow-lg z-50 w-full fixed top-0">
      <div className="flex items-center gap-2">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          onClick={() => setOpen(open ? false : true)}
          className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        <Navbar.Brand href="/">
          <img
            alt="Flowbite React Logo"
            className="mr-3 h-8"
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
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
          className="w-44"
        >
          <Dropdown.Header>
            <span className="block text-sm">{me?.name}</span>
            <span className="block truncate text-sm font-medium">
              {me?.role}
            </span>
          </Dropdown.Header>
          {/* <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item> */}
          <Dropdown.Item>Logout</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default NavbarLayout;

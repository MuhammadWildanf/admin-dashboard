import { Sidebar } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { HiOutlineMinusSm, HiOutlinePlusSm } from "react-icons/hi";
import { useMenu } from "../../stores/menu";
import { useSession } from "../../stores/session";
import { menuSuperAdmin } from "./sidebar-menu";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarLayout = () => {
  const { open, setOpen } = useMenu();

  return (
    <>
      <section className="hidden md:block">
        <SidebarItems />
      </section>

      <section
        className={`${open ? "flex w-full h-screen " : "hidden"} md:hidden`}
      >
        <SidebarItems className="" />
        <div
          className="w-full h-screen"
          onClick={() => setOpen(open ? false : true)}
        ></div>
      </section>
    </>
  );
};

type Props = {
  className?: string;
};

const SidebarItems = ({ className }: Props) => {
  const theme = {
    root: {
      base: "h-full",
      collapsed: {
        on: "w-16",
        off: "w-64",
      },
      // inner: `h-full overflow-y-auto overflow-x-hidden rounded bg-white md:bg-gray-50 py-4 px-3 dark:bg-gray-800`,
      inner: `h-full overflow-y-auto overflow-x-hidden rounded bg-white py-4 px-3`,
    },
    item: {
      base: "text-gray-500",
      active: "bg-gray-500 dark:bg-gray-700",
      content: {
        base: "text-red-400",
      },
    },
  };

  const { me } = useSession();

  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  return (
    <Sidebar
      className={`fixed h-screen select-none top-0 ${className}`}
      theme={theme}
    >
      <Sidebar.Items className="pt-16">
        <Sidebar.ItemGroup>
          {me?.role === "superadmin" && (
            <>
              {menuSuperAdmin.map((item, key) => (
                <>
                  {item.child ? (
                    <Sidebar.Collapse
                      key={key}
                      icon={item.icon}
                      label={item.label}
                      className="text-sm"
                      open={item.name === pathname.split("/")[1] ? true : false}
                      renderChevronIcon={(theme, open) => {
                        const IconComponent = open
                          ? HiOutlineMinusSm
                          : HiOutlinePlusSm;
                        return (
                          <IconComponent
                            aria-hidden
                            className={
                              theme?.label?.icon?.open
                                ? twMerge(
                                    theme?.label?.icon?.open[
                                      open ? "on" : "off"
                                    ]
                                  )
                                : ""
                            }
                          />
                        );
                      }}
                    >
                      {item.child.map((child, key) => (
                        <Sidebar.Item
                          // href={child.href}
                          onClick={() => navigate(child.href ?? "/")}
                          key={key}
                          className="text-sm cursor-pointer"
                          active={
                            child.name === pathname.split("/")[2] ? true : false
                          }
                        >
                          {child.label}
                        </Sidebar.Item>
                      ))}
                    </Sidebar.Collapse>
                  ) : (
                    <Sidebar.Item
                      key={key}
                      // href={item.href}
                      onClick={() => navigate(item.href ?? "/")}
                      icon={item.icon}
                      className={`cursor-pointer text-sm`}
                      active={
                        (item.name === "dashboard" &&
                          !pathname.split("/")[1]) ||
                        item.name === pathname.split("/")[1]
                          ? true
                          : false
                      }
                    >
                      {item.label}
                    </Sidebar.Item>
                  )}
                </>
              ))}
            </>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarLayout;

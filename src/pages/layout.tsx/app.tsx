import BreadcrumbLayout from "../../components/breadcrumb";
import Alert from "../../components/toast";
import NavbarLayout from "./navbar";
import SidebarLayout from "./sidebar";

type Props = {
  children?: JSX.Element | JSX.Element[];
  isBlank?: boolean;
  withPageTitle?: boolean;
  pageTitleContent?: JSX.Element | JSX.Element[] | string;
  title?: string | JSX.Element;
};

const Layout = ({
  children,
  isBlank,
  withPageTitle = false,
  pageTitleContent,
  title,
}: Props) => {
  return (
    <main className="min-h-screen relative">
      {isBlank ? (
        <>{children}</>
      ) : (
        <>
          <div className="w-full relative h-full">
            <div className="">
              <NavbarLayout />
              <SidebarLayout />
            </div>
            <div className="w-full h-screen pt-20 pb-6 pl-4 pr-4 md:pr-6 md:pl-72">
              <div className="max-w-screen-2xl mx-auto">
                {withPageTitle && (
                  <div className="mb-3 pb-3">
                    <BreadcrumbLayout />
                    <div className="w-full flex justify-between items-center mt-2">
                      <h1 className="text-2xl font-semibold">{title}</h1>
                      <div>{pageTitleContent}</div>
                    </div>
                  </div>
                )}
                <div className="pb-12">{children}</div>
              </div>
            </div>
          </div>
        </>
      )}
      <Alert />
    </main>
  );
};

export default Layout;

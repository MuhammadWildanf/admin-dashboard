import BreadcrumbLayout from "../../components/breadcrumb";
import Alert from "../../components/toast";
import Clock from "../../components/clock";
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
          <section className="flex">
            <SidebarLayout />
            <div className="flex-1 h-screen pt-10 pb-6 md:pr-6 md:pl-20 overflow-y-auto">
              {withPageTitle && (
                <div className="mb-3 pb-3">
                  <div className="flex justify-center items-center mb-3 pb-3">
                    <div className="flex items-center gap-2">
                      <img
                        alt="Flowbite React Logo"
                        className="mr-3 h-5 block md:hidden"
                        src="/images/favicon.png"
                      />
                      <img
                        alt="Flowbite React Logo"
                        className="mr-3 h-8 hidden md:block"
                        src="/images/logo.png"
                      />
                    </div>
                    <Clock />
                  </div>
                  <BreadcrumbLayout />
                  <div className="w-full flex justify-between items-center mt-2">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <div>{pageTitleContent}</div>
                  </div>
                </div>
              )}
              <div className="pb-12">{children}</div>
            </div>
          </section>
        </>
      )}
      <Alert />
    </main>
  );
};

export default Layout;

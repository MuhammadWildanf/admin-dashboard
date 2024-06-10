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
          <section className="flex gap-6">
            <div className="">
              {/* <NavbarLayout /> */}
              <SidebarLayout />
            </div>
            <div className="w-full h-screen pt-10 pb-6 md:pr-6 md:pl-50">
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
          </section>
        </>
      )}
      <Alert />
    </main>
  );
};

export default Layout;

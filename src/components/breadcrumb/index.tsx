import { Breadcrumb } from "flowbite-react";
import { useLocation } from "react-router-dom";

const BreadcrumbLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const paths = pathname.split("/");

  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      {paths.map((item, key) => (
        <Breadcrumb.Item
          key={key}
          href={`/${paths.slice(1, key + 1).join("/")}`}
        >
          <p
            className={`capitalize ${
              key === paths.length - 1 && "text-blue-700"
            }`}
          >
            {item === "" && key === 0
              ? "dashboard"
              : item
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
          </p>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbLayout;

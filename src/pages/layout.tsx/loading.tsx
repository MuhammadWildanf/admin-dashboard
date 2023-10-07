import { Spinner } from "flowbite-react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center fixed w-full top-0 left-0">
      <Spinner size="xl" />
    </div>
  );
};

export default LoadingPage;

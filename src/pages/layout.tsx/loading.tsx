import { Spinner } from "flowbite-react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
};

export default LoadingPage;

import Layout from "./layout.tsx/app";

const Maintenance = () => {
  return (
    <Layout>
      <div
        className="w-full h-screen fixed pl-72 top-0 right-0 flex items-center justify-center"
        style={{ zIndex: -1 }}
      >
        <h1 className="text-2xl font-semibold">
          This Page is Under Development
        </h1>
      </div>
    </Layout>
  );
};

export default Maintenance;

import { useNavigate } from "react-router-dom";
import Layout from "../layout.tsx/app";

const IndexTools = () => {
  const navigate = useNavigate();
  return (
    <Layout withPageTitle title="Assessment's Tools">
      <div className="w-full grid grid-cols-3 gap-4">
        <div
          onClick={() => navigate("/tools/test-tools")}
          className="p-4 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 cursor-pointer shadow-lg text-xl"
        >
          Alat Tes
        </div>

        <div
          onClick={() => navigate("/tools/modules")}
          className="p-4 rounded-lg bg-blue-50 text-blue-800 font-semibold hover:bg-blue-100 cursor-pointer shadow-lg text-xl"
        >
          Modul Tes
        </div>
      </div>
    </Layout>
  );
};

export default IndexTools;

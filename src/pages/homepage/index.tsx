import { useSession } from "../../stores/session";
import Layout from "../layout.tsx/app";

const Homepage = () => {
  const { me } = useSession();

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Hai, {me?.name}</h1>
        <span className="font-light">Selamat Datang di Panel Admin Logos</span>
      </div>
    </Layout>
  );
};

export default Homepage;

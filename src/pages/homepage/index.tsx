import { useSession } from "../../stores/session";
import Layout from "../layout.tsx/app";

const Homepage = () => {
  const { me } = useSession();

  return (
    <Layout withPageTitle title="Dashboard">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Hai, {me?.name}</h1>
        <span className="font-light">Selamat Datang di Panel Admin</span>

        <div className="mt-6 w-full max-w-5xl mx-auto py-6 md:flex gap-2 items-center">
          {/* <img
            src="underconstruction.gif"
            style={{ maxHeight: "350px" }}
            alt=""
          />
          <div>
            <p className="text-3xl text-center md:text-left">
              Halaman ini sedang dalam tahap pengembangan.
            </p>
            <div className="mt-2 w-full max-w-md">
              <p>
                Lagi dikerjain sama developer kesayangan kita semua ❤️ <br />{" "}
                tungguin kita yaak, kalau ada request di halaman ini boleh lhoo
                dikasih tau kita 😊
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;

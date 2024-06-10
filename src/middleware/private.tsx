import { useEffect, useState } from "react";
import { useSession } from "../stores/session";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { request } from "../api/config";
import LoadingPage from "../pages/layout.tsx/loading";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Private = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { setGetMe, setNotification } = useSession();

  const navigate = useNavigate();
  const cookies = new Cookies();

  const checkSession = async () => {
    try {
      const { data } = await request.get("/auth/me");
      // console.log(data, 'dari auth/me psikolog log><><><><><>');
      return data;
    } catch {
      cookies.remove("accessToken", { path: "/" });
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([checkSession()]).then((res) => {
      setGetMe(res[0].psikolog);
      setNotification(res[0].notification);
      setLoading(false);
    });
  }, []);

  return <>{loading ? <LoadingPage /> : <>{children}</>}</>;
};

export default Private;

import { useEffect, useState } from "react";
import { useSession } from "../stores/session";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import { request } from "../api/config";
import LoadingPage from "../pages/layout.tsx/loading";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Guest = ({ children }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      await request.get("/auth/me").then(() => {
        navigate(-1);
      });
    } catch {
      return;
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([checkSession()]).then((res) => {
      setLoading(false);
    });
  }, []);

  return <>{loading ? <LoadingPage /> : <>{children}</>}</>;
};

export default Guest;

import { Cookies } from "react-cookie";
import { request } from "../api/config";

const cookies = new Cookies();

export const getAccessToken = () => {
  const token = cookies.get("accessToken");
  return token;
};

export const setAccessToken = (token: string) => {
  return cookies.set("accessToken", token, {
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
  });
};

export const logout = async () => {
  try {
    await request.post("/auth/logout");
    cookies.remove("accessToken", { path: "/" });
    window.location.reload();
    return true;
  } catch {
    return false;
  }
};

import { Cookies } from "react-cookie";

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
    // await request.post("/logout");
    cookies.remove("accessToken", { path: "/" });
    window.location.reload();
    return true;
  } catch {
    return false;
  }
};

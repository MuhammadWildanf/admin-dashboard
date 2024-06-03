import { useForm } from "react-hook-form";
import { FormInput, FormInputPassword } from "../../components/forms/input";
import Layout from "../layout.tsx/app";
import { Button } from "../../components/buttons";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { request } from "../../api/config";
import { setAccessToken } from "../../services/auth";
import { useNavigate } from "react-router";

type FormValues = {
  email: string;
  password: string;
};

type ErrorForms = {
  email: [] | null;
  password: [] | null;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorForms | null>(null);

  const { control, handleSubmit } = useForm<FormValues>();
  const navigate = useNavigate();

  const bgstyle = {
    background:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/wall2.png)",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await request.post("auth/login", data).then(({ data }) => {
        console.log(data, "<<<<<<<");
        setAccessToken(data.accessToken);
        navigate("/");
      });
    } catch (err: any) {
      setErrors(err.response.data.errors);
    }
    setIsLoading(false);
  });

  return (
    <Layout isBlank={true}>
      <div
        className="w-full h-screen flex items-center justify-center bg-gray-300 p-6"
        style={bgstyle}
      >
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome!</h1>
              <span className="font-semibold">Logos Panel Admin</span>
            </div>
            <img
              src="/images/logo.png"
              alt=""
              className="h-9 hidden md:block"
            />
          </div>

          <div className="mt-8 pt-4 border-t">
            <FormInput
              label="Email"
              name="email"
              control={control}
              required
              error={errors?.email}
            />
            <FormInputPassword
              label="Password"
              name="password"
              control={control}
              required
              error={errors?.password}
            />
            <Button onClick={onSubmit} className="w-full mt-3">
              {isLoading ? <Spinner /> : "Login"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

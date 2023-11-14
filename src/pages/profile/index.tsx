import { useForm } from "react-hook-form";
import { FormInput } from "../../components/forms/input";
import { useSession } from "../../stores/session";
import Layout from "../layout.tsx/app";
import { request } from "../../api/config";
import { Button } from "../../components/buttons";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { useAlert } from "../../stores/alert";

type FormValues = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
};

type ErrorForm = {
  name: [] | null;
  email: [] | null;
  old_password: [] | null;
  password: [] | null;
  password_confirmation: [] | null;
};

const ProfilePage = () => {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [submitPassword, setSubmitPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorForm | null>(null);

  const { me } = useSession();
  const { setMessage } = useAlert();

  const { control, handleSubmit } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (data) => {
    setErrors(null);
    setLoadingSubmit(true);
    try {
      let payload = {
        name: data.name,
        email: data.email,
      };
      await request.post("/profile/update", payload);
      setMessage("Profile Updated", "success");
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setLoadingSubmit(false);
  });

  const onSubmitPasswprd = handleSubmit(async (data) => {
    setErrors(null);
    setSubmitPassword(true);
    try {
      let payload = {
        old_password: data.old_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };
      await request.post("/profile/update-password", payload);
      setMessage("Password Updated", "success");
    } catch (err: any) {
      console.log(err);
      setErrors(err.response.data.errors);
    }
    setSubmitPassword(false);
  });

  return (
    <Layout>
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Profile</h1>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border">
          <div className="py-3 px-4 font-bold bg-gray-100 rounded-t-xl">
            Ubah Profile
          </div>
          <div className="py-3 px-4">
            <FormInput
              control={control}
              name="name"
              label="Nama"
              defaultValue={me?.name}
              error={errors?.name}
            />
            <FormInput
              control={control}
              name="email"
              label="Email"
              defaultValue={me?.email}
              error={errors?.email}
            />
            {/* <FormInput
              control={control}
              name="timezone"
              label="Timezone"
              defaultValue={me?.timezone}
            /> */}
            <div className="mt-3">
              <Button className="px-4" onClick={onSubmit}>
                {loadingSubmit ? <Spinner /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-xl border">
          <div className="py-3 px-4 font-bold bg-gray-100 rounded-t-xl">
            Ubah Password
          </div>
          <div className="py-3 px-4">
            <FormInput
              control={control}
              name="old_password"
              label="Password Lama"
              type="password"
              error={errors?.old_password}
            />
            <FormInput
              control={control}
              name="password"
              label="Password Baru"
              type="password"
              error={errors?.password}
            />
            <FormInput
              control={control}
              name="password_confirmation"
              label="Konfirmasi Password Baru"
              type="password"
              error={errors?.password_confirmation}
            />
            <div className="mt-3">
              <Button className="px-4" onClick={onSubmitPasswprd}>
                {loadingSubmit ? <Spinner /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

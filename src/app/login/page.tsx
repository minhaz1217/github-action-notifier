"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormEvent, useState } from "react";
import Repository from "../../backend/repository/Repository";
import UserService from "../../backend/services/UserService";
import { ClientResponseError } from "pocketbase";

export default function Login() {
  const [formData, setFormData] = useState<LoginForm>(new LoginForm());
  const { push } = useRouter();

  const clickedLogin = async (e: FormEvent) => {
    e.preventDefault();
    let newFormData = formData;
    newFormData.error = "";
    if (!formData.password) {
      newFormData.error = "Password needs to be filled";
      setFormData({ ...newFormData });
      return;
    }
    if (
      newFormData.password.trim().length < 8 ||
      newFormData.password.trim().length > 30
    ) {
      newFormData.error = "Password should be at least 8 characters long";
      setFormData({ ...newFormData });
      return;
    }
    setFormData({ ...newFormData });
    try {
      const userService = new UserService();

      const loggedInUser = await userService.authWithPassword(
        formData.email,
        formData.password
      );
      console.debug("Logged in User Token", userService.token());

      if (loggedInUser?.record?.id) {
        // TODO: show success toast message
        push("/dashboard");
      }
    } catch (e) {
      // TODO: send notification
      console.error((e as ClientResponseError).message);
    }
  };
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-3/5 mt-28">
        <div className="text-center mb-5">
          {/* <img
            src="/demo/images/blocks/logos/hyper.svg"
            alt="hyper"
            height={50}
            className="mb-3"
          /> */}
          <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span className="text-600 font-medium line-height-3">
            Don't have an account?
          </span>
          <a
            className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
            href="/signup"
          >
            Create today!
          </a>
        </div>

        <div>
          <form onSubmit={(e) => clickedLogin(e)}>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="text"
              placeholder="Email address"
              className="w-full mb-3"
              value={formData?.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Password
            </label>
            <InputText
              id="password"
              type="password"
              placeholder="Password"
              className="w-full mb-3"
              value={formData?.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* <div className="flex align-items-center justify-content-between mb-6">
            <div className="flex align-items-center">
              <Checkbox
                id="rememberme"
                // onChange={(e) => setChecked(e.checked)}
                checked={false}
                className="mr-2"
              />
              <label htmlFor="rememberme">Remember me</label>
            </div>
            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
              Forgot your password?
            </a>
          </div> */}

            <Button
              label="Sign In"
              icon="pi pi-user"
              className="w-full"
              onClick={clickedLogin}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

class LoginForm {
  email: string = "";
  error: string = "";
  password: string = "";
}

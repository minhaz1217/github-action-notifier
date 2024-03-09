"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormEvent, useRef, useState } from "react";
import UserService from "../../backend/services/UserService";
import { ClientResponseError } from "pocketbase";
import { Toast } from "primereact/toast";

export default function Login() {
  const [formData, setFormData] = useState<LoginForm>(new LoginForm());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const toast = useRef<Toast>(null);

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

      setIsLoading(true);
      const loggedInUser = await userService.authWithPassword(
        formData.email,
        formData.password
      );

      if (loggedInUser?.record?.id) {
        if (toast?.current) {
          toast?.current?.show({
            severity: "success",
            summary: "Logged In",
            detail: "Logged in successfully",
            life: 3000,
          });
        }
        push("/dashboard");
      }
    } catch (e) {
      if (toast?.current) {
        toast?.current?.show({
          severity: "error",
          summary: "Failed",
          detail: (e as ClientResponseError).message,
          life: 3000,
        });
      }
      console.error((e as ClientResponseError).message);
    }
    setIsLoading(false);
  };
  return (
    <div className="flex flex-row items-center justify-center w-full">
      <Toast ref={toast} position="bottom-right" />
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
            Don&rsquo;t have an account?
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

            <Button
              label="Sign In"
              icon="pi pi-user"
              className="w-full"
              disabled={isLoading}
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

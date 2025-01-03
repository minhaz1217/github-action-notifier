"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import UserService from "../../backend/services/UserService";

export default function Signup() {
  const [formData, setFormData] = useState<SignUpForm>(new SignUpForm());
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickedSignUp = async (e: FormEvent) => {
    setIsLoading(true);

    e.preventDefault();
    let newFormData = formData;
    newFormData.confirmPasswordError = "";
    newFormData.passwordError = "";
    if (!formData.password) {
      newFormData.passwordError = "Password needs to be filled";
      setFormData({ ...newFormData });
      setIsLoading(false);
      return;
    }
    if (
      newFormData.password.trim().length < 8 ||
      newFormData.password.trim().length > 30
    ) {
      newFormData.passwordError =
        "Password should be at least 8 characters long";
      setFormData({ ...newFormData });
      setIsLoading(false);
      return;
    }
    if (newFormData.confirmPassword !== newFormData.password) {
      newFormData.confirmPasswordError = "Password didn't match";
      setFormData({ ...newFormData });
      setIsLoading(false);
      return;
    }
    setFormData({ ...newFormData });
    try {
      const userService = new UserService();
      const createdUser = (await userService.create(
        formData.email,
        formData.password,
        formData.confirmPassword
      )) as any;
      if (createdUser?.id) {
        // TODO: show success toast message
        push("/login");
      }
    } catch (e) {
      // TODO: send notification
      console.error((e as ClientResponseError).message);
      setIsLoading(false);
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
          <div className="text-900 text-3xl font-medium mb-3">Sign Up</div>
        </div>

        <div>
          <form onSubmit={(e) => clickedSignUp(e)}>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              placeholder="Email address"
              className="w-full mb-3"
              value={formData?.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            {formData.emailError && (
              <label className="block text-900 font-medium mb-2 text-red-500">
                {formData.emailError}
              </label>
            )}

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
              required
            />
            {formData.passwordError && (
              <label className="block text-900 font-medium mb-2 text-red-500">
                {formData.passwordError}
              </label>
            )}
            <label
              htmlFor="confirm-password"
              className="block text-900 font-medium mb-2"
            >
              Confirm Password
            </label>
            <InputText
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              className="w-full mb-3"
              value={formData?.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            {formData.confirmPasswordError && (
              <label className="block text-900 font-medium mb-2 text-red-500">
                {formData.confirmPasswordError}
              </label>
            )}

            <Button
              label="Sign Up"
              loading={isLoading}
              icon="pi pi-user"
              className="w-full"
              type="submit"
              onClick={clickedSignUp}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

class SignUpForm {
  email: string = "";
  emailError: string = "";
  password: string = "";
  passwordError: string = "";
  confirmPassword: string = "";
  confirmPasswordError: string = "";
}

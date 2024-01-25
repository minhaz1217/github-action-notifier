import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import React from "react";
import SettingModal from "./SettingModal";
import UserService from "../backend/services/UserService";
import { useRouter } from "next/navigation";
export default function ToolBar() {
  const { push } = useRouter();
  const userService = new UserService();
  const onLogoutClicked = () => {
    if (userService.isLoggedIn()) {
      userService.logout();
    }
    push("/login");
  };
  const startContent = <React.Fragment></React.Fragment>;

  const centerContent = (
    <h1 className="text-2xl font-extrabold">Github Action Notifier</h1>
  );

  const endContent = userService.isLoggedIn() && (
    <>
      <SettingModal />
      <Button
        icon="pi pi-sign-out"
        rounded
        text
        aria-label="Sign Out"
        className="text-2xl"
        size="large"
        onClick={onLogoutClicked}
      />
      {/* <i className="pi pi-cog mr-3 text-2xl"></i> */}
      {/* <Button icon="" className="mr-2" /> */}
      {/* <React.Fragment>Logout</React.Fragment>; */}
    </>
  );

  return (
    <div className="card">
      <Toolbar start={startContent} center={centerContent} end={endContent} />
    </div>
  );
}

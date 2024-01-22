import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import React from "react";
export default function ToolBar() {
  const items = [
    {
      label: "Update",
      icon: "pi pi-refresh",
    },
    {
      label: "Delete",
      icon: "pi pi-times",
    },
  ];

  const startContent = <React.Fragment></React.Fragment>;

  const centerContent = (
    <h1 className="text-2xl font-extrabold">Github Action Notifier</h1>
  );

  const endContent = (
    <>
      <Button
        icon="pi pi-cog"
        rounded
        text
        aria-label="Settings"
        className="mr-2 text-2xl"
        size="large"
      />
      <Button
        icon="pi pi-sign-out"
        rounded
        text
        aria-label="Sign Out"
        className="text-2xl"
        size="large"
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

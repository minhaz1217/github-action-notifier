import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

export default function SettingModal() {
  const [visible, setVisible] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [discordToken, setDiscordToken] = useState<string | null>(null);
  const [notifyInterval, setNotifyInterval] = useState<number>(30);

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Update Settings</span>
    </div>
  );
  const footerContent = (
    <div>
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
      />
    </div>
  );
  return (
    <>
      <Button
        icon="pi pi-cog"
        rounded
        text
        aria-label="Settings"
        className="mr-2 text-2xl"
        size="large"
        onClick={() => setVisible(true)}
      />
      <Dialog
        visible={visible}
        modal
        header={headerElement}
        footer={footerContent}
        style={{ width: "50rem" }}
        onHide={() => setVisible(false)}
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </>
  );
}

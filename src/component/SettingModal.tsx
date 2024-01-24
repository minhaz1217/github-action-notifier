import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import Repository from "../backend/repository/Repository";
import pb from "../backend/db";
import AllSettingsService from "../backend/services/AllSettingsService";

export default function SettingModal() {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SettingForm>(new SettingForm());

  const onSaveClicked = async () => {
    // setVisible(false)
    const allSettingsService = new AllSettingsService();

    await allSettingsService.set({
      apiToken: "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",
      checkingInterval: 66,
      discordWebHookUrl: "SOMETHING",
    });
    console.debug("Item", await allSettingsService.get());
  };

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
        onClick={() => onSaveClicked()}
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
        className="w-1/3"
        onHide={() => setVisible(false)}
      >
        <div className="mr-2">
          <label
            htmlFor="checkingInterval"
            className="block text-900 font-medium mb-2"
          >
            Checking Interval
          </label>
          <InputText
            id="checkingInterval"
            type="number"
            placeholder="Checking Interval"
            className="w-full mb-3"
            value={formData?.checkingInterval}
            onChange={(e) =>
              setFormData({ ...formData, checkingInterval: e.target.value })
            }
            required
          />
          <label htmlFor="apiToken" className="block text-900 font-medium mb-2">
            Github Token
          </label>
          <InputText
            id="apiToken"
            type="text"
            placeholder="Github Token"
            className="w-full mb-3"
            value={formData?.apiToken}
            onChange={(e) =>
              setFormData({ ...formData, apiToken: e.target.value })
            }
            required
          />
          <label
            htmlFor="discordWebHookUrl"
            className="block text-900 font-medium mb-2"
          >
            Discord Webhook Url
          </label>
          <InputText
            id="discordWebHookUrl"
            type="text"
            placeholder="Discord Webhook Url"
            className="w-full mb-3"
            value={formData?.discordWebHookUrl}
            onChange={(e) =>
              setFormData({ ...formData, discordWebHookUrl: e.target.value })
            }
            required
          />
        </div>
      </Dialog>
    </>
  );
}

class SettingForm {
  error: string = "";
  checkingInterval: string = "30";
  apiToken: string = "";
  discordWebHookUrl: string = "";
}

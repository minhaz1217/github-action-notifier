import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useState } from "react";
import AllSettingsService from "../backend/services/AllSettingsService";
import { SettingsObserverContext } from "./contexts/contexts";

export default function SettingModal() {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<SettingForm>(new SettingForm());
  const settingsContext = useContext(SettingsObserverContext);


  const allSettingsService = new AllSettingsService();
  useEffect(() => {
    getSettings();
  }, []);
  const getSettings = async () => {
    setLoading(true);
    const allSettings = await allSettingsService.get();
    if (allSettings) {
      const newFormData = formData;
      newFormData.apiToken = allSettings?.apiToken?.trim() ?? "";
      newFormData.discordWebHookUrl =
        allSettings?.discordWebHookUrl?.trim() ?? "";
      newFormData.checkingInterval =
        allSettings?.checkingInterval.toString() ?? "30";
      setFormData(newFormData);
    }
    setLoading(false);
  };
  const onSaveClicked = async () => {
    if (formData == null) {
      return;
    }

    // if (formData.apiToken?.trim() === "") {
    //   setFormData({ ...formData, error: "Api token can't be empty" });
    // }

    // if (formData.discordWebHookUrl?.trim() === "") {
    //   setFormData({ ...formData, error: "Discord Web Url is needed" });
    // }

    if (Number.isInteger(formData.checkingInterval)) {
      setFormData({
        ...formData,
        error: "Enter proper checking interval, enter only seconds",
      });
    }
    setLoading(true);
    await allSettingsService.set({
      apiToken: formData.apiToken.trim(),
      checkingInterval: Number(formData.checkingInterval),
      discordWebHookUrl: formData.discordWebHookUrl.trim(),
    });
    settingsContext.notifyAll();
    setLoading(false);
    setVisible(false);
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
        disabled={loading}
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
          {formData?.error && <p className="text-red-500">{formData.error}</p>}
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

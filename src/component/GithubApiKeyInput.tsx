"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import SettingsRepository from "../backend/repository/SettingsRepository";
import { Settings } from "../backend/domain/Settings";

const GithubApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const settingRepo = new SettingsRepository();
  useEffect(() => {
    checkIsApiKeySet();
  }, []);

  const checkIsApiKeySet = async () => {
    setIsLoading(true);
    const setting = await settingRepo.getKey("API_KEY");
    if (setting !== null) {
      setSettings(setting);
    } else {
      setSettings(null);
    }
    setIsLoading(false);
  };

  // checkIsApiKeySet();
  const onSaveClicked = async (e: any) => {
    setIsLoading(true);
    const afterSaving = await settingRepo.setKey("API_KEY", apiKey);
    await checkIsApiKeySet();
    setIsLoading(false);
  };
  const onClearClicked = async () => {
    setIsLoading(true);
    const settingDeleted = await settingRepo.removeKey("API_KEY");
    if (settingDeleted === true) {
      await checkIsApiKeySet();
    }
    setIsLoading(false);
  };
  return (
    <>
      {isLoading === false ? (
        settings !== null ? (
          <div>
            <p>Token is set.</p>

            <Button
              className="ml-2"
              label="Clear"
              type="button"
              icon="pi pi-check"
              onClick={onClearClicked}
            />
          </div>
        ) : (
          <div>
            <InputText
              placeholder="Github Token"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button
              className="ml-2"
              label="Save"
              type="button"
              icon="pi pi-check"
              onClick={onSaveClicked}
            />
          </div>
        )
      ) : (
        "Loading"
      )}
    </>
  );
};

export default GithubApiKeyInput;

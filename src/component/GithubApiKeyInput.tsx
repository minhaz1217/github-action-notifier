"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import SettingsRepository from "../backend/repository/SettingsRepository";

const GithubApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isApiKey, setIsApiKey] = useState<boolean | null>(null);
  const settingRepo = new SettingsRepository();

  useEffect(() => {
    checkIsApiKeySet();
  }, []);

  const checkIsApiKeySet = async () => {
    const setting = await settingRepo.getKey("API_KEY");
    if (setting !== null) {
      setIsApiKey(true);
    }
  };
  const onSaveClicked = async (e: any) => {
    const afterSaving = await settingRepo.setKey("API_KEY", apiKey);
    await checkIsApiKeySet();
  };
  return (
    <>
      {isApiKey === false ? (
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
      ) : (
        <p>Token is set.</p>
      )}
    </>
  );
};

export default GithubApiKeyInput;

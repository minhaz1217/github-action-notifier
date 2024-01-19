"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import SettingsRepository from "../backend/repository/SettingsRepository";
import { Settings } from "../backend/domain/Settings";
import GithubTokenService from "../backend/services/GithubTokenService";

const GithubApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const tokenService = new GithubTokenService();
  useEffect(() => {
    checkIsApiKeySet();
  }, []);

  const checkIsApiKeySet = async () => {
    setIsLoading(true);
    const setting = await tokenService.get();
    if (setting !== null) {
      if (setting !== settings) {
        setSettings(setting);
      }
    } else {
      setSettings(null);
    }
    setIsLoading(false);
  };

  // checkIsApiKeySet();
  const onSaveClicked = async (e: any) => {
    setIsLoading(true);
    const afterSaving = await tokenService.set(apiKey);
    await checkIsApiKeySet();
    setIsLoading(false);
  };
  const onClearClicked = async () => {
    setIsLoading(true);
    const settingDeleted = await tokenService.remove();
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
            <span>Token is set.</span>

            <Button
              className="ml-2"
              severity="help"
              label="Clear"
              type="button"
              icon="pi pi-times"
              onClick={onClearClicked}
              rounded
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

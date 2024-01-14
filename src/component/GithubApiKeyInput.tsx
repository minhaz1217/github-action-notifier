"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";

const GithubApiKeyInput = () => {
  const [apiKey, setApiKey] = useState<string>("");

  const onSaveClicked = (e: any) => {
    console.debug("Key", apiKey);
  };
  return (
    <>
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
    </>
  );
};

export default GithubApiKeyInput;

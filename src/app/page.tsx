"use client";
import { Button } from "primereact/button";
import Image from "next/image";
import GithubApiKeyInput from "../component/GithubApiKeyInput";

export default function Home() {
  return (
    <Button
      className="form-button cyan-400"
      label="Button"
      style={{ marginTop: "2rem" }}
    />
    // <h1>
    //   Github Action Notifier
    //   {/* <GithubApiKeyInput /> */}
    // </h1>
  );
}

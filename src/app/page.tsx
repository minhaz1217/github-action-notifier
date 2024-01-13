import Image from "next/image";
import GithubApiKeyInput from "../component/GithubApiKeyInput";

export default function Home() {
  return (
    <h1>
      Github Action Notifier
      <GithubApiKeyInput />
    </h1>
  );
}

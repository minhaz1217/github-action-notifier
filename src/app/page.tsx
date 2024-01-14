import GithubApiKeyInput from "../component/GithubApiKeyInput";
import RepoList from "../component/RepoList";

export default function Home() {
  return (
    <>
      <GithubApiKeyInput />
      <RepoList />
    </>
  );
}

import GithubApiKeyInput from "../component/GithubApiKeyInput";
import RepoList from "../component/RepoList";

export default function Home() {
  return (
    <>
      <div className="p-4">
        <GithubApiKeyInput />
        <div className="mt-2"></div>
        <RepoList />
      </div>
    </>
  );
}

"use client";
import DataObserver from "../backend/patterns/DataObserver";
import GithubApiKeyInput from "../component/GithubApiKeyInput";
import RepoList from "../component/RepoList";
import SubscriptionList from "../component/SubscriptionList";

export default function Home() {
  const newSubscriptionAdded$ = new DataObserver();
  return (
    <>
      <div className="p-4">
        <GithubApiKeyInput />
        <div className="mt-2"></div>
        <div className="flex flex-row">
          <div className="basis-1/4 border-e-2 border-e-black pe-2">
            <SubscriptionList
              updateOnSubscriptionChanged={newSubscriptionAdded$}
            />
          </div>
          <div className="basis-3/4 px-2">
            <RepoList notifySubscriptionChanged={newSubscriptionAdded$} />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import DataObserver from "../../backend/patterns/DataObserver";
import GithubApiKeyInput from "../../component/GithubApiKeyInput";
import RepoList from "../../component/RepoList";
import SubscriptionList from "../../component/SubscriptionList";
import ToolBar from "../../component/ToolBar";
import { register } from "../../instrumentation";

const Dashboard = () => {
  const newSubscriptionAdded$ = new DataObserver();
  register();
  return (
    <>
      <ToolBar />
      <div className="p-4">
        {/* <GithubApiKeyInput /> */}
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
};

export default Dashboard;

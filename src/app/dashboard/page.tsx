"use client";

import { useRouter } from "next/navigation";
import DataObserver from "../../backend/patterns/DataObserver";
import UserService from "../../backend/services/UserService";
import RepoList from "../../component/RepoList";
import SubscriptionList from "../../component/SubscriptionList";
import ToolBar from "../../component/ToolBar";
import { register } from "../../instrumentation";
import React from "react";
import {
  SettingsObserverContext,
  SubscriptionObserverContext,
  settingsChanged$,
} from "@/component/contexts/contexts";

const Dashboard = () => {
  
  const newSubscriptionAdded$ = new DataObserver();

  const userService = new UserService();
  const { push } = useRouter();
  if (!userService.isLoggedIn()) {
    push("/login");
  }
  register(settingsChanged$);
  return (
    userService.isLoggedIn() && (
      <>
        <SubscriptionObserverContext.Provider value={newSubscriptionAdded$}>
          <SettingsObserverContext.Provider
            value={settingsChanged$}
          ></SettingsObserverContext.Provider>
        </SubscriptionObserverContext.Provider>
        <ToolBar />
        <div className="p-4">
          <div className="mt-2"></div>
          <div className="flex flex-row">
            <div className="basis-1/4 border-e-2 border-e-black pe-2">
              <SubscriptionList />
            </div>
            <div className="basis-3/4 px-2">
              <RepoList />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Dashboard;

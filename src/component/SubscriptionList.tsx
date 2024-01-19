"use client";
import { useEffect, useState } from "react";
import SubscriptionService from "../backend/services/SubscriptionService";
import { Subscription } from "../backend/domain/Subscription";
import RepoBasic from "./RepoBasic";
import { SubscriptionActionCheck } from "../backend/services/SubscriptionActionCheck";

const SubscriptionList = () => {
  const [repoList, setRepoList] = useState<Subscription[]>([]);
  const subscriptionService = new SubscriptionService();

  const interval = SubscriptionActionCheck.init();
  useEffect(() => {
    getSubscriptionList();
  }, []);

  const getSubscriptionList = async () => {
    const list = await subscriptionService.getList();
    setRepoList(list?.items ?? []);
  };

  const onSubscribeClicked = async (repo: Subscription) => {
    const deleteSuccessful = await subscriptionService.delete(repo.id);
    if (deleteSuccessful === true) {
      setRepoList(repoList.filter((x) => x.id !== repo.id));
    }
  };

  return (
    <>
      <h2>Subscription List</h2>
      {repoList && repoList.length > 0 ? (
        repoList.map((x) => (
          <RepoBasic
            buttonClicked={onSubscribeClicked}
            isSubscribed={true}
            key={x.id}
            repo={x as any}
          />
        ))
      ) : (
        <p className="text-red-400">No Subscription</p>
      )}
    </>
  );
};
export default SubscriptionList;

"use client";
import { useEffect, useState } from "react";
import SubscriptionService from "../backend/services/SubscriptionService";
import { Subscription } from "../backend/domain/Subscription";
import RepoBasic from "./RepoBasic";
import { RepoModel } from "../backend/models/RepoModel";

const SubscriptionList = () => {
  const [repoList, setRepoList] = useState<Subscription[]>([]);

  const subscriptionService = new SubscriptionService();
  useEffect(() => {
    getSubscriptionList();
  }, []);

  const getSubscriptionList = async () => {
    const list = await subscriptionService.getList();
    setRepoList(list?.items ?? []);
  };
  const onSubscribeClicked = () => {
    console.debug("Unsubscribe clicked");
  };
  return (
    repoList &&
    repoList.length > 0 &&
    repoList.map((x) => (
      <RepoBasic
        buttonClicked={onSubscribeClicked}
        isSubscribed={true}
        key={x.id}
        repo={x as any}
      />
    ))
  );
};
export default SubscriptionList;

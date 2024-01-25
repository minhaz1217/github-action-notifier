"use client";
import { useEffect, useState } from "react";
import SubscriptionService from "../backend/services/SubscriptionService";
import { Subscription } from "../backend/domain/Subscription";
import RepoBasic from "./RepoBasic";
import {
  IObservable,
  IObserver,
  NotifierBuilder,
} from "../backend/patterns/DataObserver";

const SubscriptionList = ({
  updateOnSubscriptionChanged,
}: {
  updateOnSubscriptionChanged: IObservable;
}) => {
  const [repoList, setRepoList] = useState<Subscription[]>([]);
  const subscriptionService = new SubscriptionService();

  useEffect(() => {
    updateOnSubscriptionChanged.subscribe(
      new NotifierBuilder(async () => {
        await getSubscriptionList();
      })
    );
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
        <p className="text-red-400">No Subscription please add a repo by searching for repo. (Add github token from settings to search for private repo)</p>
      )}
    </>
  );
};
export default SubscriptionList;

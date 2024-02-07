"use client";
import { useEffect, useState } from "react";
import SubscriptionService from "../backend/services/SubscriptionService";
import { Subscription } from "../backend/domain/Subscription";
import RepoBasic from "./RepoBasic";
import { ProgressSpinner } from "primereact/progressspinner";
import { IObservable, NotifierBuilder } from "../backend/patterns/DataObserver";

const SubscriptionList = ({
  updateOnSubscriptionChanged,
}: {
  updateOnSubscriptionChanged: IObservable;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    const list = await subscriptionService.getList();
    setLoading(false);
    setRepoList(list?.items ?? []);
  };

  const onUnSubscribeClicked = async (repo: Subscription) => {
    setLoading(true);
    const deleteSuccessful = await subscriptionService.delete(repo.id);
    if (deleteSuccessful === true) {
      setRepoList(repoList.filter((x) => x.id !== repo.id));
    }
    setLoading(false);
  };

  const onIsEnabledChanged = async (id: string, isEnabled: boolean) => {
    const updated = await subscriptionService.changeIsEnabled(id, isEnabled);
    if (updated) {
      repoList.forEach((x) => {
        if (x.id === id) {
          x.isEnabled = isEnabled;
        }
      });
      setRepoList([...repoList]);
    }
  };
  return (
    <>
      <h2>Subscription List</h2>
      {loading && <ProgressSpinner />}
      {repoList && repoList.length > 0
        ? repoList.map((x) => (
            <RepoBasic
              buttonClicked={onUnSubscribeClicked}
              isSubscribed={true}
              key={x.id}
              repo={x as any}
              onIsEnabledChanged={onIsEnabledChanged}
            />
          ))
        : !loading && (
            <p className="text-red-400">
              No Subscription please add a repo by searching for repo. (Add
              github token from settings to search for private repo)
            </p>
          )}
    </>
  );
};
export default SubscriptionList;

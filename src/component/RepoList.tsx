"use client";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import RepoBasic from "./RepoBasic";
import { RepoModel } from "../backend/models/RepoModel";
import { Subscription } from "../backend/domain/Subscription";
import SubscriptionService from "../backend/services/SubscriptionService";
import { Settings } from "../backend/domain/Settings";
import Tables from "../backend/Tables";
import { IndexedDBRepository } from "../backend/repository/IndexedDBRepository";
import { SubscriptionObserverContext } from "./contexts/contexts";
import AllSettingsService from "@/backend/services/AllSettingsService";

const RepoList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [repoSearchText, setRepoSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const subscriptionChanged = useContext(SubscriptionObserverContext);
  
  useEffect(() => {
    checkApiKey();
  }, [apiKey]);

  const checkApiKey = async () => {
    setLoading(true);
    const allSettingsService = new AllSettingsService();
    const token = await allSettingsService.getGithubToken();
    if (token && apiKey !== token) {
      setApiKey(token);
    }
    setLoading(false);
  };
  const onSearchClicked = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (apiKey === null || repoSearchText.trim() === "") {
        return;
      }
      setLoading(true);
      const octokit = new Octokit({
        auth: apiKey,
      });
      const searchResult = await octokit.search.repos({
        q: `${repoSearchText}`,
      });
      setSearchResult(searchResult.data.items);
    } catch (error: any) {
      console.error("Error On Search: ", error);
    }
    setLoading(false);
  };

  const onSubscribeClicked = async (repoDetails: RepoModel) => {
    try {
      const subscriptionService = new SubscriptionService();
      const payload: Subscription = {
        githubId: repoDetails.id,
        name: repoDetails.name,
        url: repoDetails.html_url,
        description: repoDetails.description,
        owner: repoDetails?.owner?.login ?? "",
        isEnabled: "TRUE",
      } as Subscription;

      const createdSuccessfully = await subscriptionService.create(payload);
      if (createdSuccessfully) {
        subscriptionChanged.notifyAll();
      }
    } catch (error: any) {
      console.error("Error: ", error);
    }
    setLoading(false);
  };

  const onTestClicked = async () => {
    const repo = new IndexedDBRepository(Tables.SUBSCRIPTION);
    await repo.getByFieldName<Subscription>("qwe", "");
    // const settings = new Settings();
    // settings.key = "SOMETHING";
    // settings.value = "SOMETHING_VALUE";

    // await repo.create<Settings>(settings);

    try {
      const settings2 = new Settings();
      settings2.key = "SOMETHING2";
      settings2.value = "SOMETHING_VALUE";
      await repo.create<Settings>(settings2);
    } catch (e: any) {
      console.error("ERROR", e);
    }
  };
  
  return (
    <div>
      <form onSubmit={(e) => onSearchClicked(e)}>
        <InputText
          placeholder="Search Repo"
          value={repoSearchText}
          onChange={(e) => setRepoSearchText(e.target.value)}
        />
        <Button
          className="ml-2"
          label="Search"
          type="button"
          icon="pi pi-search"
          loading={loading}
          onClick={onSearchClicked}
          disabled={loading}
          rounded
        />

        {/* <Button
          className="ml-2"
          label="Test"
          type="button"
          icon="pi pi-search"
          onClick={onTestClicked}
          rounded
        /> */}
      </form>
      {loading && <ProgressSpinner />}
      <div>
        {!loading &&
          searchResult &&
          searchResult.map((item) => (
            <RepoBasic
              isSubscribed={false}
              repo={item}
              key={item.id}
              buttonClicked={onSubscribeClicked}
            />
          ))}
        {searchResult && searchResult.length === 0 && <span>Not Found</span>}
      </div>
    </div>
  );
};
export default RepoList;

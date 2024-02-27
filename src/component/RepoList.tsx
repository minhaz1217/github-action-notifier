"use client";
import { FormEvent, useEffect, useState } from "react";
import GithubTokenService from "../backend/services/GithubTokenService";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import RepoBasic from "./RepoBasic";
import { RepoModel } from "../backend/models/RepoModel";
import { Subscription } from "../backend/domain/Subscription";
import { INotifier } from "../backend/patterns/DataObserver";
import SubscriptionService from "../backend/services/SubscriptionService";
import { LocalStorageRepository } from "../backend/repository/LocalStorageRepository";
import { Settings } from "../backend/domain/Settings";
import Tables from "../backend/Tables";
import { IndexedDBRepository } from "../backend/repository/IndexedDBRepository";

const RepoList = ({
  notifySubscriptionChanged,
}: {
  notifySubscriptionChanged: INotifier;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [repoSearchText, setRepoSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const githubApiKeyService: GithubTokenService = new GithubTokenService();
  useEffect(() => {
    checkApiKey();
  }, [apiKey]);

  const checkApiKey = async () => {
    setLoading(true);
    const token = await githubApiKeyService.get();
    if (token && apiKey !== token.value) {
      setApiKey(token.value);
    }
    setLoading(false);
  };
  const onSearchClicked = async (e: FormEvent) => {
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
    setLoading(false);
    setSearchResult(searchResult.data.items);
  };

  const onSubscribeClicked = async (repoDetails: RepoModel) => {
    const subscriptionService = new SubscriptionService();
    const payload: Subscription = {
      githubId: repoDetails.id,
      name: repoDetails.name,
      url: repoDetails.html_url,
      description: repoDetails.description,
      owner: repoDetails?.owner?.login ?? "",
      isEnabled: true,
    } as Subscription;

    const createdSuccessfully = await subscriptionService.create(payload);
    if (createdSuccessfully !== null) {
      notifySubscriptionChanged.notifyAll();
    }

    setLoading(false);
  };

  const onTestClicked = async () => {
    const settings = new Settings();
    settings.key = "SOMETHING";
    settings.value = "SOMETHING_VALUE";
    const repo = new IndexedDBRepository(Tables.SETTINGS);

    const mySettings = await repo.create<Settings>(settings);

    const deleted = await repo.delete(settings.id);
    const getSettings = await repo.getById<Settings>(mySettings.id);

    console.debug("After get", getSettings?.value);
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
          onClick={onSearchClicked}
          disabled={loading}
          rounded
        />

        <Button
          className="ml-2"
          label="Test"
          type="button"
          icon="pi pi-search"
          onClick={onTestClicked}
          rounded
        />
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

"use client";
import { FormEvent, useEffect, useState } from "react";
import GithubTokenService from "../backend/services/GithubTokenService";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import RepoBasic from "./RepoBasic";
import Repository from "../backend/repository/Repository";
import Tables from "../backend/Tables";
import { RepoModel } from "../backend/models/RepoModel";
import { Subscription } from "../backend/domain/Subscription";
import pb from "../backend/db";
import { INotifier } from "../backend/patterns/DataObserver";

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
    console.debug("API KEY", token);
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
    console.debug("Result", searchResult.data.items);
  };
  const onSubscribeClicked = async (repoDetails: RepoModel) => {
    const subscriptionRepository = new Repository(Tables.SUBSCRIPTION);
    const payload: Subscription = {
      githubId: repoDetails.id,
      name: repoDetails.name,
      url: repoDetails.html_url,
      description: repoDetails.description,
      owner: repoDetails?.owner?.login ?? "",
    } as Subscription;

    const alreadyExists =
      await subscriptionRepository.getFirstOne<Subscription>(
        pb.filter("name = {:key}", {
          key: payload.name,
        })
      );
    if (alreadyExists === null) {
      await subscriptionRepository.create<Subscription>(payload);
      notifySubscriptionChanged.notifyAll();
    }

    setLoading(false);
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

"use client";
import { useEffect, useState } from "react";
import GithubTokenService from "../backend/services/GithubTokenService";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";
import { InputText } from "primereact/inputtext";
import RepoBasic from "./RepoBasic";
import Repository from "../backend/repository/Repository";
import Tables from "../backend/Tables";
import { RepoModel } from "../backend/models/RepoModel";
import { Subscription } from "../backend/domain/Subscription";
import pb from "../backend/db";
import { INotifier } from "../backend/patterns/DataObserver";
import Discord from "../backend/notification-providers/Discord";

const RepoList = ({
  notifySubscriptionChanged,
}: {
  notifySubscriptionChanged: INotifier;
}) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [repoSearchText, setRepoSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const tokenService: GithubTokenService = new GithubTokenService();
  useEffect(() => {
    checkApiKey();
  }, [apiKey]);

  const checkApiKey = async () => {
    const token = await tokenService.get();
    if (token !== null && apiKey !== token.value) {
      setApiKey(token.value);
    }
    console.debug("Token", token);
  };
  const onSearchClicked = async () => {
    if (apiKey === null || repoSearchText.trim() === "") {
      return;
    }

    const octokit = new Octokit({
      auth: apiKey,
    });
    const searchResult = await octokit.search.repos({
      q: `${repoSearchText}`,
    });
    setSearchResult(searchResult.data.items);
    console.debug("Result", searchResult.data.items);
    // const orgs = await octokit.request("GET /user/repos", commonHeader);
    // console.debug("ORGS", orgs);
    // const commits = await octokit.repos.listCommits();
  };
  const onSubscribeClicked = async (repoDetails: RepoModel) => {
    console.debug("Subscribe Clicked", repoDetails);
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
  };
  return (
    <div>
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
        rounded
      />
      <div>
        {searchResult &&
          searchResult.map((item) => (
            <RepoBasic
              isSubscribed={false}
              repo={item}
              key={item.id}
              buttonClicked={onSubscribeClicked}
            />
          ))}
      </div>
    </div>
  );
};
export default RepoList;

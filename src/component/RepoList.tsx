"use client";
import { useEffect, useState } from "react";
import GithubTokenService from "../backend/services/GithubTokenService";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";
import { InputText } from "primereact/inputtext";
import RepoBasic from "./RepoBasic";

const RepoList = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [repoSearchText, setRepoSearchText] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const tokenService: GithubTokenService = new GithubTokenService();
  const commonHeader = {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };
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
  const onSubscribeClicked = (id: string) => {
    console.debug("Subscribe Clicked", id);
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
        icon="pi pi-check"
        onClick={onSearchClicked}
      />
      <div>
        {searchResult &&
          searchResult.map((item) => (
            <RepoBasic
              repo={item}
              key={item.id}
              onSubscribeClicked={onSubscribeClicked}
            />
          ))}
      </div>
    </div>
  );
};
export default RepoList;

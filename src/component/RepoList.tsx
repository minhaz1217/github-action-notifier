"use client";
import { useEffect, useState } from "react";
import GithubTokenService from "../backend/services/GithubTokenService";
import { Button } from "primereact/button";
import { Octokit } from "@octokit/rest";

const RepoList = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
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
  const onGetListClicked = async () => {
    if (apiKey === null) {
      return;
    }
    const octokit = new Octokit({
      auth: apiKey,
    });
    const orgs = await octokit.request("GET /user/repos", commonHeader);
    console.debug("ORGS", orgs);
    // const commits = await octokit.repos.listCommits();
  };
  return (
    <Button
      className="ml-2"
      label="Get List"
      type="button"
      icon="pi pi-check"
      onClick={onGetListClicked}
    />
  );
};
export default RepoList;

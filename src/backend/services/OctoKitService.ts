import { Octokit } from "@octokit/rest";

export default class OctoKitService {
  private _apiKey: string;
  static header = {
    "X-GitHub-Api-Version": "2022-11-28",
    "Accept": "application/vnd.github+json"
  };
  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  get() {
    return new Octokit({
      auth: `Bearer ${this._apiKey}`,
    });
  }
}

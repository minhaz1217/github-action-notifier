import { Octokit } from "@octokit/rest";
import { Subscription } from "../domain/Subscription";
import GithubTokenService from "./GithubTokenService";
import SubscriptionService from "./SubscriptionService";
import OctoKitService from "./OctoKitService";
import Discord from "../notification-providers/Discord";
import AllSettingsService from "./AllSettingsService";

let subscriptionActionCheck: SubscriptionActionCheck | null = null;
let called: boolean = false;

class SubscriptionActionCheck {
  subscriptionService: SubscriptionService;
  githubTokenService: GithubTokenService;
  private intervalId: any | null = null;
  private octokit: Octokit | null = null;
  private inProgressList: Set<number> = new Set();
  private discord: Discord;
  private _checkingInterval: number = 30;
  private constructor(discordUrl: string, checkingInterval: number) {
    this._checkingInterval = checkingInterval;
    console.debug("Constructor called");
    this.subscriptionService = new SubscriptionService();
    this.githubTokenService = new GithubTokenService();

    this.discord = new Discord(discordUrl);
  }
  static async init() {
    if (typeof window === "undefined") {
      console.debug("Init Called");
    } else {
      if (called === false && subscriptionActionCheck === null) {
        called = true;
        const settingService = new AllSettingsService();
        const discordUrl = await settingService.getDiscordUrl();
        const intervalTime = await settingService.getCheckingInterval();
        if (discordUrl) {
          subscriptionActionCheck = new SubscriptionActionCheck(
            discordUrl,
            intervalTime
          );
          console.debug("Is in client", subscriptionActionCheck.intervalId);
          await subscriptionActionCheck?.registerInterval();
        }
      }
    }
    return subscriptionActionCheck;
  }

  async registerInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.inProgressList.clear();
    const githubToken = await this.githubTokenService.get();
    if (githubToken === null || githubToken?.key?.trim() === "") {
      throw Error("Github token not found");
    }
    this.octokit = new OctoKitService(githubToken.value).get();

    this.checkSubscriptionList();

    this.intervalId = setInterval(() => {
      this.checkSubscriptionList();
    }, this._checkingInterval * 1000);
  }

  async checkSubscriptionList() {
    const list = await this.subscriptionService.getList();
    console.debug(
      `${new Date().toISOString()} Checking Subscription for ${list?.length}`
    );
    if (list && list?.length > 0) {
      list.forEach((item) => {
        if (item.isEnabled === "TRUE") {
          this.checkAction(item);
        }
      });
    }
  }

  async checkAction(subscription: Subscription) {
    if (!subscription || this.octokit === null) {
      return;
    }

    const workFlowRun = (
      await this.octokit.actions.getWorkflowRun({
        owner: subscription.owner,
        repo: subscription.name,
        headers: OctoKitService.header,
      } as any)
    ).data as any as WorkflowRunList;
    console.debug("Workflow run", workFlowRun);
    workFlowRun.workflow_runs.forEach((run) => {
      if (run === null) {
        return;
      }
      if (run.status === "in_progress") {
        if (this.inProgressList.has(run.id) === false) {
          // notifying when first time the run is found.
          this.sendNotification(run);
        }
        this.inProgressList.add(run.id);
      } else {
        // we remove the run from our set
        const removed = this.inProgressList.delete(run.id);
        if (removed === true) {
          // we send notification
          this.sendNotification(run);
        }
      }
    });
  }

  sendNotification(run: WorkflowRun) {
    this.discord.send(run);
  }
}

interface WorkflowRunList {
  total_count: number;
  workflow_runs: WorkflowRun[];
}
export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  display_title: string;
  status: "completed" | "in_progress" | "cancelled" | "failure" | "skipped";
  conclusion:
    | null
    | "success"
    | "in_progress"
    | "cancelled"
    | "failure"
    | "skipped";
  workflow_id: number;
  html_url: string;
  head_commit: {
    message: string;
  };
  repository: {
    name: string;
  };
}
export default async function registerSubscriptionAction() {
  const interval = await SubscriptionActionCheck.init();
}

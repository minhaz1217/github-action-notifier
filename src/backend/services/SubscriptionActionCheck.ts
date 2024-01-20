import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { Subscription } from "../domain/Subscription";
import GithubTokenService from "./GithubTokenService";
import SubscriptionService from "./SubscriptionService";
import OctoKitService from "./OctoKitService";
import Discord from "../notification-providers/Discord";

let subscriptionActionCheck: SubscriptionActionCheck | null = null;

export class SubscriptionActionCheck {
  subscriptionService: SubscriptionService;
  githubTokenService: GithubTokenService;
  private intervalId: any | null = null;
  private octokit: Octokit | null = null;
  private inProgressList: Set<number> = new Set();
  private discord: Discord;

  private constructor() {
    this.subscriptionService = new SubscriptionService();
    this.githubTokenService = new GithubTokenService();
    this.discord = new Discord();
  }
  static init() {
    if (subscriptionActionCheck === null) {
      subscriptionActionCheck = new SubscriptionActionCheck();
      subscriptionActionCheck?.registerInterval();
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
      throw Error("Git hub token not found");
    }
    this.octokit = new OctoKitService(githubToken.value).get();

    this.checkSubscriptionList();

    this.intervalId = setInterval(() => {
      this.checkSubscriptionList();
    }, 10000);
  }

  async checkSubscriptionList() {
    console.debug("Checking Subscription");
    const list = await this.subscriptionService.getList();
    if (list.items.length > 0) {
      list.items.forEach((item) => this.checkAction(item));
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

const interval = SubscriptionActionCheck.init();
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
}

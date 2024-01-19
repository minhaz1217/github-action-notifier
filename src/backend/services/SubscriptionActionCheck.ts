"use client";
import { Octokit } from "@octokit/rest";
import { Subscription } from "../domain/Subscription";
import GithubTokenService from "./GithubTokenService";
import SubscriptionService from "./SubscriptionService";
import OctoKitService from "./OctoKitService";

let subscriptionActionCheck: SubscriptionActionCheck | null = null;

export class SubscriptionActionCheck {
  subscriptionService: SubscriptionService;
  githubTokenService: GithubTokenService;
  private intervalId: any | null = null;
  private octokit: Octokit | null = null;
  private inProgressList: Set<number> = new Set();

  private constructor() {
    this.subscriptionService = new SubscriptionService();
    this.githubTokenService = new GithubTokenService();
  }
  static init() {
    if (subscriptionActionCheck === null) {
      subscriptionActionCheck = new SubscriptionActionCheck();
    }
    subscriptionActionCheck?.registerInterval();
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

    // this.intervalId = setInterval(() => {
    //   this.checkSubscriptionList();
    // }, 1000);
  }

  async checkSubscriptionList() {
    // const list = await this.subscriptionService.getList();
    // this.checkAction(list?.items[0]);
  }

  async checkAction(subscription: Subscription) {
    if (!subscription || this.octokit === null) {
      return;
    }

    const workFlowRun = (
      await this.octokit.actions.getWorkflowRun({
        owner: `SELISEdigitalplatforms`,
        repo: "l3-net-ipex-business",
        headers: OctoKitService.header,
      } as any)
    ).data as any as WorkflowRunList;
    workFlowRun.workflow_runs.forEach((run) => {
      if (run === null) {
        return;
      }
      if (run.status === "in_progress") {
        console.debug("In Progress", run);
        this.inProgressList.add(run.id);
      } else if (
        run.status === "completed" ||
        run.status === "cancelled" ||
        run.status === "failure"
      ) {
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
    console.debug("Run Completed", run);
  }
}

interface WorkflowRunList {
  total_count: number;
  workflow_runs: WorkflowRun[];
}
interface WorkflowRun {
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

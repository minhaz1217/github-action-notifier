import { Octokit } from "@octokit/rest";
import { Subscription } from "../domain/Subscription";
import SubscriptionService from "./SubscriptionService";
import OctoKitService from "./OctoKitService";
import Discord from "../notification-providers/Discord";
import AllSettingsService from "./AllSettingsService";
import DataObserver, { NotifierBuilder } from "../patterns/DataObserver";

let subscriptionActionCheck: SubscriptionActionCheck | null = null;
let called: boolean = false;

class SubscriptionActionCheck {
  subscriptionService: SubscriptionService;
  allSettingsService: AllSettingsService;
  private intervalId: any | null = null;
  private octokit: Octokit | null = null;
  private inProgressList: Set<number> = new Set();
  private discord: Discord;
  private _checkingInterval: number = 30;
  private constructor(discordUrl: string, checkingInterval: number) {
    this._checkingInterval = checkingInterval;
    this.subscriptionService = new SubscriptionService();
    this.allSettingsService = new AllSettingsService();

    this.discord = new Discord(discordUrl);
  }

  setSettings(discordUrl: string, checkingInterval: number) {
    this.discord = new Discord(discordUrl);
    this._checkingInterval = checkingInterval;
  }

  static async init(settingObserver: DataObserver) {
    if (typeof window === "undefined") {
    } else {
      if (called === false && subscriptionActionCheck === null) {
        settingObserver.subscribe(
          new NotifierBuilder(async () => {
            await this.setupSubscription();
          })
        );
        called = true;
        this.setupSubscription();
      }
    }
    return subscriptionActionCheck;
  }

  static async setupSubscription() {
    const settingService = new AllSettingsService();
    const discordUrl = await settingService.getDiscordUrl();
    const intervalTime = await settingService.getCheckingInterval();
    if (discordUrl) {
      if (subscriptionActionCheck) {
        clearInterval(subscriptionActionCheck.intervalId);
      }
      subscriptionActionCheck = new SubscriptionActionCheck(
        discordUrl,
        intervalTime
      );
      // console.debug("Is in client", subscriptionActionCheck.intervalId);
      await subscriptionActionCheck?.registerInterval();
    }
  }

  async registerInterval() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.inProgressList.clear();
    const githubToken = await this.allSettingsService.getGithubToken();
    if (githubToken === null || githubToken?.trim() === "") {
      throw Error("Github token not found");
    }
    this.octokit = new OctoKitService(githubToken).get();

    this.checkSubscriptionList();

    this.intervalId = setInterval(() => {
      this.checkSubscriptionList();
    }, this._checkingInterval * 1000);
  }

  async checkSubscriptionList() {
    const list = await this.subscriptionService.getList();
    if (list && list?.length > 0) {
      const onlyEnabled = list?.filter((x) => x.isEnabled === "TRUE");

      if (onlyEnabled.length === 0) {
        console.info(
          `${new Date().toISOString()} Checking Subscription -> 0 out of ${
            list.length
          } repos enabled`
        );
      } else {
        console.info(
          `${new Date().toISOString()} Checking Subscription -> for ${
            onlyEnabled?.length
          }`
        );
        onlyEnabled.forEach((item) => {
          this.checkAction(item);
        });
      }
    } else {
      console.info(
        `${new Date().toISOString()} Checking Subscription -> no repos to check`
      );
    }
  }

  async checkAction(subscription: Subscription) {
    if (!subscription || this.octokit === null) {
      return;
    }

    try {
      const workFlowRun = (
        await this.octokit.actions.getWorkflowRun({
          owner: subscription.owner,
          repo: subscription.name,
          headers: OctoKitService.header,
        } as any)
      ).data as any as WorkflowRunList;
      // console.debug("Workflow run", workFlowRun);
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
    } catch (err: any) {}
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
export default async function registerSubscriptionAction(
  settingObserver: DataObserver
) {
  const interval = await SubscriptionActionCheck.init(settingObserver);
}

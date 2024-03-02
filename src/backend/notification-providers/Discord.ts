import { WorkflowRun } from "../services/SubscriptionActionCheck";

export default class Discord {
  name = "discord";
  displayName = "Github Action Notifier";
  private _webHookUrl = "";

  constructor(webHookUrl: string) {
    this._webHookUrl = webHookUrl;
  }
  async send(workflowRun: WorkflowRun) {
    const payload: DiscordPayload = {
      username: this.displayName,
      content: `${workflowRun?.repository?.name} ${workflowRun?.head_commit?.message} -> ${workflowRun?.status}`,
    };
    await fetch(this._webHookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
}

interface DiscordPayload {
  username: string;
  content: string;
}

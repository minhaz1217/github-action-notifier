export default class Discord {
  name = "discord";
  async send(message: string) {
    const displayName = "Github Action Notifier";
    const webHookUrl =
      "https://discord.com/api/webhooks/1198312654331199700/N9XwDkb5iNNco0Zh_OFc67rOlJHScFNMP36bKvu--n_xXxhsUMDP7eybla_IK1y9q1Pt";
    const payload: DiscordPayload = {
      username: displayName,
      content: `${message}`,
    };
    await fetch(webHookUrl, {
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

import registerSubscriptionAction from "./backend/services/SubscriptionActionCheck";

export async function register() {
  await registerSubscriptionAction();
}

import DataObserver from "./backend/patterns/DataObserver";
import registerSubscriptionAction from "./backend/services/SubscriptionActionCheck";

export async function register(settingObserver: DataObserver) {
  await registerSubscriptionAction(settingObserver);
}

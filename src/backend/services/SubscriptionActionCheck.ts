import { Subscription } from "../domain/Subscription";
import SubscriptionService from "./SubscriptionService";

let subscriptionActionCheck: SubscriptionActionCheck | null = null;

export class SubscriptionActionCheck {
  private intervalId: any | null = null;
  subscriptionService: SubscriptionService;

  private constructor() {
    this.subscriptionService = new SubscriptionService();
  }
  static init() {
    console.debug("Init");
    if (subscriptionActionCheck === null) {
      subscriptionActionCheck = new SubscriptionActionCheck();
    }
    subscriptionActionCheck?.checkSubscriptionList();
    return subscriptionActionCheck;
  }

  registerInterval(){}

  async checkSubscriptionList() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    console.debug("Registered");
    this.intervalId = setInterval(() => {
      console.debug("CHECK INTERVAL");
    }, 1000);

    // const list = await this.subscriptionService.getList();
    // this.checkAction(list?.items[0]);
  }

  async checkAction(subscription: Subscription) {
    if (!subscription) {
      return;
    }
  }
}

import Tables from "../Tables";
import { Subscription } from "../domain/Subscription";
import Repository from "../repository/Repository";

export default class SubscriptionService {
  private subscriptionRepo: Repository;
  constructor() {
    this.subscriptionRepo = new Repository(Tables.SUBSCRIPTION);
  }

  getByName = async (name: string) => {
    const subscription = await this.subscriptionRepo.getFirstOne<Subscription>(
      this.subscriptionRepo.filter("name = {:key}", {
        key: name,
      })
    );
    return subscription;
  };

  getList = async () => {
    return await this.subscriptionRepo.getList<Subscription>(
      0,
      1000000,
      this.subscriptionRepo.filter("isEnabled={:isEnabled}", {
        isEnabled: true,
      })
    );
  };

  create = async (payload: Subscription) => {
    const alreadyExists = await this.getByName(payload.name);
    if (alreadyExists === null) {
      return await this.subscriptionRepo.create<Subscription>(payload);
    }
    return null;
  };

  changeIsEnabled = async (id: string, isEnabled: boolean) => {
    const subscription = await this.subscriptionRepo.getById<Subscription>(id);
    if (subscription !== null) {
      subscription.isEnabled = isEnabled;
      return await this.subscriptionRepo.update(subscription.id, subscription);
    }
    return null;
  };

  async delete(id: string) {
    return await this.subscriptionRepo.delete(id);
  }
}

import Tables from "../Tables";
import { Subscription } from "../domain/Subscription";
import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/RepositoryFactory";

export default class SubscriptionService {
  private subscriptionRepo: IRepository;
  constructor() {
    this.subscriptionRepo = RepositoryFactory.getRepository(
      Tables.SUBSCRIPTION
    );
  }

  getByName = async (name: string) => {
    // const subscription = await this.subscriptionRepo.getFirstOne<Subscription>(
    //   this.subscriptionRepo.filter("name = {:key}", {
    //     key: name,
    //   })
    // );

    const subscription =
      await this.subscriptionRepo.getFirstByFieldName<Subscription>(
        "name",
        name
      );
    return subscription;
  };

  getList = async () => {
    return this.subscriptionRepo.getList<Subscription>();
  };

  create = async (payload: Subscription) => {
    const alreadyExists = await this.getByName(payload.name);
    if (!alreadyExists) {
      return await this.subscriptionRepo.create<Subscription>(payload);
    }
    return null;
  };

  changeIsEnabled = async (id: string, isEnabled: boolean) => {
    const subscription = await this.subscriptionRepo.getById<Subscription>(id);
    if (subscription !== null) {
      subscription.isEnabled = isEnabled === true ? "TRUE" : "FALSE";
      return await this.subscriptionRepo.update(subscription.id, subscription);
    }
    return null;
  };

  async delete(id: string) {
    return await this.subscriptionRepo.delete(id);
  }
}

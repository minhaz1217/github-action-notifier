import Tables from "../dbs";
import { Subscription } from "../domain/Subscription";
import Repository from "../repository/Repository";

export default class SubscriptionService {
  private subscriptionRepo: Repository;
  constructor() {
    this.subscriptionRepo = new Repository(Tables.SUBSCRIPTION);
  }
  getList = async () => {
    return await this.subscriptionRepo.getList<Subscription>(0, 10, "");
  };

  async delete(id: string) {
    return await this.subscriptionRepo.delete(id);
  }
}

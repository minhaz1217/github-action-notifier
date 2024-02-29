import Tables from "../Tables";
import { Settings } from "../domain/Settings";
import { IRepository } from "./IRepository";
import { RepositoryFactory } from "./RepositoryFactory";

export default class SettingsRepository {
  private readonly repo: IRepository;
  constructor() {
    this.repo = RepositoryFactory.getRepository(Tables.SETTINGS);
  }
  async getKey(key: string) {
    const setting = await this.repo.getByKey<Settings>(key);

    if (setting) {
      return setting;
    }
    return null;
  }

  async setKey(key: string, value: string) {
    if (this.repo.getUserId() === null) {
      throw Error("Log in first");
    }

    const setting = await this.getKey(key);
    if (setting) {
      // saving the same value so no need for update call
      if (setting.value === value) {
        return setting;
      }
      // update operation
      return await this.repo.update<Settings>(setting.id, {
        key: key,
        value: value,
      } as Settings);
    }
    // insert operation
    return await this.repo.create<Settings>({
      key: key,
      value: value,
    } as Settings);
  }

  async removeKey(key: string) {
    const setting = await this.getKey(key);
    if (setting) {
      return await this.repo.delete(setting.id);
    }
    return false;
  }
}

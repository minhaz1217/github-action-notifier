import pb from "../db";
import { Settings } from "../domain/Settings";
import Repository from "./Repository";

export default class SettingsRepository {
  private readonly repo: Repository;
  constructor() {
    this.repo = new Repository("settings");
  }
  async getKey(key: string) {
    const setting = await this.repo.getFirstOne<Settings>(
      pb.filter("key = {:key}", {
        key: key,
      })
    );
    if (setting) {
      return setting;
    }
    return null;
  }

  async setKey(key: string, value: string) {
    const setting = await this.getKey(key);
    if (setting !== null) {
      // update operation
      return await this.repo.update<Settings>(setting.id, {
        key: key,
        value: value,
      });
    }
    // insert operation
    return await this.repo.create<Settings>({ key: key, value: value });
  }

  async removeKey(key: string) {
    const setting = await this.getKey(key);
    if (setting !== null) {
      return await this.repo.db.delete(setting.id);
    }
    return false;
  }
}

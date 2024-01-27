import SettingsRepository from "../repository/SettingsRepository";

export default class GithubTokenService {
  private readonly GITHUB_API_KEY_KEY = "API_KEY" as const;
  private readonly settingRepo: SettingsRepository;
  public apiKey: string | null = null;
  constructor() {
    this.settingRepo = new SettingsRepository();
  }
  async get() {
    const settings = await this.settingRepo.getKey(this.GITHUB_API_KEY_KEY);
    if (settings) {
      this.apiKey = settings.value;
    }
    return settings;
  }

  async set(apiKey: string) {
    const settings = await this.settingRepo.setKey(
      this.GITHUB_API_KEY_KEY,
      apiKey.trim()
    );
    if (settings !== null) {
      this.apiKey = settings.key;
    }
    return settings;
  }

  async remove() {
    const settings = await this.settingRepo.removeKey(this.GITHUB_API_KEY_KEY);
    if (settings === true) {
      this.apiKey = null;
    }
    return settings;
  }

  async exists() {
    return this.get() === null;
  }
}

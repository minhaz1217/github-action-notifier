import Tables from "../Tables";
import pb from "../db";
import { Settings } from "../domain/Settings";
import Repository from "../repository/Repository";
import SettingsRepository from "../repository/SettingsRepository";

export default class AllSettingsService {
  private readonly TOKEN_KEY = "API_KEY" as const;
  private readonly DISCORD_WEBHOOK_URL_KEY = "DISCORD_WEBHOOK_URL_KEY" as const;
  private readonly CHECKING_INTERVAL_KEY = "CHECKING_INTERVAL_KEY" as const;

  private readonly repo: Repository;
  private readonly settingRepo: SettingsRepository;
  public apiKey: string | null = null;
  constructor() {
    this.repo = new Repository(Tables.SETTINGS);
    this.settingRepo = new SettingsRepository();
  }
  async get() {
    const settings = await this.repo.db.getFullList<Settings>({
      filter: pb.filter(
        "key={:tokenKey}||key={:webhookKey}||key={:intervalKey}",
        {
          tokenKey: this.TOKEN_KEY,
          webhookKey: this.DISCORD_WEBHOOK_URL_KEY,
          intervalKey: this.CHECKING_INTERVAL_KEY,
        }
      ),
    });
    if (settings !== null) {
      const allSettings: AllSettings = {
        apiToken:
          settings.filter((x) => x.key === this.TOKEN_KEY)[0]?.value ?? "",
        discordWebHookUrl:
          settings.filter((x) => x.key === this.DISCORD_WEBHOOK_URL_KEY)[0]
            ?.value ?? "",
        checkingInterval: Number.parseInt(
          settings.filter((x) => x.key === this.CHECKING_INTERVAL_KEY)[0]
            ?.value ?? 30
        ),
      };
      return allSettings;
    }
    return null;
  }

  async set(apiKey: AllSettings) {
    try {
      if (apiKey?.apiToken?.trim()) {
        const settings = await this.settingRepo.setKey(
          this.TOKEN_KEY,
          apiKey.apiToken?.trim()
        );
      }

      if (
        apiKey?.checkingInterval &&
        Number.isInteger(apiKey.checkingInterval)
      ) {
        const settings = await this.settingRepo.setKey(
          this.CHECKING_INTERVAL_KEY,
          apiKey.checkingInterval.toString()
        );
      }

      if (apiKey.discordWebHookUrl?.trim()) {
        const settings = await this.settingRepo.setKey(
          this.DISCORD_WEBHOOK_URL_KEY,
          apiKey.discordWebHookUrl?.trim()
        );
      }
    } catch (e) {
      console.error("Error Occurred", e);
      return false;
    }
    return true;
  }

  async getDiscordUrl() {
    const discordUrl = await this.settingRepo.getKey(
      this.DISCORD_WEBHOOK_URL_KEY
    );
    if (discordUrl) {
      return discordUrl.value;
    }
    return "";
  }

  async getCheckingInterval() {
    const discordUrl = await this.settingRepo.getKey(
      this.CHECKING_INTERVAL_KEY
    );
    if (discordUrl) {
      return Number.parseInt(discordUrl.value) ?? 30;
    }
    return 30;
  }
}
interface AllSettings {
  checkingInterval: number;
  apiToken: string;
  discordWebHookUrl: string;
}

import Repository from "../repository/Repository";
import LocalStorageService from "./LocalStorageService";

export default class UserService {
  private _localStorage: LocalStorageService = new LocalStorageService();
  private _userRepo: Repository;
  private _token: string | null = null;
  private readonly authKey = "auth" as const;
  constructor() {
    this._userRepo = new Repository("users");
    this._token = this._localStorage.get(this.authKey);
  }

  async create(email: string, password: string, confirmPassword: string) {
    const createdUser = await this._userRepo.create({
      email: email,
      password: password,
      passwordConfirm: confirmPassword,
    });
    return createdUser;
  }

  async authWithPassword(email: string, password: string) {
    this._token = null;
    this._localStorage.set(this.authKey, this._token);
    const authenticatedUser = await this._userRepo.authWithPassword(
      email,
      password
    );
    if (authenticatedUser && authenticatedUser?.token) {
      this._token = authenticatedUser.token;
      this._localStorage.set(this.authKey, this._token);
    }
    return authenticatedUser;
  }

  logout() {
    this._token = null;
    this._localStorage.set(this.authKey, null);
  }

  isLoggedIn() {
    return this._token !== null;
  }
  token(): string | null {
    return this._token;
  }
}

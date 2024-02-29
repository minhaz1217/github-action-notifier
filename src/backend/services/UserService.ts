import LocalStorageKeys from "../LocalStorageKeys";
import Tables from "../Tables";
import { IRepository } from "../repository/IRepository";
import { RepositoryFactory } from "../repository/RepositoryFactory";
import LocalStorageService from "./LocalStorageService";

export default class UserService {
  private _localStorage: LocalStorageService = new LocalStorageService();
  private _userRepo: IRepository;
  private _token: string | null = null;
  private _userId: string | null = null;
  constructor() {
    this._userRepo = RepositoryFactory.getRepository(
      Tables.USERS,
      "POCKETBASE"
    );
    this._token = this._localStorage.get(LocalStorageKeys.AUTH);
    this._userId = this._localStorage.get(LocalStorageKeys.USER_ID);
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
    this._localStorage.set(LocalStorageKeys.AUTH, this._token);
    const authenticatedUser = await this._userRepo.authWithPassword(
      email,
      password
    );
    if (authenticatedUser?.token) {
      this._token = authenticatedUser.token;
      this._localStorage.set(LocalStorageKeys.AUTH, this._token);
      this._userId = authenticatedUser.record.id;
      this._localStorage.set(LocalStorageKeys.USER_ID, this._userId);
    }
    return authenticatedUser;
  }

  logout() {
    this._token = null;
    this._localStorage.set(LocalStorageKeys.AUTH, null);
    this._userRepo.clear();
  }

  isLoggedIn() {
    // TODO: remove this true when deploying in real.
    return true || this._token !== null;
  }
  token(): string | null {
    return this._token;
  }

  userId(): string | null {
    return this._userId;
  }
}

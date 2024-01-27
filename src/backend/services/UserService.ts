import LocalStorageKeys from "../LocalStorageKeys";
import Tables from "../Tables";
import Repository from "../repository/Repository";
import LocalStorageService from "./LocalStorageService";

export default class UserService {
  private _localStorage: LocalStorageService = new LocalStorageService();
  private _userRepo: Repository;
  private _token: string | null = null;
  constructor() {
    this._userRepo = new Repository(Tables.USERS);
    this._token = this._localStorage.get(LocalStorageKeys.AUTH);
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
    if (authenticatedUser && authenticatedUser?.token) {
      this._token = authenticatedUser.token;
      this._localStorage.set(LocalStorageKeys.AUTH, this._token);
    }
    return authenticatedUser;
  }

  logout() {
    this._token = null;
    this._localStorage.set(LocalStorageKeys.AUTH, null);
    this._userRepo.clear();
  }

  isLoggedIn() {
    return this._token !== null;
  }
  token(): string | null {
    return this._token;
  }
}

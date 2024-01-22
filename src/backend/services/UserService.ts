import Repository from "../repository/Repository";

export default class UserService {
  private _userRepo: Repository;
  private _token: string | null = null;
  constructor() {
    this._userRepo = new Repository("users");
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
    const authenticatedUser = await this._userRepo.authWithPassword(
      email,
      password
    );
    if (authenticatedUser && authenticatedUser?.token) {
      this._token = authenticatedUser.token;
    }
    return authenticatedUser;
  }

  token(): string | null {
    return this._token;
  }
}

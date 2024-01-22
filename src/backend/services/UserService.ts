import Repository from "../repository/Repository";

export default class UserService {
  private _userRepo: Repository;
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
}

import { IRepository } from "./IRepository";
import { LocalStorageRepository } from "./LocalStorageRepository";
import PocketBaseRepository from "./PocketBaseRepository";

export class RepositoryFactory {
  static getRepository(
    dbName: string = "",
    repo: "POCKETBASE" | "LOCALSTORAGE" | "INDEXED_DB" | null = null
  ): IRepository {
    return new PocketBaseRepository(dbName);
    // TODO: depending on environment return repository
    if (repo === "POCKETBASE") {
    }
    return new LocalStorageRepository();
  }
}

import { IRepository } from "./IRepository";
import { IndexedDBRepository } from "./IndexedDBRepository";
import { LocalStorageRepository } from "./LocalStorageRepository";
import PocketBaseRepository from "./PocketBaseRepository";

export class RepositoryFactory {
  static getRepository(
    dbName: string = "",
    repo: "POCKETBASE" | "LOCALSTORAGE" | "INDEXED_DB" | null = null
  ): IRepository {
    if (repo === "POCKETBASE") {
      return new PocketBaseRepository(dbName);
    } else if (repo === "LOCALSTORAGE") {
      return new LocalStorageRepository(dbName);
    }

    return new IndexedDBRepository(dbName);
    // TODO: depending on environment return repository
  }
}

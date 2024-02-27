import { IRepository } from "./IRepository";
import { IndexedDBRepository } from "./IndexedDBRepository";
import { LocalStorageRepository } from "./LocalStorageRepository";
import PocketBaseRepository from "./PocketBaseRepository";

export class RepositoryFactory {
  static getRepository(
    dbName: string = "",
    repo: "POCKETBASE" | "LOCALSTORAGE" | "INDEXED_DB" | null = null
  ): IRepository {
    return new IndexedDBRepository(dbName);
    // TODO: depending on environment return repository
    if (repo === "POCKETBASE") {
    }
    return new LocalStorageRepository();
  }
}

import {
  ListResult,
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";
import { initDB, useIndexedDB } from "react-indexed-db-hook";
import Tables from "../Tables";
import { Key } from "react-indexed-db-hook/lib/indexed-db";

export class IndexedDBRepository implements IRepository {
  dbName: string;
  db: {
    add: <T = any>(value: T, key?: any) => Promise<number>;
    getByID: <T = any>(id: number | string) => Promise<T>;
    getAll: <T = any>() => Promise<T[]>;
    update: <T = any>(value: T, key?: any) => Promise<any>;
    deleteRecord: (key: Key) => Promise<any>;
    openCursor: (
      cursorCallback: (event: Event) => void,
      keyRange?: IDBKeyRange
    ) => Promise<void>;
    getByIndex: (indexName: string, key: any) => Promise<any>;
    clear: () => Promise<any>;
  };
  constructor(dbName: string) {
    this.dbName = dbName;
    initDB(DBConfig);
    this.db = useIndexedDB(this.dbName);
  }
  getList<T>(
    pageIndex: number,
    pageSize: number,
    filter: string
  ): Promise<ListResult<T>> {
    throw new Error("Method not implemented.");
  }
  getFullList<T>(filter: string): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  getFirstOne<T>(filter: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  getById<T>(id: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  async create<T>(payload: T): Promise<T> {
    await this.db.add<T>(payload);
    return payload;
  }
  async update<T>(
    id: string,
    payload?: T | undefined,
    options?: RecordOptions | undefined
  ): Promise<T> {
    if (!payload) {
      throw new Error("payload needed to update");
    }
    return await this.db.update<T>(payload);
  }
  delete(id: string): Promise<boolean> {
    return this.db.deleteRecord(id);
  }
  authWithPassword(
    email: string,
    password: string
  ): Promise<RecordAuthResponse<RecordModel>> {
    throw new Error("Method not implemented.");
  }
  token(): string | null {
    throw new Error("Method not implemented.");
  }
  getUserId(): string | null {
    throw new Error("Method not implemented.");
  }
  filter(raw: string, params?: { [key: string]: any } | undefined): string {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }
}

export const DBConfig = {
  name: "Github-Action-Notifier",
  version: 1,
  objectStoresMeta: [
    {
      store: Tables.SETTINGS,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "created", keypath: "created", options: { unique: false } },
        { name: "updated", keypath: "updated", options: { unique: false } },
        { name: "key", keypath: "key", options: { unique: true } },
        { name: "value", keypath: "value", options: { unique: false } },
        { name: "user", keypath: "user", options: { unique: false } },
      ],
    },
    {
      store: Tables.SUBSCRIPTION,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "created", keypath: "created", options: { unique: false } },
        { name: "updated", keypath: "updated", options: { unique: false } },
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "url", keypath: "url", options: { unique: true } },
        { name: "githubId", keypath: "githubId", options: { unique: true } },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        { name: "owner", keypath: "owner", options: { unique: false } },
        { name: "isEnabled", keypath: "isEnabled", options: { unique: false } },
      ],
    },
  ],
};

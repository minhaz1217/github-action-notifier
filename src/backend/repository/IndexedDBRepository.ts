"use client";

import {
  ListResult,
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";
import Tables from "../Tables";
import { Key } from "react-indexed-db-hook/lib/indexed-db";
import { initDB } from "react-indexed-db";

export class IndexedDBRepository implements IRepository {
  dbName: string;
  db: IDBObjectStore;
  constructor(dbName: string) {
    this.dbName = dbName;
    const request = window.indexedDB.open(DBConfig.name, DBConfig.version);
    request.onerror = (event) => {
      console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = (event) => {
      this.db = event.target.result;
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = event.target.result;

      DBConfig.objectStoresMeta.forEach((objectMeta) => {
        const store = db.createObjectStore(objectMeta.store, {
          keyPath: objectMeta.storeConfig.keyPath,
          autoincrement: objectMeta.storeConfig.autoIncrement,
        });

        objectMeta.storeSchema.forEach((schema) => {
          store.createIndex(schema.name, schema.keypath, {
            unique: schema.options.unique,
          });
        });
      });
    };

    
    initDB(DBConfig);
  }
  getByKeys<T>(keys: string[]): Promise<T[]> {
    throw new Error("Method not implemented.");
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

var DBConfig: IndexedDBProps = {
  name: "Github-Action-Notifier-3",
  version: 3,
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

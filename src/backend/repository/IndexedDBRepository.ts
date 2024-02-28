"use client";

import {
  ListResult,
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";
import Tables from "../Tables";
import { Database, Model } from "@n1md7/indexeddb-promise";
import { ConfigType } from "@n1md7/indexeddb-promise/lib/types";

export class IndexedDBRepository implements IRepository {
  dbName: string;
  indexedDb: Database;
  db: Model<any> | null = null;
  constructor(dbName: string) {
    this.dbName = dbName;
    this.indexedDb = new Database(DBConfig);
  }

  async startConnection<T>() {
    await this.indexedDb.connect();
    return this.indexedDb.useModel<T>(this.dbName);
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
  async getById<T>(id: string): Promise<T | null> {
    const db: Model<T> = await this.startConnection<T>();
    return (await db.selectByPk(id)) as T;
  }
  async create<T>(payload: T): Promise<T> {
    const db: Model<T> = await this.startConnection<T>();
    return (await db.insert(payload)) as T;
  }
  async update<T>(
    id: string,
    payload?: T | undefined,
    options?: RecordOptions | undefined
  ): Promise<T | undefined> {
    if (!payload) {
      throw undefined;
    }
    const db: Model<T> = await this.startConnection<T>();
    return await db.updateByPk(id, payload);
  }
  async delete(id: string): Promise<boolean> {
    const db: Model<any> = await this.startConnection<any>();
    return (await db.deleteByPk(id)) ? true : false;
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

const DBConfig: ConfigType = {
  name: "github-action-notifier",
  version: 1,
  tables: [
    {
      name: Tables.SETTINGS,
      primaryKey: {
        name: "id",
        autoIncrement: true,
        unique: true,
      },
      indexes: {
        created: {
          unique: false,
        },
        updated: {
          unique: false,
        },
        key: {
          unique: true,
        },
        value: {
          unique: false,
        },
        user: {
          unique: false,
        },
      },
      timestamps: true,
    },
    {
      name: Tables.SUBSCRIPTION,
      primaryKey: {
        name: "id",
        autoIncrement: true,
        unique: true,
      },
      indexes: {
        created: {
          unique: false,
        },
        updated: {
          unique: false,
        },
        name: {
          unique: false,
        },
        url: {
          unique: true,
        },
        githubId: {
          unique: true,
        },
        description: {
          unique: false,
        },
        owner: {
          unique: false,
        },
        isEnabled: {
          unique: false,
        },
      },
      timestamps: true,
    },
  ],
} as const;
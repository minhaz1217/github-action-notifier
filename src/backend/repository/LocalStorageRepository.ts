import {
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";
import LocalStorageService from "../services/LocalStorageService";

export class LocalStorageRepository implements IRepository {
  dbName: string;
  localStorageService: LocalStorageService;
  constructor(dbName: string) {
    this.dbName = dbName;
    this.localStorageService = new LocalStorageService();
  }
  getList<T>(
    pageIndex?: number | undefined,
    pageSize?: number | undefined,
    filter?: string | undefined
  ): Promise<T[] | undefined> {
    throw new Error("Method not implemented.");
  }
  getByKeys<T>(keys: string[]): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  getByKey<T>(key: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  getFirstByFieldName<T>(
    fieldName: string,
    value: string
  ): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
  getByFieldName<T>(
    fieldName: string,
    value: string | boolean
  ): Promise<T[] | undefined> {
    throw new Error("Method not implemented.");
  }
  getById<T>(id: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  create<T>(payload: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update<T>(
    id: string,
    payload?: T | undefined,
    options?: RecordOptions | undefined
  ): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  authWithPassword(
    email: string,
    password: string
  ): Promise<RecordAuthResponse<RecordModel>> {
    throw new Error("Method not implemented.");
  }
  getUserId(): string | null {
    throw new Error("Method not implemented.");
  }
  clear(): void {
    throw new Error("Method not implemented.");
  }
}

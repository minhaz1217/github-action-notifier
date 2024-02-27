import {
  ListResult,
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";
import LocalStorageService from "../services/LocalStorageService";
import { Base } from "../domain/Base";
import { UniqueComponentId } from "primereact/utils";
import { UUID } from "crypto";
import getUUID from "../utils/generateUUID";

export class LocalStorageRepository implements IRepository {
  dbName: string;
  localStorageService: LocalStorageService;
  constructor(dbName: string) {
    this.dbName = dbName;
    this.localStorageService = new LocalStorageService();
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
    if (!id || id.trim() === "") {
      return null;
    }
    const key = this.getLocalStorageKey(id);
    const data = this.localStorageService.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  /** create in db */
  async create<T>(payload: T): Promise<T> {
    let id: string = (payload as Base).id;
    if (!id || id.trim() === "") {
      id = getUUID();
    }
    (payload as any).id = id;
    const key = this.getLocalStorageKey(id);
    console.debug("Got Key", key);
    this.localStorageService.set(key, JSON.stringify(payload));
    return payload;
  }

  /** combines the db name and the given id */
  private getLocalStorageKey(id: string) {
    return `${this.dbName}_${id}`;
  }

  /** gets key and store in the local storage */
  private storeInLocalStorage(id: string, payload: any) {
    const key = this.getLocalStorageKey(id);
    this.localStorageService.set(key, JSON.stringify(payload));
  }

  async update<T>(
    id: string,
    payload?: T,
    options?: RecordOptions
  ): Promise<T> {
    if (!id || id.trim() === "") {
      throw new Error("ID required for update");
    }

    if (!payload) {
      throw new Error("Value is needed to perform an update");
    }

    let data = await this.getById(id);
    if (!data) {
      throw new Error("No record found");
    }

    this.storeInLocalStorage(id, payload);
    return payload;
  }

  async delete(id: string): Promise<boolean> {
    this.localStorageService.remove(this.getLocalStorageKey(id));
    return true;
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

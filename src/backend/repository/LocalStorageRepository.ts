import {
  ListResult,
  RecordOptions,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { IRepository } from "./IRepository";

export class LocalStorageRepository implements IRepository {
  getFullList<T>(filter: string): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  getList<T>(
    pageIndex: number,
    pageSize: number,
    filter: string
  ): Promise<ListResult<T>> {
    throw new Error("Method not implemented.");
  }
  getFirstOne<T>(filter: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  getById<T>(id: string): Promise<T | null> {
    throw new Error("Method not implemented.");
  }
  create<T>(
    bodyParams?: FormData | { [key: string]: any } | undefined,
    options?: RecordOptions | undefined
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update<T>(
    id: string,
    bodyParams?: FormData | { [key: string]: any } | undefined,
    options?: RecordOptions | undefined
  ): Promise<T> {
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

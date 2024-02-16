import {
  ListResult,
  RecordAuthResponse,
  RecordModel,
  RecordOptions,
  RecordService,
} from "pocketbase";
import pb from "../db";
import { IRepository } from "./IRepository";

export default class PocketBaseRepository implements IRepository {
  private readonly _collectionName: string;
  public readonly db: RecordService;
  private readonly _pb;
  constructor(collectionName: string) {
    this._collectionName = collectionName;
    this._pb = pb;
    this.db = this._pb.collection(this._collectionName);
  }

  /** gets list of items by page index, page size and filter, make the filter using repo.filter */
  async getList<T>(
    pageIndex: number,
    pageSize: number,
    filter: string
  ): Promise<ListResult<T>> {
    return await this.db.getList<T>(pageIndex, pageSize, {
      filter: filter,
    });
  }

  /** gets full list of record */
  getFullList<T>(filter: string): Promise<T[]> {
    return this.db.getFullList<T>({
      filter: filter,
    });
  }

  /** get first one that matches the filter, make the filter using repo.filter */
  async getFirstOne<T>(filter: string): Promise<T | null> {
    try {
      return await this.db.getFirstListItem<T>(filter);
    } catch (ex: any) {
      // console.error("error", ex, filter);
    }
    return null;
  }

  /** get item by id */
  async getById<T>(id: string): Promise<T | null> {
    return await this.getFirstOne<T>(
      this.filter("id={:id}", {
        id: id,
      })
    );
  }

  /** create in db */
  async create<T>(
    bodyParams?:
      | {
          [key: string]: any;
        }
      | FormData,
    options?: RecordOptions
  ): Promise<T> {
    return await this.db.create<T>(
      { ...bodyParams, user: this.getUserId() },
      options
    );
  }

  /** update in db */
  async update<T>(
    id: string,
    bodyParams?:
      | {
          [key: string]: any;
        }
      | FormData,
    options?: RecordOptions
  ): Promise<T> {
    return await this.db.update<T>(
      id,
      { ...bodyParams, user: this.getUserId() },
      options
    );
  }

  /** delete form db */
  async delete(id: string): Promise<boolean> {
    return await this.db.delete(id);
  }

  /** logs in with email and password */
  async authWithPassword(
    email: string,
    password: string
  ): Promise<RecordAuthResponse<RecordModel>> {
    return await this.db.authWithPassword(email, password);
  }

  /** get token from pb authstore */
  token(): string | null {
    if (this._pb?.authStore?.token) {
      return this._pb?.authStore?.token as string;
    }
    return null;
  }

  /** gets user id from pb authstore model */
  getUserId(): string | null {
    if (this._pb?.authStore?.model?.id) {
      return this._pb?.authStore?.model?.id as string;
    }
    return null;
  }

  /** Adapter for pb.filter */
  filter(raw: string, params?: { [key: string]: any }): string {
    return this._pb.filter(raw, params);
  }

  /** clears pb authstore */
  clear(): void {
    this._pb.authStore.clear();
  }
}

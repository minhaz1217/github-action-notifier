import { RecordOptions, RecordService } from "pocketbase";
import pb from "../db";
import { Settings } from "../domain/Settings";

export default class Repository {
  private readonly _collectionName: string;
  public readonly db: RecordService;
  private readonly _pb;
  constructor(collectionName: string) {
    this._collectionName = collectionName;
    this._pb = pb;
    this.db = this._pb.collection(this._collectionName);
  }

  /** gets list of items by page index, page size and filter, make the filter using repo.filter */
  async getList<T>(pageIndex: number, pageSize: number, filter: string) {
    return await this.db.getList<T>(pageIndex, pageSize, {
      filter: filter,
    });
  }

  /** get first one that matches the filter, make the filter using repo.filter */
  async getFirstOne<T>(filter: string) {
    try {
      return await this.db.getFirstListItem<T>(filter);
    } catch (ex: any) {
      // console.error("error", ex, filter);
    }
    return null;
  }

  async getById<T>(id: string) {
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
  ) {
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
  ) {
    return await this.db.update<T>(
      id,
      { ...bodyParams, user: this.getUserId() },
      options
    );
  }

  /** delete form db */
  async delete(id: string) {
    return await this.db.delete(id);
  }

  /** logs in with email and password */
  async authWithPassword(email: string, password: string) {
    return await this.db.authWithPassword(email, password);
  }

  /** get token from pb authstore */
  token() {
    if (this._pb?.authStore?.token) {
      return this._pb?.authStore?.token as string;
    }
    return null;
  }

  /** gets user id from pb authstore model */
  getUserId() {
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
  clear() {
    this._pb.authStore.clear();
  }
}

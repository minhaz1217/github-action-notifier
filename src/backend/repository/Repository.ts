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
  async getList<T>(pageIndex: number, pageSize: number, filter: string) {
    return await this.db.getList<T>(pageIndex, pageSize, {
      filter: filter,
    });
  }

  async getFirstOne<T>(filter: string) {
    try {
      return await this.db.getFirstListItem<Settings>(filter);
    } catch (ex: any) {
      // console.error("error", ex, filter);
    }
    return null;
  }

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
  // fetch a paginated records list
  resultList = async () =>
    await this.db.getList(1, 50, {
      filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2',
    });

  // you can also fetch all records at once via getFullList
  records = async () =>
    await this.db.getFullList({
      sort: "-created",
    });

  // or fetch only the first record that matches the specified filter
  record = async () =>
    await this.db.getFirstListItem('someField="test"', {
      expand: "relField1,relField2.subRelField",
    });

  async delete(id: string) {
    return await this.db.delete(id);
  }

  async authWithPassword(email: string, password: string) {
    return await this.db.authWithPassword(email, password);
  }

  token() {
    if (this._pb?.authStore?.token) {
      return this._pb?.authStore?.token as string;
    }
    return null;
  }

  getUserId() {
    if (this._pb?.authStore?.model?.id) {
      return this._pb?.authStore?.model?.id as string;
    }
    return null;
  }
  clear() {
    this._pb.authStore.clear();
  }
}

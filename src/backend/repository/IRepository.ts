import {
  ListResult,
  RecordAuthResponse,
  RecordModel,
  RecordOptions,
} from "pocketbase";

export interface IRepository {
  /** gets list of items by page index, page size and filter, make the filter using repo.filter */
  getList<T>(
    pageIndex: number,
    pageSize: number,
    filter: string
  ): Promise<ListResult<T>>;

  /** gets full list of record */
  getFullList<T>(filter: string): Promise<T[]>;

  /** get first one that matches the filter, make the filter using repo.filter */
  getFirstOne<T>(filter: string): Promise<T | null>;

  /** get item by id */
  getById<T>(id: string): Promise<T | null>;

  /** create in db */
  create<T>(
    bodyParams?:
      | {
          [key: string]: any;
        }
      | FormData,
    options?: RecordOptions
  ): Promise<T>;

  /** updates item */
  update<T>(
    id: string,
    bodyParams?:
      | {
          [key: string]: any;
        }
      | FormData,
    options?: RecordOptions
  ): Promise<T>;

  /** deletes form db */
  delete(id: string): Promise<boolean>;

  /** logs in with email and password */
  authWithPassword(
    email: string,
    password: string
  ): Promise<RecordAuthResponse<RecordModel>>;

  /** get token from pb authstore */
  token(): string | null;

  /** gets user id from pb authstore model */
  getUserId(): string | null;

  /** Adapter for pb.filter */
  filter(raw: string, params?: { [key: string]: any }): string;

  /** clears pb authstore */
  clear(): void;
}

import { RecordAuthResponse, RecordModel, RecordOptions } from "pocketbase";

export interface IRepository {
  /** gets list of items by page index, page size and filter, make the filter using repo.filter */
  getList<T>(
    pageIndex?: number,
    pageSize?: number,
    filter?: string
  ): Promise<T[] | undefined>;

  /** gets full list of record */
  getByKeys<T>(keys: string[]): Promise<T[]>;

  /** gets a single record by key */
  getByKey<T>(key: string): Promise<T | null>;

  getFirstByFieldName<T>(
    fieldName: string,
    value: string
  ): Promise<T | undefined>;

  getByFieldName<T>(
    fieldName: string,
    value: string | boolean
  ): Promise<T[] | undefined>;

  /** get item by id */
  getById<T>(id: string): Promise<T | null>;

  /** create in db */
  create<T>(payload: T): Promise<T>;

  /** updates item */
  update<T>(
    id: string,
    payload?: T,
    options?: RecordOptions
  ): Promise<T | undefined>;

  /** deletes form db */
  delete(id: string): Promise<boolean>;

  /** logs in with email and password */
  authWithPassword(
    email: string,
    password: string
  ): Promise<RecordAuthResponse<RecordModel>>;

  /** gets user id from pb authstore model */
  getUserId(): string | null;

  /** clears pb authstore */
  clear(): void;
}

import getUUID from "../utils/generateUUID";

export class Base {
  id: string = getUUID();
  created: Date = new Date();
  updated: Date = new Date();
}

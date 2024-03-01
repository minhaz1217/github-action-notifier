import { Base } from "./Base";
import { StringBoolean } from "./StringBoolean";

export class Subscription extends Base {
  name: string = "";
  url: string = "";
  githubId: string = "";
  description: string = "";
  owner: string = "";
  isEnabled: StringBoolean = "TRUE";
}

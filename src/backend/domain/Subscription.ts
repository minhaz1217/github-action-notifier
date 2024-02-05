import { Base } from "./Base";

export class Subscription extends Base {
  name: string = "";
  url: string = "";
  githubId: string = "";
  description: string = "";
  owner: string = "";
  isEnabled: boolean = false;
}

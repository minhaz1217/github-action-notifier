import { StringBoolean } from "../domain/StringBoolean";

export interface RepoModel {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  owner: {
    id: string;
    login: string;
  };
  isEnabled: StringBoolean;
}

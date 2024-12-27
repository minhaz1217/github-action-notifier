import { StringBoolean } from "../domain/StringBoolean";

/**
 * This is used to get repo information from github
 */
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

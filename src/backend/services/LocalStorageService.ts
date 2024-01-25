export default class LocalStorageService {
  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: string | null) {
    if (value === null) {
      localStorage.removeItem(key);
      return;
    }
    return localStorage.setItem(key, value);
  }
}

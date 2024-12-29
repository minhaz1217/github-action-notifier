"use client";

export default class LocalStorageService {
  get(key: string): any {
    if (localStorage) {
      return localStorage.getItem(key);
    }
  }

  set(key: string, value: string | null) {
    if (localStorage) {
      if (value === null) {
        localStorage.removeItem(key);
        return;
      }
      return localStorage.setItem(key, value);
    }
  }

  remove(key: string) {
    if (localStorage) {
      return localStorage.removeItem(key);
    }
  }
}

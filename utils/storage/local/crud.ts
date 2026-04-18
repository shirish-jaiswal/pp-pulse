"use client";

import { LocalStorageKeysType } from "@/utils/storage/local/keys";

export function getLocal(key: LocalStorageKeysType) {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

export function setLocal(key: LocalStorageKeysType, value: unknown) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function omitLocal(key: LocalStorageKeysType) {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}

export const LocalStorage = {
  set: setLocal,
  get: getLocal,
  omit: omitLocal,
  update: setLocal,
};

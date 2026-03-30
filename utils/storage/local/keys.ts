// utils/storage/local/keys.ts
// NO IMPORTS HERE

export const LocalStorageKeys = {
  KEY_JSESSIONID: "KEY_JSESSIONID",
  _oauth2_proxy_0: "_oauth2_proxy_0",
  _oauth2_proxy_1: "_oauth2_proxy_1",
  sid: "sid",
  cc_cookie: "cc_cookie",
} as const;

export type LocalStorageKeysType = keyof typeof LocalStorageKeys;


import { getLocal, setLocal } from "@/utils/storage/local/crud";
import { LocalStorageKeys } from "@/utils/storage/local/keys";

export function isSessionDataPresent() {
  return (
    getLocal(LocalStorageKeys.sid) &&
    getLocal(LocalStorageKeys.KEY_JSESSIONID) &&
    getLocal(LocalStorageKeys._oauth2_proxy_0) &&
    getLocal(LocalStorageKeys._oauth2_proxy_1) &&
    getLocal(LocalStorageKeys.cc_cookie)
  );
}

export function setSessionData(
  jsessionId: string,
  oAuthCookie1: string,
  oAuthCookie2: string,
  sid: string,
  ccCookie: string
) {
  setLocal(LocalStorageKeys.sid, sid);
  setLocal(LocalStorageKeys.KEY_JSESSIONID, jsessionId);
  setLocal(LocalStorageKeys._oauth2_proxy_0, oAuthCookie1);
  setLocal(LocalStorageKeys._oauth2_proxy_1, oAuthCookie2);
  setLocal(LocalStorageKeys.cc_cookie, ccCookie);
}

export function getSessionData () {
  return {
    jsessionId: getLocal(LocalStorageKeys.KEY_JSESSIONID) as string,
    oAuthCookie1: getLocal(LocalStorageKeys._oauth2_proxy_0) as string,
    oAuthCookie2: getLocal(LocalStorageKeys._oauth2_proxy_1) as string,
    sid: getLocal(LocalStorageKeys.sid) as string,
    cc_cookie: getLocal(LocalStorageKeys.cc_cookie) as string
  };
}
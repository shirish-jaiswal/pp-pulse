import { ACCESS_TOKEN_KEY } from "@/utils/storage/sesssion/keys";

function setAccessToken(accessToken: string) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearAccessToken() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export const AccessToken = {
    setAccessToken,
    getAccessToken,
    clearAccessToken,
};



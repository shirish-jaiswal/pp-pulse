import { REFRESH_TOKEN_KEY } from "@/utils/storage/sesssion/keys";

function setRefreshToken(refreshToken: string) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function getRefreshToken() {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

function clearRefreshToken() {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const RefreshToken = {
    setRefreshToken,
    getRefreshToken,
    clearRefreshToken,
};
import apiRequest from "@/lib/api/api-request";

export type UserSearchByEmailProps  = { emailAddress: string };
export type UserSearchByUserIdProps = { userId: string };

// Raw shape from backend (PascalCase + mixed keys)
type RawUser = {
    UserId?: string | null;
    EmailAddress?: string | null;
    ScreenName?: string | null;
    ChatAllowedFlag?: boolean | number | null;
    Blocked_Comments?: string | null;
    CasinoId?: string | null;
    CasinoName?: string | null;
    ClassName?: string | null;
    Env?: string | null;
    EnvironmentName?: string | null;
    NickName?: string | null;
    screen_name_updatecount?: number | null;
    // camelCase fallbacks (in case backend changes)
    userId?: string | null;
    emailAddress?: string | null;
    screenName?: string | null;
    chatAllowedFlag?: boolean | number | null;
    chatBlockedComments?: string | null;
    casinoId?: string | null;
    casinoName?: string | null;
    className?: string | null;
    env?: string | null;
    environmentName?: string | null;
    nickName?: string | null;
    screenNameUpdateCount?: number | null;
    status?: string | null;
};

// Normalised shape used throughout the UI
export type UserData = {
    userId: string | null;
    emailAddress: string | null;
    screenName: string | null;
    chatAllowedFlag: boolean;
    chatBlockedComments: string | null;
    casinoId: string | null;
    casinoName: string | null;
    className: string | null;
    env: string | null;
    environmentName: string | null;
    nickName: string | null;
    screenNameUpdateCount: number | null;
    status: string | null;
};

function normalise(raw: RawUser): UserData {
    const flag = raw.ChatAllowedFlag ?? raw.chatAllowedFlag;
    return {
        userId:               raw.UserId               ?? raw.userId               ?? null,
        emailAddress:         raw.EmailAddress          ?? raw.emailAddress          ?? null,
        screenName:           raw.ScreenName            ?? raw.screenName            ?? null,
        chatAllowedFlag:      flag === true || flag === 1,
        chatBlockedComments:  raw.Blocked_Comments      ?? raw.chatBlockedComments   ?? null,
        casinoId:             raw.CasinoId              ?? raw.casinoId              ?? null,
        casinoName:           raw.CasinoName            ?? raw.casinoName            ?? null,
        className:            raw.ClassName             ?? raw.className             ?? null,
        env:                  raw.Env                   ?? raw.env                   ?? null,
        environmentName:      raw.EnvironmentName       ?? raw.environmentName       ?? null,
        nickName:             raw.NickName              ?? raw.nickName              ?? null,
        screenNameUpdateCount:raw.screen_name_updatecount ?? raw.screenNameUpdateCount ?? null,
        status:               raw.status                                             ?? null,
    };
}

async function searchUser(params: Record<string, string>): Promise<UserData[]> {
    const res = await apiRequest({
        method: "GET",
        endpoint: "user-management/search",
        params,
        requireCookie: true,
    });

    const rows: RawUser[] = Array.isArray(res?.data)
        ? res.data
        : res?.data != null
            ? [res.data]
            : res?.UserId != null || res?.userId != null
                ? [res]
                : [];

    return rows.map(normalise);
}

export async function searchUserByEmail(p: UserSearchByEmailProps):  Promise<UserData[]> {
    return searchUser({ emailAddress: p.emailAddress });
}
export async function searchUserByUserId(p: UserSearchByUserIdProps): Promise<UserData[]> {
    return searchUser({ userId: p.userId });
}

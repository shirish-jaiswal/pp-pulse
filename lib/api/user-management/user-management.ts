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
    note_time?: string | null;
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
    noteTime?: string | null;
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
    noteTime: string | null;
};

// A single comment entry with its associated timestamp
export type CommentEntry = {
    comment: string;
    noteTime: string | null;
};

// Merged shape: all fields from the latest-timepoint row,
// but comments collected from ALL duplicate rows (desc by noteTime)
export type MergedUserData = Omit<UserData, "chatBlockedComments"> & {
    comments: CommentEntry[];
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
        noteTime:             raw.note_time               ?? raw.noteTime             ?? null,
    };
}

/**
 * Merges duplicate rows that share the same userId:
 * - All non-comment fields come from the row with the latest noteTime.
 * - Comments are collected from every row in the group,
 *   de-duplicated by content, and sorted descending by noteTime.
 */
export function mergeByUserId(rows: UserData[]): MergedUserData[] {
    const groups = new Map<string, UserData[]>();

    for (const user of rows) {
        const key = user.userId ?? `__no_id_${Math.random()}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(user);
    }

    const merged: MergedUserData[] = [];

    for (const group of groups.values()) {
        // Pick the row with the latest noteTime as the "base" record
        const base = group.reduce((latest, cur) => {
            const latestMs = latest.noteTime ? new Date(latest.noteTime).getTime() : 0;
            const curMs    = cur.noteTime    ? new Date(cur.noteTime).getTime()    : 0;
            return curMs > latestMs ? cur : latest;
        });

        // Collect all non-null comments across the group, dedupe by text,
        // then sort descending by noteTime
        const seen = new Set<string>();
        const comments: CommentEntry[] = group
            .filter((u) => u.chatBlockedComments)
            .map((u) => ({ comment: u.chatBlockedComments!, noteTime: u.noteTime }))
            .filter(({ comment }) => {
                if (seen.has(comment)) return false;
                seen.add(comment);
                return true;
            })
            .sort((a, b) => {
                const aMs = a.noteTime ? new Date(a.noteTime).getTime() : 0;
                const bMs = b.noteTime ? new Date(b.noteTime).getTime() : 0;
                return bMs - aMs; // descending
            });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { chatBlockedComments: _omit, ...rest } = base;
        merged.push({ ...rest, comments });
    }

    return merged;
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

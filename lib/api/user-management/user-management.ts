import apiRequest from "@/lib/api/api-request";

export type UserSearchByEmailProps = { emailAddress: string };
export type UserSearchByUserIdProps = { userId: string };

/* ✅ RAW BACKEND SHAPE */
type RawUser = {
  UserId?: string | null;
  EmailAddress?: string | null;
  ScreenName?: string | null;
  ChatAllowedFlag?: boolean | number | null;
  Blocked_Comments?: string | null;

  // ✅ IMPORTANT
  note_time?: string | null;

  CasinoId?: string | null;
  CasinoName?: string | null;
  ClassName?: string | null;
  Env?: string | null;
  EnvironmentName?: string | null;
  NickName?: string | null;
  screen_name_updatecount?: number | null;

  // ✅ FALLBACK KEYS
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

/* ✅ CLEAN UI SHAPE */
export type UserData = {
  userId: string | null;
  emailAddress: string | null;
  screenName: string | null;
  chatAllowedFlag: boolean;
  chatBlockedComments: string | null;

  // ✅ ✅ THIS FIXES YOUR ISSUE
  note_time?: string | null;

  casinoId: string | null;
  casinoName: string | null;
  className: string | null;
  env: string | null;
  environmentName: string | null;
  nickName: string | null;
  screenNameUpdateCount: number | null;
  status: string | null;

  // ✅ ADDED LATER BY HOOK
  history?: {
    comment: string;
    time: string;
  }[];
};

/* ✅ NORMALISE BACKEND → UI */
function normalise(raw: RawUser): UserData {
  const flag = raw.ChatAllowedFlag ?? raw.chatAllowedFlag;

  return {
    userId: raw.UserId ?? raw.userId ?? null,
    emailAddress: raw.EmailAddress ?? raw.emailAddress ?? null,
    screenName: raw.ScreenName ?? raw.screenName ?? null,

    chatAllowedFlag: flag === true || flag === 1,

    chatBlockedComments:
      raw.Blocked_Comments ?? raw.chatBlockedComments ?? null,

    // ✅ ✅ ✅ FINAL IMPORTANT LINE
    note_time: raw.note_time ?? null,

    casinoId: raw.CasinoId ?? raw.casinoId ?? null,
    casinoName: raw.CasinoName ?? raw.casinoName ?? null,
    className: raw.ClassName ?? raw.className ?? null,
    env: raw.Env ?? raw.env ?? null,
    environmentName:
      raw.EnvironmentName ?? raw.environmentName ?? null,
    nickName: raw.NickName ?? raw.nickName ?? null,

    screenNameUpdateCount:
      raw.screen_name_updatecount ??
      raw.screenNameUpdateCount ??
      null,

    status: raw.status ?? null,
  };
}

/* ✅ COMMON API HANDLER */
async function searchUser(
  params: Record<string, string>
): Promise<UserData[]> {
  const res = await apiRequest({
    method: "GET",
    endpoint: "user-management/search",
    params,
    requireCookie: true,
  });

  const data = res?.data;

  const rows: RawUser[] = Array.isArray(data)
    ? data
    : data
    ? [data]
    : res?.UserId || res?.userId
    ? [res]
    : [];

  return rows.map(normalise);
}

/* ✅ PUBLIC APIs */
export async function searchUserByEmail(
  p: UserSearchByEmailProps
): Promise<UserData[]> {
  return searchUser({ emailAddress: p.emailAddress });
}

export async function searchUserByUserId(
  p: UserSearchByUserIdProps
): Promise<UserData[]> {
  return searchUser({ userId: p.userId });
}
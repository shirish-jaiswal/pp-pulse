import apiRequest from "@/lib/api/api-request";

export const ONE_HOUR = 60 * 60 * 1000;

export type PlayerBetHistoryProps = {
    playerId: string;
    from: string;
    to: string;
};
export async function getPlayerBetHistory(
    params: PlayerBetHistoryProps
): Promise<any[]> {

    const res = await apiRequest({
        method: "GET",
        endpoint: "/playerbetsinfo",
        params: {
            UserId: params.playerId,
            StartTime: params.from,
            EndTime: params.to,
        },
        requireCookie: true,
    });
    return res?.data ?? [];
}
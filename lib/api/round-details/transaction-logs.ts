import apiRequest from "@/lib/api/api-request";
export type TransactionLogsProps = {
    roundId: string;
    timeStamp: string;
};

export async function c_getTransactionLogs(
  rawData: TransactionLogsProps
): Promise<any> {
  try {
    const data =rawData;
    const queryParams: Record<string, any> = {};

    if (data.roundId) {
      queryParams.roundId = data.roundId;
    }

    if (data.timeStamp) {
      queryParams.timeStamp = data.timeStamp;
    }

    console.log("Query Params :: ", queryParams);
    const response = await apiRequest({
      method: "GET",
      endpoint: "round-details/transactionlogs",
      params: queryParams,
      requireCookie: true,
    });

    return response?.data?.transactionLogs ?? [];
  } catch (error) {
    return [];
  }
}
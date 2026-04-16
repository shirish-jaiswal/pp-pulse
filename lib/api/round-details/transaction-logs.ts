import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_NEXT_URL;

export type TransactionLogsProps = {
    roundId: string;
    timeStamp: string;
};

export async function c_getTransactionLogs(rawData: TransactionLogsProps) {
    if (!BACKEND_URL) {
        throw new Error("NEXT_PUBLIC_NEXT_URL is not defined");
    }

    try {
        const response = await axios.get(
            `${BACKEND_URL}/round-details/transactionlogs`,
            {
                params: {
                    roundId: rawData.roundId,
                    timeStamp: rawData.timeStamp,
                },
            }
        );

        return response.data?.transactionLogs ?? [];
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.error ||
                "Failed to fetch transaction logs"
            );
        }

        throw new Error("Unexpected error occurred");
    }
}
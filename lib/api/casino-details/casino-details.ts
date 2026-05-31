import apiRequest from "@/lib/api/api-request";

export type CasinoDetailsProps = {
    casinoId: string;
};

export type SharedEnv = {
    env_id?: number;
    env_name?: string;
    sharded_casino_id?: string | null;
    sharded_operator_id?: string | null;
    [key: string]: any;
};

export type CasinoData = {
    casino_id: string;
    casino_desc: string;
    conf_data: string;
    extra_data_on_bet: boolean;
    extra_data_on_win: boolean;
    extra_data_on_df: boolean;
    main_env_id: number;
    main_env_name: string;
    [key: string]: any;
};


export type NormalisedCasinoData = CasinoData & {
    sharedEnvs: SharedEnv[];
    tables?: any[];
};


export async function getCasinoDetails(params: CasinoDetailsProps): Promise<NormalisedCasinoData | null> {
    const res = await apiRequest({
        method: "GET",
        endpoint: "casinodetails",
        params: { casinoid: params.casinoId },
        requireCookie: true,
    });

    if (res?.data?.casino) {
        return {
            ...res.data.casino,
            sharedEnvs: res.data.shared_envs ?? [],
        };
    }

    if (Array.isArray(res?.data) && res.data.length > 0) {
        return { ...res.data[0], sharedEnvs: [] };
    }

    if (res?.casino_id) {
        return { ...res, sharedEnvs: [] };
    }

    return null;
}

/* ✅ ✅ ✅ TABLES API (SAME PATTERN, NO CHANGE ABOVE) */

export type CasinoTable = {
    table_name: string;
    operator_game_id: string;
    table_id: string;
    casino_id: string;
    env: number;
    env_name: string;
    table_open: boolean;
    tc_conf_data?: string;
    [key: string]: any;
};

export async function getCasinoTables(params: CasinoDetailsProps): Promise<CasinoTable[]> {
    const res = await apiRequest({
        method: "GET",
        endpoint: "lc-enabled-tables",
        params: { casinoid: params.casinoId },
        requireCookie: true,
    });

    // ✅ same return handling style as your main API

    if (Array.isArray(res?.data) && res.data.length > 0) {
        return res.data;
    }

    if (res?.data?.tables) {
        return res.data.tables;
    }

    if (Array.isArray(res)) {
        return res;
    }

    return [];
}
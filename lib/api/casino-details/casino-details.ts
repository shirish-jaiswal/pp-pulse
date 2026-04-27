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
};

export async function getCasinoDetails(params: CasinoDetailsProps): Promise<NormalisedCasinoData | null> {
    const res = await apiRequest({
        method: "GET",
        endpoint: "casinodetails",
        params: { casinoid: params.casinoId },
        requireCookie: true,
    });

    // Actual API format: { success, api, data: { casino: {...}, shared_envs: [...] } }
    if (res?.data?.casino) {
        return {
            ...res.data.casino,
            sharedEnvs: res.data.shared_envs ?? [],
        };
    }

    // Array format: { data: [ { casino_id, ... } ] }
    if (Array.isArray(res?.data) && res.data.length > 0) {
        return { ...res.data[0], sharedEnvs: [] };
    }

    // Direct flat object
    if (res?.casino_id) {
        return { ...res, sharedEnvs: [] };
    }

    return null;
}

import apiRequest from "@/lib/api/api-request";

/* ───────── TYPES ───────── */

export type CasinoDetailsProps = {
  casinoId: string;
};

export type SharedEnv = {
  casino_id?: string;
  env?: number | string;
  env_id?: number;
  env_name?: string;

  // ✅ Correct keys (camelCase)
  shardedCasinoId?: number | string | null;
  shardedOperatorId?: number | string | null;

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

export type NormalisedCasinoData = CasinoData & {
  sharedEnvs: SharedEnv[];
  tables?: CasinoTable[];
};

/* ───────── ✅ FIXED NORMALIZER ───────── */

function normalizeSharedEnvs(data: any[]): SharedEnv[] {
  if (!Array.isArray(data)) return [];

  return data.map((env) => ({
    casino_id: env.casino_id,

    // ✅ env mapping
    env: env.env ?? env.env_id,
    env_id: env.env_id,
    env_name: env.env_name,

    // ✅ ✅ FINAL FIX (IMPORTANT)
    shardedCasinoId: env.shardedCasinoId,
    shardedOperatorId: env.shardedOperatorId,
  }));
}

/* ───────── CASINO DETAILS ───────── */

export async function getCasinoDetails(
  params: CasinoDetailsProps
): Promise<NormalisedCasinoData | null> {
  const res = await apiRequest({
    method: "GET",
    endpoint: "casinodetails",
    params: { casinoid: params.casinoId },
    requireCookie: true,
  });

  // ✅ Debug (optional — remove later)
  console.log("SHARED ENVS RAW:", res?.data?.shared_envs);

  if (res?.data?.casino) {
    return {
      ...res.data.casino,
      sharedEnvs: normalizeSharedEnvs(res.data.shared_envs),
    };
  }

  if (Array.isArray(res?.data) && res.data.length > 0) {
    return {
      ...res.data[0],
      sharedEnvs: [],
    };
  }

  if (res?.casino_id) {
    return {
      ...res,
      sharedEnvs: [],
    };
  }

  return null;
}

/* ───────── TABLES API ───────── */

export async function getCasinoTables(
  params: CasinoDetailsProps
): Promise<CasinoTable[]> {
  const res = await apiRequest({
    method: "GET",
    endpoint: "lc-enabled-tables",
    params: { casinoid: params.casinoId },
    requireCookie: true,
  });

  if (Array.isArray(res?.data) && res.data.length > 0) {
    return res.data;
  }

  if (Array.isArray(res?.data?.tables)) {
    return res.data.tables;
  }

  if (Array.isArray(res)) {
    return res;
  }

  return [];
}
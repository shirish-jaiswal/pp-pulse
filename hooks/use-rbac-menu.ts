"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useProfile } from "@/context/use-profile";

export type MenuItem = {
  title: string;
  url: string;
  icon: string;
  group: string;
  enabled: boolean;
};

export function useRbacMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, authReady } = useProfile();

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        // =========================
        // 🚨 GUARDS (PREVENT BAD CALLS)
        // =========================
        if (!authReady) return;

        if (!user?.role) {
          setMenu([]);
          setLoading(false);
          return;
        }

        setLoading(true);

        // =========================
        // ROLE PARSE
        // =========================
        const roles = user.role
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);

        // =========================
        // QUERY BUILD
        // =========================
        const params = new URLSearchParams();
        roles.forEach((r) => params.append("roles_like", r));

        // =========================
        // API CALL
        // =========================
        const { data } = await axios.get(
          `/portal/api/excel-db/rbac/tables/feature_list/rows?${params.toString()}`,
          {
            withCredentials: true,
          }
        );

        const rows = data?.data?.rows ?? [];

        // =========================
        // TRANSFORM MENU
        // =========================
        const formatted: MenuItem[] = rows.map((item: any) => ({
          title: item.title,
          url: item.path,
          icon: item.icon,
          group: item.group,
          enabled: item.enabled,
        }));

        if (alive) setMenu(formatted);
      } catch (err: any) {
        // =========================
        // 🔥 REAL DEBUG (NO EMPTY {})
        // =========================
        console.error("❌ RBAC menu load failed FULL:", {
          message: err?.message,
          status: err?.response?.status,
          data: err?.response?.data,
        });

        if (alive) setMenu([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [authReady, user?.role]);

  return { menu, loading };
}
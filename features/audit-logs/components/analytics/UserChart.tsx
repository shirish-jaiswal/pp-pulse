"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function UserChart({ data }: any) {

  if (!data?.length) {
    return (
      <div className="text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold mb-3">Usage by User</h2>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: 0, bottom: 20 }}
            barCategoryGap="60%"   // ✅ more spacing (important here)
          >

            {/* ✅ USER NAME */}
            <XAxis
              dataKey="user"
              tickFormatter={(val) => {
                const name = val.split("@")[0];
                return name.length > 12
                  ? name.slice(0, 12) + "..."
                  : name;
              }}
              interval={0}
            />

            {/* ✅ FIX SCALE ISSUE */}
            <YAxis
              domain={[0, Math.max(...data.map((d: any) => d.count)) * 1.2]}
              tickCount={5}
            />

            {/* ✅ TOOLTIP */}
            <Tooltip
              formatter={(value: any) => [`${value} logs`, "Count"]}
              labelFormatter={(label) => label}
            />

            {/* ✅ BALANCED COLOR + SIZE */}
            <Bar
              dataKey="count"
              barSize={25}   // ✅ thinner bars
              label={{ position: "top" }}
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? "#059669"   // ✅ strong green for top
                      : "#34d399"   // ✅ visible (not dull)
                  }
                />
              ))}
            </Bar>

          </BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}
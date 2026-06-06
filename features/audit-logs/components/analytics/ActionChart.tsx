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

export default function ActionChart({ data }: any) {

  // ✅ EMPTY STATE
  if (!data?.length) {
    return (
      <div className="text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-semibold mb-3">Actions Usage</h2>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: 0, bottom: 20 }}
            barCategoryGap="40%"
          >

            {/* ✅ LABEL CLEANUP */}
            <XAxis
              dataKey="action"
              tickFormatter={(val) => {
                const clean = val.replaceAll("_", " ");
                return clean.length > 15
                  ? clean.slice(0, 15) + "..."
                  : clean;
              }}
              interval={0}
            />

            {/* ✅ BALANCED SCALE */}
            <YAxis
              domain={[0, "auto"]}
              tickCount={5}
            />

            {/* ✅ TOOLTIP */}
            <Tooltip
              formatter={(value: any) => [`${value} logs`, "Count"]}
              labelFormatter={(label) =>
                label.replaceAll("_", " ")
              }
            />

            {/* ✅ FIXED COLORS + LABELS */}
            <Bar
              dataKey="count"
              barSize={35}
              label={{ position: "top" }}
            >
              {data.map((entry: any, index: number) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? "#1d4ed8"   // ✅ strong highlight (top)
                      : "#3b82f6"   // ✅ normal blue (NOT dull anymore)
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
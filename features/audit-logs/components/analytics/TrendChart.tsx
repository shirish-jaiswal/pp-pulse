"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart({ data }: any) {

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
      <h2 className="font-semibold mb-3">Usage Trend</h2>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{ top: 30, right: 20, left: 0, bottom: 20 }}
          >

            {/* ✅ CLEAN DATE LABEL */}
            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
              tick={{ fontSize: 12 }}
            />

            {/* ✅ BALANCED SCALE */}
            <YAxis
              domain={[0, "auto"]}
              tickCount={5}
            />

            {/* ✅ TOOLTIP IMPROVED */}
            <Tooltip
              formatter={(value: any) => [`${value} logs`, "Count"]}
            />

            {/* ✅ LINE STYLE */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ef4444"
              strokeWidth={2.5}   // ✅ thicker line
              dot={{ r: 4 }}      // ✅ bigger dots
              activeDot={{ r: 6 }} // ✅ hover effect
            />

          </LineChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
}
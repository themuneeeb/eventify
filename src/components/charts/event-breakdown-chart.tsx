"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventBreakdownChartProps {
  data: { title: string; sold: number; total: number; revenue: number }[];
}

const COLORS = ["#FF7F11", "#ACBFA4", "#262626", "#E2E8CE", "#CC6600", "#3D3D3D"];

export function EventBreakdownChart({ data }: EventBreakdownChartProps) {
  const chartData = data.slice(0, 8).map((d) => ({
    name: d.title.length > 20 ? d.title.slice(0, 20) + "…" : d.title,
    sold: d.sold,
    total: d.total,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tickets by Event</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ACBFA4" strokeOpacity={0.3} />
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ACBFA4",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sold" name="Sold" fill="#FF7F11" radius={[0, 4, 4, 0]}>
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { EquipmentWithTiming, ResourceOption } from "@/Types";
import { calculateResourceChartData } from "@/utils/ganttLogic";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ChartCard = ({
  equipment,
  resource,
}: {
  equipment: EquipmentWithTiming[];
  resource: ResourceOption;
}) => {
  const chartData = calculateResourceChartData({
    equipmentWithTiming: equipment,
    resourceId: resource.id,
  });

  if (chartData.length < 3) return <></>;

  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle>{resource.name}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                name="Time"
                tickFormatter={formatTime}
                type="number"
                domain={["auto", "auto"]}
              />
              <YAxis
                dataKey="value"
                name="Value"
                domain={[0, "auto"]}
                label={{
                  value: resource.unit,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip unit={resource.unit} />} />
              <Area
                // data={chartData}
                type="linear"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1) / 0.5)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  return `${hours}h`;
};

const CustomTooltip = ({ active, payload, unit }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 rounded shadow-md border border-border">
        <p className="text-sm font-bold">
          {data.value} {unit}
        </p>
        <p className="text-sm">{formatTime(data.time)}</p>
      </div>
    );
  }
  return null;
};

export default ChartCard;

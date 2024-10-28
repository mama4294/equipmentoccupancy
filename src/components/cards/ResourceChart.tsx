import { ArrowUp, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { EquipmentWithTiming, ResourceOption } from "@/Types";
import {
  calculateResourceChartData,
  getAverageUtilityConsumption,
  getPeakResourceConsumption,
} from "@/utils/ganttLogic";

// chartData = [
//   {
//     time: 0,
//     value: 0,
//   },
//   {
//     time: 3599,
//     value: 0,
//   },
//   {
//     time: 3600,
//     value: 1,
//   },
//   {
//     time: 7199,
//     value: 1,
//   },
//   {
//     time: 7200,
//     value: 2,
//   },
//   {
//     time: 89999,
//     value: 2,
//   },
//   {
//     time: 90000,
//     value: 22,
//   },
//   {
//     time: 90001,
//     value: 21,
//   },
//   {
//     time: 93600,
//     value: 21,
//   },
//   {
//     time: 93601,
//     value: 20,
//   },
//   {
//     time: 98999,
//     value: 20,
//   },
//   {
//     time: 99000,
//     value: 21,
//   },
//   {
//     time: 100800,
//     value: 21,
//   },
//   {
//     time: 100801,
//     value: 1,
//   },
//   {
//     time: 102599,
//     value: 1,
//   },
//   {
//     time: 102600,
//     value: 2,
//   },
//   {
//     time: 185399,
//     value: 2,
//   },
//   {
//     time: 185400,
//     value: 22,
//   },
//   {
//     time: 185401,
//     value: 21,
//   },
//   {
//     time: 189000,
//     value: 21,
//   },
//   {
//     time: 189001,
//     value: 20,
//   },
//   {
//     time: 196200,
//     value: 20,
//   },
//   {
//     time: 196201,
//     value: 0,
//   },
//   {
//     time: 196200,
//     value: 0,
//   },
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

  console.log(chartData);

  const peakConsumption = getPeakResourceConsumption(chartData);
  const averageConsumption = getAverageUtilityConsumption(chartData);

  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle>{resource.name}</CardTitle>
        <CardDescription>Resource Usage Over Time</CardDescription>
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
              <ReferenceLine
                y={peakConsumption}
                stroke="hsl(var(--chart-2))"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={averageConsumption}
                stroke="hsl(var(--chart-3))"
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ArrowUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Peak: {peakConsumption.toLocaleString()} {resource.unit}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            Avg: {averageConsumption.toLocaleString()} {resource.unit}
          </span>
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

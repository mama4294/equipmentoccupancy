import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  ScatterChart,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  Area,
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

  console.log(chartData);

  const description = "A multiple line chart";

  return (
    <Card className="w-full col-span-2">
      <CardHeader>
        <CardTitle>{resource.name}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[400px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                name="Time"
                tickFormatter={formatTime}
                type="number"
                domain={["auto", "auto"]}
              />
              <YAxis dataKey="value" name="Value" domain={[0, "auto"]} />
              <Tooltip content={<CustomTooltip unit={resource.unit} />} />
              <Area
                dataKey="value"
                data={chartData}
                activeDot={false}
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
              />
              <Scatter
                data={chartData}
                fill="hsl(var(--primary))"
                line={{ stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                lineType="joint"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer> */}
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

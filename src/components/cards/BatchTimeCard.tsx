import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ProcessDetails } from "@/Types";
import { formatDuration, convertSecondsToUnit, BatchDisplayUnit } from "@/utils/time";
import { Clock } from "lucide-react";

const BatchTimeCard = ({ details }: { details: ProcessDetails }) => {
  const { batchDuration, cycleTime, batchQty } = details;

  const batchTiming = formatDuration(batchDuration);

  // the card allows manual unit override – hours, days or weeks – defaulting to
  // whatever formatDuration would choose (hr if the auto unit is anything
  // smaller than a day).
  const initialUnit: BatchDisplayUnit =
    batchTiming.unit === "day" || batchTiming.unit === "week"
      ? (batchTiming.unit as BatchDisplayUnit)
      : "hr";
  const [batchDisplayUnit, setBatchDisplayUnit] = useState<BatchDisplayUnit>(initialUnit);
  const [cycleDisplayUnit, setCycleDisplayUnit] = useState<BatchDisplayUnit>(initialUnit);

  const batchDisplay = convertSecondsToUnit(batchDuration, batchDisplayUnit);
  const cycleDisplay = convertSecondsToUnit(cycleTime, cycleDisplayUnit);

  return (
    <Card className="max-w-md overflow-hidden transition-all hover:shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Timing</CardTitle>
          <div className="flex items-center gap-2">
            <Clock />
          </div>
        </div>
        {/* <CardDescription>Cycle time details</CardDescription> */}
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium ">
              Batch Time
            </span>
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {batchDisplay.value}
              <Select
                value={batchDisplayUnit}
                onValueChange={(val: string) => setBatchDisplayUnit(val as BatchDisplayUnit)}
              >
                <SelectTrigger className="border-0 bg-transparent h-full p-0 w-auto text-sm font-normal cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hr">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <p>How long it takes to start and finish a single batch</p> */}
        </div>
        {batchQty > 1 && (
          <div className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium ">Cycle Time</span>
              <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                {cycleDisplay.value}
                <Select
                  value={cycleDisplayUnit}
                  onValueChange={(val: string) => setCycleDisplayUnit(val as BatchDisplayUnit)}
                >
                  <SelectTrigger className="border-0 bg-transparent h-full p-0 w-auto text-sm font-normal cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <p>How long it takes to start and finish a single batch</p> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BatchTimeCard;

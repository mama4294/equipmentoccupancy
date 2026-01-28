import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessDetails } from "@/Types";
import { formatDuration } from "@/utils/time";
import { Clock } from "lucide-react";

const BatchTimeCard = ({ details }: { details: ProcessDetails }) => {
  const { batchDuration, cycleTime, batchQty } = details;

  const batchTiming = formatDuration(batchDuration);
  const cycleTiming = formatDuration(cycleTime);

  return (
    <Card className="max-w-md overflow-hidden transition-all hover:shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Timing</CardTitle>
          <Clock />
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
              {batchTiming.value}
              <span className="text-sm font-normal">{batchTiming.unit}</span>
            </div>
          </div>
          {/* <p>How long it takes to start and finish a single batch</p> */}
        </div>
        {batchQty > 1 && (
          <div className="mb-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium ">Cycle Time</span>
              <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                {cycleTiming.value}
                <span className="text-sm font-normal">{cycleTiming.unit}</span>
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProcessDetails } from "@/Types";
import { formatDuration } from "@/utils/time";
import { Progress } from "./ui/progress";
import { Clock } from "lucide-react";

const BatchTimeCard = ({ details }: { details: ProcessDetails }) => {
  const { batchDuration, bottleneck } = details;

  const batchTiming = formatDuration(batchDuration);
  const staggerTime = formatDuration(bottleneck.duration);

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
              Single batch cycle time
            </span>
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {batchTiming.value}
              <span className="text-sm font-normal">{batchTiming.unit}</span>
            </div>
          </div>
          {/* <p>How long it takes to start and finish a single batch</p> */}
        </div>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium ">New batch every</span>
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {staggerTime.value}
              <span className="text-sm font-normal">{staggerTime.unit}</span>
            </div>
          </div>
          {/* <p>How long it takes to start and finish a single batch</p> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchTimeCard;

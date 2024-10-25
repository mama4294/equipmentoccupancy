import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProcessDetails } from "@/Types";
import { formatDuration } from "@/utils/time";
import { Progress } from "../ui/progress";
import { Milk } from "lucide-react";

const BottleneckCard = ({ details }: { details: ProcessDetails }) => {
  const { bottleneck, batchDuration } = details;
  if (!bottleneck) return null;

  const duration = formatDuration(bottleneck.duration);
  // Error handling: Set placeholder values if bottleneck or duration is undefined or null
  const name = bottleneck?.name ?? "Unknown";
  const value = duration?.value ?? 0;
  const unit = duration?.unit ?? "min";
  const progressValue = (bottleneck.duration / batchDuration) * 100;

  return (
    <Card className="max-w-md overflow-hidden transition-all hover:shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Bottleneck</CardTitle>
          <Milk />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium ">{name}</span>
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            {value}
            <span className="text-sm font-normal">{unit}</span>
          </div>
        </div>
        <Progress value={progressValue} className="h-2 mt-2" />
      </CardContent>
    </Card>
  );
};

export default BottleneckCard;

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
import { ChartNoAxesGantt } from "lucide-react";

const CampaignCard = ({ details }: { details: ProcessDetails }) => {
  const { batchQty, campaignDuration } = details;
  const campaignTiming = formatDuration(campaignDuration);

  return (
    <Card className="max-w-md overflow-hidden transition-all hover:shadow-lg col-span-1">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Campaign</CardTitle>
          <ChartNoAxesGantt />
        </div>
        {/* <CardDescription>Multiple batches in a campaign</CardDescription> */}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium ">Number of batches</span>
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            {batchQty}
            {/* <span className="text-sm font-normal">{unit}</span> */}
          </div>
        </div>
        <div className="mb-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium ">Campaign duration</span>
            <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
              {campaignTiming.value}
              <span className="text-sm font-normal">{campaignTiming.unit}</span>
            </div>
          </div>
        </div>
        {/* <Progress value={progressValue} className="h-2 mt-2" /> */}
      </CardContent>
    </Card>
  );
};

export default CampaignCard;

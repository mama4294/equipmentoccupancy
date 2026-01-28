import { useMemo } from "react";
import Header from "./Header";
import EquipmentOccupancyChart from "./EquipmentOccupancyChart";
import { useStore } from "../Store";
import { calculateProcessDetails, calculateTiming } from "../utils/ganttLogic";
import { useToast } from "../hooks/use-toast";
import { EquipmentWithTiming, ResourceOption } from "@/Types";
import BottleneckCard from "./cards/BottleneckCard";
import BatchTimeCard from "./cards/BatchTimeCard";
import CampaignCard from "./cards/CampaignCard";
import ResourcesCard from "./cards/ResourcesCard";
import ChartCard from "./cards/ResourceChart";

function Dashboard() {
  const { equipment, campaign, resourceOptions } = useStore();
  const { toast } = useToast();

  const calculatedEquipment = useMemo<EquipmentWithTiming[]>(() => {
    try {
      return calculateTiming(equipment, campaign) as EquipmentWithTiming[];
    } catch (err) {
      console.error("Error in calculateTiming:", err);
      toast({
        title: "Scheduling Failed",
        description:
          err instanceof Error
            ? err.message
            : "An error occurred when determining the schedule",
        variant: "destructive",
      });
      return [];
    }
  }, [equipment, campaign, toast]);

  const processDetails = calculateProcessDetails(calculatedEquipment);

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div
            className="relative flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="w-full grid grid-cols-4 gap-4">
              {equipment.length > 0 && (
                <>
                  <BatchTimeCard details={processDetails} />
                  <BottleneckCard details={processDetails} />
                  <CampaignCard details={processDetails} />
                  <ResourcesCard />
                </>
              )}
              <EquipmentOccupancyChart
                equipmentWithTiming={calculatedEquipment}
              />

              {equipment.length > 0 &&
                resourceOptions.map((option: ResourceOption) => (
                  <ChartCard
                    resource={option}
                    equipment={calculatedEquipment}
                  />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

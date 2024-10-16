import { useEffect, useMemo } from "react";
import Header from "./Header";
import EquipmentOccupancyChart from "./EquipmentOccupancyChart";
import { useStore } from "../Store";
import { calculateProcessDetails, calculateTiming } from "../utils/ganttLogic";
import { useToast } from "../hooks/use-toast";
import { EquipmentWithTiming } from "@/Types";
import BottleneckCard from "./BottleneckCard";

function Dashboard() {
  const { equipment, campaign } = useStore();
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
      return equipment as EquipmentWithTiming[];
    }
  }, [equipment, campaign]);

  const processDetails = calculateProcessDetails(calculatedEquipment);

  console.log("process deatils");
  console.table(processDetails);

  // useEffect(() => {
  //   console.table(calculatedEquipment.flatMap((p) => p.operations));
  // }, [calculatedEquipment]);

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="w-full grid grid-cols-4 gap-4">
              <EquipmentOccupancyChart
                equipmentWithTiming={calculatedEquipment}
              />
              <BottleneckCard details={processDetails} />
              {/* <div className="col-span-2" /> Empty space */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

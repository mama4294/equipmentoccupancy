import { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import EquipmentOccupancyChart from "./EquipmentOccupancyChart";
import { useStore } from "./Store";
import { calculateTiming } from "./utils/ganttLogic";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "./hooks/use-toast";

function Dashboard() {
  const { equipment } = useStore();
  const { toast } = useToast();

  const calculatedEquipment = useMemo(() => {
    try {
      return calculateTiming(equipment);
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
      return equipment; // Return original equipment as fallback
    }
  }, [equipment]);

  // Move this to a useEffect if you want to log after each render
  useEffect(() => {
    console.table(equipment.flatMap((p) => p.operations));
  }, [equipment]);

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div className="w-full">
              <EquipmentOccupancyChart
                calculatedEquipment={calculatedEquipment}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

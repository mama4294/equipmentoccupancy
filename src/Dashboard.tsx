import React, { useEffect, useMemo } from "react";
import Header from "./Header";
import EquipmentOccupancyChart from "./EquipmentOccupancyChart";
import { useStore } from "./Store";
import { calculateTiming } from "./utils/ganttLogic";

function Dashboard() {
  const { equipment } = useStore();

  const calculatedEquipment = useMemo(
    () => calculateTiming(equipment),
    [equipment]
  );

  // Move this to a useEffect if you want to log after each render
  // useEffect(() => {
  //   console.table(equipment.flatMap((p) => p.operations));
  // }, [equipment]);

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

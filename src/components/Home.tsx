import { useMemo, useState } from "react";
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
import BlockFlowDiagram from "./BlockFlowDiagram";
import { GitBranch } from "lucide-react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import Schedule from "./Schedule";

type Screens = "bfd" | "dashboard";

function HomePage() {
  // const { equipment, campaign, resourceOptions } = useStore();
  const [activeScreen, setActiveScreen] = useState<Screens>("bfd");
  const { toast } = useToast();

  // const calculatedEquipment = useMemo<EquipmentWithTiming[]>(() => {
  //   try {
  //     return calculateTiming(equipment, campaign) as EquipmentWithTiming[];
  //   } catch (err) {
  //     console.error("Error in calculateTiming:", err);
  //     toast({
  //       title: "Scheduling Failed",
  //       description:
  //         err instanceof Error
  //           ? err.message
  //           : "An error occurred when determining the schedule",
  //       variant: "destructive",
  //     });
  //     return equipment as EquipmentWithTiming[];
  //   }
  // }, [equipment, campaign]);

  // const processDetails = calculateProcessDetails(calculatedEquipment);

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex h-full">
          <Sidebar
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
          />
          <main className="flex-1 p-4 h-full">
            {activeScreen === "bfd" ? <BlockFlowDiagram /> : <Schedule />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

const Sidebar = ({
  activeScreen,
  setActiveScreen,
}: {
  activeScreen: Screens;
  setActiveScreen: (screen: Screens) => void;
}) => {
  return (
    <nav className="w-16 flex flex-col items-center py-4 space-y-4 h-full border-r">
      <Button
        variant={activeScreen === "bfd" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveScreen("bfd")}
      >
        <GitBranch className="h-6 w-6" />
      </Button>
      <Button
        variant={activeScreen === "dashboard" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveScreen("dashboard")}
      >
        <LayoutDashboard className="h-6 w-6" />
      </Button>
    </nav>
  );
};

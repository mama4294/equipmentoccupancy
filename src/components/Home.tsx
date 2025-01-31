import { useState } from "react";
import Header from "./Header";
import { useToast } from "../hooks/use-toast";
import BlockFlowDiagram from "./BlockFlowDiagram";
import { GitBranch } from "lucide-react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import Schedule from "./Schedule";

type Screens = "bfd" | "dashboard";

function HomePage() {
  const [activeScreen, setActiveScreen] = useState<Screens>("bfd");

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

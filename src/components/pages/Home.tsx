import { useState } from "react";
import Header from "../Header";
import BlockFlowDiagram from "./BlockFlowDiagram";
import { FlaskConical, GitBranch } from "lucide-react";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";
import Schedule from "./Schedule";
import Components from "./Components";

type Screens = "block flow" | "schedule" | "components";

function HomePage() {
  const [activeScreen, setActiveScreen] = useState<Screens>("block flow");

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
            {activeScreen === "block flow" && <BlockFlowDiagram />}
            {activeScreen === "schedule" && <Schedule />}
            {activeScreen === "components" && <Components />}
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
        variant={activeScreen === "block flow" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveScreen("block flow")}
      >
        <GitBranch className="h-6 w-6" />
      </Button>
      <Button
        variant={activeScreen === "schedule" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveScreen("schedule")}
      >
        <LayoutDashboard className="h-6 w-6" />
      </Button>
      <Button
        variant={activeScreen === "components" ? "default" : "ghost"}
        size="icon"
        onClick={() => setActiveScreen("components")}
      >
        <FlaskConical className="h-6 w-6" />
      </Button>
    </nav>
  );
};

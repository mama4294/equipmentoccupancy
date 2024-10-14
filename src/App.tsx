import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <TooltipProvider>
      <Dashboard />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

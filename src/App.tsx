import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eoc-theme">
      <TooltipProvider>
        <Dashboard />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;

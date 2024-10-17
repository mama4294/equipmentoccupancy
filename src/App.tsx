import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Dashboard from "./components/Dashboard";
import { DarkModeProvider } from "./components/themes/DarkMode/DarkModeProvider";
import { ColorThemeProvider } from "./components/themes/ColorTheme/ColorThemeProvider";

function App() {
  return (
    <DarkModeProvider defaultTheme="light" storageKey="eoc-theme">
      <ColorThemeProvider defaultTheme="slate" storageKey="eoc-theme">
        <TooltipProvider>
          <Dashboard />
          <Toaster />
        </TooltipProvider>
      </ColorThemeProvider>
    </DarkModeProvider>
  );
}

export default App;

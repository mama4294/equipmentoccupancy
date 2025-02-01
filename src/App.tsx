import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { DarkModeProvider } from "./components/themes/DarkMode/DarkModeProvider";
import { ColorThemeProvider } from "./components/themes/ColorTheme/ColorThemeProvider";
import Home from "./components/Home";

function App() {
  return (
    <DarkModeProvider defaultTheme="light" storageKey="eoc-theme">
      <ColorThemeProvider defaultTheme="slate" storageKey="eoc-theme">
        <TooltipProvider>
          <Home />
          <Toaster />
        </TooltipProvider>
      </ColorThemeProvider>
    </DarkModeProvider>
  );
}

export default App;

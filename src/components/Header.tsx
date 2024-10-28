import React from "react";
import { Button } from "./ui/button";
import { FilePlus, FolderOpen, Menu, Save } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "../Store";
import ThemeToggle from "./themes/DarkMode/ThemeToggle";
import { ThemeSelector } from "./themes/ColorTheme/ThemeSelector";

function Header() {
  const { toast } = useToast();
  const { saveState, saveAsState, loadState, resetState } = useStore();
  const projectTitle = useStore((state) => state.projectTitle);
  const updateProjectTitle = useStore((state) => state.updateProjectTitle);

  const handleSave = async (type: "save" | "saveAs") => {
    try {
      toast({
        title: "Saving...",
        description: "Your project is being saved.",
      });
      if (type === "save") {
        await saveState();
      } else {
        await saveAsState();
      }
      toast({
        title: "Success",
        description: "Your project was saved",
      });
    } catch (error) {
      console.error("Error saving file:", error);
      toast({
        title: "Error",
        description: "There was an error saving your project",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div className="border-b p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <Button variant={"outline"}>
              <Menu className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={resetState}>
              {" "}
              <FilePlus className="size-5 mr-2" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={loadState}>
              <FolderOpen className="size-5 mr-2" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSave("save")}>
              <Save className="size-5 mr-2" />
              Save
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSave("saveAs")}>
              {" "}
              <Save className="size-5 mr-2" />
              Save As
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Input
        type="text"
        className="text-xl font-semibold border-none"
        value={projectTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateProjectTitle(e.target.value)
        }
      />
      <ThemeSelector />
      <ThemeToggle />
      <Button
        variant="outline"
        size="sm"
        className="ml-auto gap-1.5 text-sm"
        onClick={() => handleSave("save")}
      >
        <Save className="size-3.5" />
        Save
      </Button>
    </header>
  );
}

export default Header;

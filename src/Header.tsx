import React, { useContext } from "react";
import { Button } from "./components/ui/button";
import { FilePlus, FolderOpen, Menu, Save } from "lucide-react";
import { TitleContext } from "./contexts/titleContext";
import { Input } from "./components/ui/input";
import { useToast } from "./hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Data } from "./Types";
// import { loadFromJSON, saveAsJSON } from "./utils/fileSystem";
import { useStore } from "./Store";

function Header() {
  const { toast } = useToast();
  const { saveState, loadState } = useStore();
  const projectTitle = useStore((state) => state.projectTitle);
  const updateProjectTitle = useStore((state) => state.updateProjectTitle);

  const handleSave = () => {
    saveState();
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadState(file);
      toast({
        title: "Success",
        description: "Data loaded successfully",
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div className="border-b p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-background">
            {" "}
            <Menu className="size-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              {" "}
              <FilePlus className="size-5 mr-2" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen className="size-5 mr-2" />
              <input
                type="file"
                onChange={handleLoad}
                accept=".json"
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Save className="size-5 mr-2" />
              Save
            </DropdownMenuItem>
            <DropdownMenuItem>
              {" "}
              <Save className="size-5 mr-2" />
              Save As
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Button variant="outline" size="default" aria-label="Home"></Button> */}
      </div>
      <Input
        type="text"
        className="text-xl font-semibold border-none"
        value={projectTitle}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          updateProjectTitle(e.target.value)
        }
      />

      <Button
        variant="outline"
        size="sm"
        className="ml-auto gap-1.5 text-sm"
        onClick={handleSave}
      >
        <Save className="size-3.5" />
        Save
      </Button>
    </header>
  );
}

export default Header;

import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis, Pencil, Plus, Trash, Zap } from "lucide-react";
import { useStore } from "@/Store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { ResourceOption } from "@/Types";
import { Label } from "./ui/label";
import { PopoverClose } from "@radix-ui/react-popover";

const ResourcesCard = () => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedResource, setSelectedResource] =
    useState<ResourceOption | null>(null);

  const {
    resourceOptions,
    addResourceOption,
    updateResourceOption,
    deleteResourceOption,
  } = useStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="max-w-md overflow-hidden transition-all hover:shadow-lg col-span-1">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">Resources</CardTitle>
              <Zap />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm font-medium ">Tracked Resources</span>
              <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                {resourceOptions.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Resources</SheetTitle>
          <SheetDescription>
            Resources that are tracked during the process
          </SheetDescription>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resourceOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.name}</TableCell>
                  <TableCell>{option.unit}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" className="w-12 p-2">
                          <Ellipsis size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <ResourcePopover
                            resource={option}
                            onSubmit={(option: ResourceOption) =>
                              updateResourceOption(option)
                            }
                          />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedResource(option);
                            setDeleteConfirmationOpen(true);
                          }}
                        >
                          <Trash size={18} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ResourcePopover
            resource={null}
            onSubmit={(option: ResourceOption) => addResourceOption(option)}
          />
          <ResourcePopover
            resource={null}
            onSubmit={(option: ResourceOption) => addResourceOption(option)}
          />
          <DeleteConfirmation
            open={deleteConfirmationOpen}
            setOpen={setDeleteConfirmationOpen}
            onSubmit={() => {
              if (selectedResource) {
                deleteResourceOption(selectedResource);
              }
            }}
          />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ResourcesCard;

const ResourcePopover = ({
  resource,
  onSubmit,
}: {
  resource: ResourceOption | null;
  onSubmit: (resource: ResourceOption) => void;
}) => {
  const initialData: ResourceOption = {
    id: uuidv4(),
    name: "",
    unit: "",
  };

  const [resourceOption, setResourceOption] = useState<ResourceOption>(
    resource || initialData
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(resourceOption);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Resource
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Resource</Label>
            <Input
              id="name"
              value={resourceOption.name}
              onChange={(e) =>
                setResourceOption((prev: ResourceOption) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={resourceOption.unit}
              onChange={(e) =>
                setResourceOption((prev: ResourceOption) => ({
                  ...prev,
                  unit: e.target.value,
                }))
              }
              placeholder="Unit"
            />
          </div>
          <PopoverClose className="flex justify-between w-full">
            <Button type="submit" className="w-full">
              Save
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  );
};

const DeleteConfirmation = ({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this
            resource and remove it from all associated equipment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
            <Button onClick={onSubmit}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

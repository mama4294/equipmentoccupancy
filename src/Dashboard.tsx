import { Label } from "./components/ui/label";
import Header from "./Header";
import EditProcedure from "./EditProcedure";
import { useStore } from "./Store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { DrawerTrigger } from "./components/ui/drawer";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { Procedure } from "./Types";

function Dashboard() {
  const { procedures } = useStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state for the drawer
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure>();

  return (
    <div className="h-screen w-screen ">
      <div className="flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-4">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex"
            x-chunk="dashboard-03-chunk-0"
          >
            <div>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Equipment Occupancy
                </legend>

                <div className="grid gap-3">
                  <Label htmlFor="model">Model</Label>
                </div>
                <EditProcedure
                  procedureToEdit={selectedProcedure}
                  isOpen={isDrawerOpen}
                  setIsOpen={setIsDrawerOpen}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Equipment</CardTitle>
                    <CardDescription>Equipment in the process</CardDescription>
                    <CardContent className="flex gap-3">
                      {procedures.map((procedure) => (
                        <Badge
                          key={procedure.id}
                          onClick={() => {
                            setSelectedProcedure(procedure);
                            setIsDrawerOpen(true);
                          }}
                        >
                          {procedure.name}
                        </Badge>
                      ))}
                    </CardContent>
                  </CardHeader>
                </Card>
              </fieldset>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

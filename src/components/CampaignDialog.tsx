import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import {
  ChartNoAxesGantt,
  Minus,
  Plus,
  PlusCircle,
  Settings,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { useStore } from "../Store";
import {
  MAX_BATCHES_PER_CAMPAIGN,
  MIN_BATCHES_PER_CAMPAIGN,
} from "@/utils/constants";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { CampaignSchedulingType, DurationUnit } from "@/Types";

export default function CampaignDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    campaign,
    updateCampaignQuantity,
    updateCampaignSchedulingType,
    updateCampaignFrequency,
    updateCampaignFrequencyUnit,
  } = useStore();

  const handleQuantityChange = (quantity: number) => {
    console.log("updating quantity to: ", quantity);
    updateCampaignQuantity(quantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <ChartNoAxesGantt className="mr-2 h-4 w-4" />
          Campaign
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Campaign</SheetTitle>
          <SheetDescription>
            Add multiple batches to create a campaign
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity of Batches</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(campaign.quantity - 1)}
                disabled={campaign.quantity <= MIN_BATCHES_PER_CAMPAIGN}
              >
                <Minus />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={campaign.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-full text-center"
                min={MIN_BATCHES_PER_CAMPAIGN}
                max={MAX_BATCHES_PER_CAMPAIGN}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(campaign.quantity + 1)}
                disabled={campaign.quantity >= MAX_BATCHES_PER_CAMPAIGN}
              >
                <Plus />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Scheduling Mode</Label>
            <RadioGroup
              value={campaign.schedulingType}
              onValueChange={(value: CampaignSchedulingType) =>
                updateCampaignSchedulingType(value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="optimized" id="optimized" />
                <Label htmlFor="optimized">Optimized</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">Fixed</Label>
              </div>
            </RadioGroup>
          </div>

          {campaign.schedulingType === "fixed" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Batch Frequency</Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <Input
                      id="frequency"
                      type="number"
                      value={campaign.frequency}
                      onChange={(e) =>
                        updateCampaignFrequency(parseInt(e.target.value))
                      }
                      min={1}
                      className="pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Select
                        value={campaign.frequencyUnit}
                        onValueChange={(value: DurationUnit) =>
                          updateCampaignFrequencyUnit(value)
                        }
                      >
                        <SelectTrigger className="border-0 bg-transparent h-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="hr">Hour</SelectItem>
                          <SelectItem value="min">Minute</SelectItem>
                          <SelectItem value="sec">Second</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

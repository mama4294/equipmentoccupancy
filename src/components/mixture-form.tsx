"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetClose } from "@/components/ui/sheet";
import { ComponentProperties, Mixture } from "@/Types";

interface MixtureFormProps {
  mixture: Mixture | null;
  components: ComponentProperties[];
  onSave: (mixture: Mixture) => void;
  onCancel: () => void;
}

export default function MixtureForm({
  mixture,
  components,
  onSave,
  onCancel,
}: MixtureFormProps) {
  const [formData, setFormData] = useState<Mixture>({
    id: "",
    name: "",
    components: [],
  });

  useEffect(() => {
    if (mixture) {
      setFormData(mixture);
    } else {
      setFormData({
        id: "",
        name: "",
        components: [],
      });
    }
  }, [mixture]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleComponentChange = (
    index: number,
    field: "componentId" | "proportion",
    value: string
  ) => {
    const updatedComponents = [...formData.components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      [field]: field === "proportion" ? Number.parseFloat(value) : value,
    };
    setFormData({ ...formData, components: updatedComponents });
  };

  const addComponent = () => {
    setFormData({
      ...formData,
      components: [...formData.components, { componentId: "", proportion: 0 }],
    });
  };

  const removeComponent = (index: number) => {
    const updatedComponents = formData.components.filter((_, i) => i !== index);
    setFormData({ ...formData, components: updatedComponents });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="name">Mixture Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      {formData.components.map((component, index) => (
        <div key={index} className="flex space-x-2">
          <Select
            value={component.componentId}
            onValueChange={(value) =>
              handleComponentChange(index, "componentId", value)
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent>
              {components.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={component.proportion}
            onChange={(e) =>
              handleComponentChange(index, "proportion", e.target.value)
            }
            placeholder="Proportion"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => removeComponent(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addComponent}>
        Add Component
      </Button>
      <div className="flex space-x-2">
        <SheetClose asChild>
          <Button type="submit">{mixture ? "Update" : "Create"}</Button>
        </SheetClose>
        <SheetClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </SheetClose>
      </div>
    </form>
  );
}

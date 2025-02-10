import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetClose } from "@/components/ui/sheet";
import { ComponentProperties } from "@/Types";

interface ComponentFormProps {
  component: ComponentProperties | null;
  onSave: (component: ComponentProperties) => void;
  onCancel: () => void;
}

export default function ComponentForm({
  component,
  onSave,
  onCancel,
}: ComponentFormProps) {
  const [formData, setFormData] = useState<ComponentProperties>({
    id: "",
    name: "",
    molecularFormula: "",
    molecularWeight: 0,
    density: undefined,
    specificVolume: undefined,
    heatCapacity: 0,
  });

  useEffect(() => {
    if (component) {
      setFormData(component);
    } else {
      setFormData({
        id: "",
        name: "",
        molecularFormula: "",
        molecularWeight: 0,
        density: undefined,
        specificVolume: undefined,
        heatCapacity: 0,
      });
    }
  }, [component]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "name" || name === "molecularFormula"
          ? value
          : Number.parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="molecularFormula">Molecular Formula</Label>
        <Input
          id="molecularFormula"
          name="molecularFormula"
          value={formData.molecularFormula}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="molecularWeight">Molecular Weight (g/mol)</Label>
        <Input
          id="molecularWeight"
          name="molecularWeight"
          type="number"
          value={formData.molecularWeight}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="density">Density (kg/m³)</Label>
        <Input
          id="density"
          name="density"
          type="number"
          value={formData.density || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="specificVolume">Specific Volume (m³/kg)</Label>
        <Input
          id="specificVolume"
          name="specificVolume"
          type="number"
          value={formData.specificVolume || ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="heatCapacity">Heat Capacity (kJ/kg/K)</Label>
        <Input
          id="heatCapacity"
          name="heatCapacity"
          type="number"
          value={formData.heatCapacity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex space-x-2">
        <SheetClose asChild>
          <Button type="submit">{component ? "Update" : "Create"}</Button>
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

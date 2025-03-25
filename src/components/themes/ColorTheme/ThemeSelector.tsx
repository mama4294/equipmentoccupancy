import { colorOptions, ColorTheme, useColorTheme } from "./ColorThemeProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { theme, setTheme } = useColorTheme();

  const currentColor =
    colorOptions.find((color) => color.value === theme) || colorOptions[0];

  return (
    <Select onValueChange={(value: ColorTheme) => setTheme(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentColor.name} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Themes</SelectLabel>
          {colorOptions.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: color.hex }}
                  className="w-4 h-4 rounded-full"
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

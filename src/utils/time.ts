import { DurationUnit } from "../Types";

export function formatDuration(seconds: number): {
  value: number;
  unit: DurationUnit;
} {
  if (seconds >= 86400) {
    // 24 hours in seconds
    return { value: Math.round((seconds / 86400) * 100) / 100, unit: "day" };
  } else if (seconds >= 3600) {
    // 1 hour in seconds
    return { value: Math.round((seconds / 3600) * 100) / 100, unit: "hr" };
  } else if (seconds >= 60) {
    // 1 minute in seconds
    return { value: Math.round((seconds / 60) * 100) / 100, unit: "min" };
  } else {
    return { value: seconds, unit: "sec" };
  }
}

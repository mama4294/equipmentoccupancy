import { DurationUnit } from "../Types";

export function formatDuration(seconds: number): {
  value: number;
  unit: DurationUnit;
} {
  // prefer the largest reasonable unit when auto-formatting.  we now support
  // weeks as well (7 days) so long campaigns/batches will render accordingly.
  if (seconds >= 604800) {
    // 7 days in seconds
    return { value: Math.round((seconds / 604800) * 100) / 100, unit: "week" };
  } else if (seconds >= 86400) {
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

// helper used by BatchTimeCard to respect a manually chosen display unit.  It is
// intentionally narrower than DurationUnit because the card only allows hours,
// days or weeks.
export type BatchDisplayUnit = "hr" | "day" | "week";

export function convertSecondsToUnit(
  seconds: number,
  unit: BatchDisplayUnit
): { value: number; unit: string } {
  switch (unit) {
    case "week":
      return { value: Math.round((seconds / 604800) * 100) / 100, unit: "wk" };
    case "day":
      return { value: Math.round((seconds / 86400) * 100) / 100, unit: "day" };
    case "hr":
    default:
      return { value: Math.round((seconds / 3600) * 100) / 100, unit: "hr" };
  }
}

import { DurationUnit, Operation, Equipment } from "../Types";

export const calculateTiming = (equipment: Equipment[]): Equipment[] => {
  // Create a deep copy of the equipment array
  const equipmentCopy = JSON.parse(JSON.stringify(equipment));

  // Create a map to store all operations with initial start and end times
  const operationsMap = new Map<string, Operation>();

  // Populate the map with all operations from all equipment and initialize start and end times to 0
  equipment.forEach((eq: Equipment) => {
    eq.operations = eq.operations.map((operation) => ({
      ...operation,
      start: 0,
      end: 0,
    }));
    eq.operations.forEach((operation: Operation) => {
      operationsMap.set(operation.id, operation);
    });
  });

  // Recursive function to calculate timing for a single operation
  const calculateOperationTiming = (operation: Operation): void => {
    // If timing is already calculated, return
    if (operation.start !== 0 && operation.end !== 0) return;

    // Get predecessor operation if it exists
    const predecessor = operation.predecessor
      ? operationsMap.get(operation.predecessor.id)
      : null;
    // Recursively calculate timing for predecessor
    if (predecessor) {
      calculateOperationTiming(predecessor);
    }

    // Convert offset and duration to seconds
    const offset = convertToSeconds(operation.offset, operation.offsetUnit);
    const duration = convertToSeconds(
      operation.duration,
      operation.durationUnit
    );

    // Calculate start and end times based on predecessor relation
    let start, end;
    if (!predecessor || predecessor.id === "initial") {
      // If no predecessor, start after offset
      start = offset;
      end = offset + duration;
    } else {
      // Calculate start time based on predecessor relation
      switch (operation.predecessorRelation) {
        case "finish-to-start":
          start = predecessor.end + offset;
          break;
        case "start-to-start":
          start = predecessor.start + offset;
          break;
        case "finish-to-finish":
          start = predecessor.end - duration + offset;
          break;
        case "start-to-finish":
          start = predecessor.start - duration + offset;
          break;
      }
      end = start + duration;
    }

    // Update the operation in the map with a new object
    operationsMap.set(operation.id, { ...operation, start, end });
  };

  // Calculate timing for all operations in all equipment
  equipmentCopy.forEach((eq: Equipment) => {
    eq.operations.forEach(calculateOperationTiming);
  });

  // Return updated equipment with calculated timings
  return equipmentCopy.map((eq: Equipment) => ({
    ...eq,
    operations: eq.operations.map((op: Operation) => operationsMap.get(op.id)!),
  }));
};

const convertToSeconds = (value: number, unit: DurationUnit): number => {
  switch (unit) {
    case "day":
      return value * 24 * 60 * 60;
    case "hr":
      return value * 60 * 60;
    case "min":
      return value * 60;
    case "sec":
      return value;
  }
};

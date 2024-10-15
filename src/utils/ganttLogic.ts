import {
  DurationUnit,
  Operation,
  Equipment,
  Campaign,
  EquipmentWithTiming,
} from "../Types";

export const calculateTiming = (
  equipment: Equipment[],
  campaign: Campaign
): EquipmentWithTiming[] => {
  /////// FIRST CALCULATE TIMING FOR A SINGLE BATCH//////

  // Create a deep copy of the equipment array and add start and end to each operation
  let singleBatch: EquipmentWithTiming[] = JSON.parse(
    JSON.stringify(equipment)
  ).map((eq: Equipment) => ({
    ...eq,
    operations: eq.operations.map((operation: Operation) => ({
      ...operation,
      start: 0,
      end: 0,
    })),
  }));

  // Create a map to store all operations with initial start and end times
  const operationsMap = new Map<
    string,
    Operation & { start: number; end: number }
  >();

  // Populate the map with all operations from all equipment
  singleBatch.forEach((eq: EquipmentWithTiming) => {
    eq.operations.forEach((operation) => {
      operationsMap.set(operation.id, operation);
    });
  });

  // Recursive function to calculate timing for a single operation
  const calculateOperationTiming = (
    operation: Operation & { start: number; end: number }
  ): void => {
    // If timing is already calculated, return
    if (operation.start !== 0 && operation.end !== 0) return;

    // Get predecessor operation if it exists
    const predecessor =
      operation.predecessorId !== "initial"
        ? operationsMap.get(operation.predecessorId)
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
  singleBatch.forEach((eq: EquipmentWithTiming) => {
    eq.operations.forEach(calculateOperationTiming);
  });

  // Return updated equipment with calculated timings
  singleBatch = singleBatch.map((eq: EquipmentWithTiming) => ({
    ...eq,
    operations: eq.operations.map(
      (op: Operation & { start: number; end: number }) =>
        operationsMap.get(op.id)!
    ),
  }));

  /////// THEN CALCULATE TIMING FOR MULTIPLE BATCHES IN CAMPAIGN//////

  let multipleBatches = JSON.parse(JSON.stringify(singleBatch));

  // Loop through each equipment
  for (let i = 0; i < multipleBatches.length; i++) {
    let newOperations = [...multipleBatches[i].operations];

    // Add copies of each operation to the equipment for each additional batch with a batch offset
    for (let batchIndex = 1; batchIndex < campaign.quantity; batchIndex++) {
      const batchOffset =
        batchIndex *
        convertToSeconds(campaign.frequency, campaign.frequencyUnit);

      const batchOperations = multipleBatches[i].operations.map(
        (op: Operation & { start: number; end: number }) => ({
          ...op,
          id: `${op.id}-batch${batchIndex + 1}`,
          start: op.start + batchOffset,
          end: op.end + batchOffset,
        })
      );

      newOperations.push(...batchOperations);
    }

    // Replace the operations array with the new extended array
    multipleBatches[i].operations = newOperations;
  }

  return multipleBatches;
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

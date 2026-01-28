import {
  DurationUnit,
  Operation,
  Equipment,
  Campaign,
  EquipmentWithTiming,
  ProcessDetails,
  Timepoint,
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
      batchNumber: 1,
    })),
  }));

  // Create a map to store all operations with initial start and end times
  const operationsMap = new Map<
    string,
    Operation & { start: number; end: number; batchNumber: number }
  >();

  // Populate the map with all operations from all equipment
  singleBatch.forEach((eq: EquipmentWithTiming) => {
    eq.operations.forEach((operation) => {
      operationsMap.set(operation.id, operation);
    });
  });

  // Recursive function to calculate timing for a single operation
  const calculateOperationTiming = (
    operation: Operation & { start: number; end: number; batchNumber: number }
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
    operationsMap.set(operation.id, {
      ...operation,
      start,
      end,
      batchNumber: 1,
    });
  };

  // Calculate timing for all operations in all equipment
  singleBatch.forEach((eq: EquipmentWithTiming) => {
    eq.operations.forEach(calculateOperationTiming);
  });

  // Return updated equipment with calculated timings
  singleBatch = singleBatch.map((eq: EquipmentWithTiming) => {
    let minStartTime = Infinity;
    let maxEndTime = -Infinity;

    eq.operations = eq.operations.map((op) => {
      const updatedOp = operationsMap.get(op.id)!;
      minStartTime = Math.min(minStartTime, updatedOp.start);
      maxEndTime = Math.max(maxEndTime, updatedOp.end);
      return updatedOp;
    });

    eq.duration = maxEndTime - minStartTime;
    return eq;
  });

  const maxEquipmentDuration = singleBatch.reduce(
    (max: number, eq: EquipmentWithTiming) => Math.max(max, eq.duration),
    0
  );

  /////// THEN CALCULATE TIMING FOR MULTIPLE BATCHES IN CAMPAIGN//////

  const multipleBatches = JSON.parse(JSON.stringify(singleBatch));

  let offset = maxEquipmentDuration;
  if (campaign.schedulingType === "fixed") {
    offset = convertToSeconds(campaign.frequency, campaign.frequencyUnit);
  } else {
    // For optimized scheduling, calculate the minimum offset considering equipment quantities
    // The bottleneck is the equipment with the longest duration divided by its quantity
    offset = Math.max(
      ...equipment.map((eq) => {
        const eqDuration = singleBatch.find((sb) => sb.id === eq.id)?.duration || 0;
        const quantity = eq.quantity || 1;
        return eqDuration / quantity;
      })
    );
  }

  // Loop through each equipment
  for (let i = 0; i < multipleBatches.length; i++) {
    const newOperations = [...multipleBatches[i].operations];

    // Add copies of each operation to the equipment for each additional batch with a batch offset
    for (let batchIndex = 1; batchIndex < campaign.quantity; batchIndex++) {
      // For equipment with quantity > 1, batches are distributed round-robin
      // So the offset for a batch depends on how many batches before it used this equipment instance
      const batchOffset = batchIndex * offset;

      const batchOperations = multipleBatches[i].operations.map(
        (op: Operation & { start: number; end: number }) => ({
          ...op,
          id: `${op.id}-batch${batchIndex + 1}`,
          start: op.start + batchOffset,
          end: op.end + batchOffset,
          batchNumber: batchIndex + 1,
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

export const calculateProcessDetails = (
  equipment: EquipmentWithTiming[]
): ProcessDetails => {
  let bottleneck = equipment[0];
  for (let i = 1; i < equipment.length; i++) {
    if (equipment[i].duration > bottleneck.duration) {
      bottleneck = equipment[i];
    }
  }

  const batchDuration = calculateBatchDuration(equipment);
  const campaignDuration = calculateCampaignDuration(equipment);
  const batchQty = calculateBatchQuantity(equipment[0]);
  const cycleTime = calculateCycleTime(equipment);

  return {
    bottleneck,
    batchDuration,
    campaignDuration,
    batchQty,
    cycleTime,
  };
};

const calculateBatchDuration = (equipment: EquipmentWithTiming[]): number => {
  let minStartTime = Infinity;
  let maxEndTime = -Infinity;

  equipment.forEach((eq) => {
    eq.operations.forEach((op) => {
      if (op.batchNumber === 1) {
        minStartTime = Math.min(minStartTime, op.start);
        maxEndTime = Math.max(maxEndTime, op.end);
      }
    });
  });

  return maxEndTime - minStartTime;
};

const calculateCampaignDuration = (
  equipment: EquipmentWithTiming[]
): number => {
  let minStartTime = Infinity;
  let maxEndTime = -Infinity;

  equipment.forEach((eq) => {
    eq.operations.forEach((op) => {
      minStartTime = Math.min(minStartTime, op.start);
      maxEndTime = Math.max(maxEndTime, op.end);
    });
  });

  return maxEndTime - minStartTime;
};

const calculateBatchQuantity = (equipment: EquipmentWithTiming): number => {
  let batchQty = 1;

  if (!equipment) return batchQty;
  if (!equipment.operations) return batchQty;

  equipment.operations.forEach((op) => {
    if (op.batchNumber > batchQty) {
      batchQty = op.batchNumber;
    }
  });

  return batchQty;
};

const calculateCycleTime = (equipment: EquipmentWithTiming[]): number => {
  // Cycle time is the time between when batch 1 starts and when batch 2 starts
  let batch1Start = Infinity;
  let batch2Start = Infinity;

  equipment.forEach((eq) => {
    eq.operations.forEach((op) => {
      if (op.batchNumber === 1) {
        batch1Start = Math.min(batch1Start, op.start);
      }
      if (op.batchNumber === 2) {
        batch2Start = Math.min(batch2Start, op.start);
      }
    });
  });

  // If there's no batch 2, cycle time equals batch duration
  if (batch2Start === Infinity) {
    return calculateBatchDuration(equipment);
  }

  return batch2Start - batch1Start;
};

type Point = {
  x: number;
  y: number;
};

type Line = {
  start: Point;
  end: Point;
};

export const calculateResourceChartData = ({
  equipmentWithTiming,
  resourceId,
}: {
  equipmentWithTiming: EquipmentWithTiming[];
  resourceId: string;
}): Timepoint[] => {
  const lines: Line[] = [];

  // Step 1: Create lines from operations
  equipmentWithTiming.forEach((equipment) => {
    equipment.operations.forEach((operation) => {
      const resource = operation.resources.find(
        (res) => res.resourceOptionId === resourceId
      );
      if (resource) {
        const value = resource.value;
        lines.push({
          start: { x: operation.start, y: value },
          end: { x: operation.end, y: value },
        });
      }
    });
  });

  // Step 2: Calculate totals at unique x-values
  const xValues = new Set<number>();
  lines.forEach((line: Line) => {
    xValues.add(line.start.x - 1);
    xValues.add(line.start.x);
    xValues.add(line.end.x);
    xValues.add(line.end.x + 1);
  });

  const uniqueXValues = Array.from(xValues).sort((a, b) => a - b);
  const totalPoints: Timepoint[] = uniqueXValues.map((x) => {
    let total = 0;
    lines.forEach((line: Line) => {
      if (line.start.x <= x && line.end.x >= x) {
        total += line.start.y;
      }
    });
    return { time: x, value: total };
  });

  // Step 3: Add start and end points
  return [
    { time: 0, value: 0 },
    ...totalPoints,
    { time: calculateCampaignDuration(equipmentWithTiming), value: 0 },
  ];
};

export const getPeakResourceConsumption = (data: Timepoint[]): number => {
  let peak = -Infinity;
  data.forEach((timepoint) => {
    if (timepoint.value > peak) {
      peak = timepoint.value;
    }
  });
  return peak;
};

export const getAverageUtilityConsumption = (data: Timepoint[]): number => {
  if (data.length < 2) return 0; // No average if less than two timepoints

  let totalArea = 0;
  let totalTime = 0;

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1];
    const curr = data[i];

    // Calculate time interval and area under the curve segment
    const timeInterval = curr.time - prev.time;
    const area = prev.value * timeInterval;

    totalArea += area;
    totalTime += timeInterval;
  }

  return totalTime > 0 ? totalArea / totalTime : 0;
};

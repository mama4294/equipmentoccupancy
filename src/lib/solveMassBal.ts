import { BlockTypes } from "@/Types";
import { useStore } from "../Store";

export const solveMassBalance = () => {
  const { blocks, streams, updateMultipleStreams, updateMultipleBlocks } =
    useStore.getState();

  //Reset all calculation statuses
  const resetStreams = streams.map((stream) => {
    return { ...stream, hasError: true, calculationComplete: false };
  });

  // Collect changes to streams
  const updatedStreams = resetStreams.map((stream) => {
    // Solve input streams
    const inputBlocks = blocks.filter(
      (block) =>
        block.type === BlockTypes.InputNode && block.id === stream.source
    );

    if (inputBlocks.length > 0) {
      return {
        ...stream,
        components: inputBlocks[0].data.components,
        hasError: false,
        calculationComplete: true,
      };
    }
    return stream; // No change
  });

  // Apply all changes in one batch update
  updateMultipleStreams(updatedStreams);

  //Solve for the output nodes

  const updatedBlocks = blocks.map((block) => {
    const incomingStreams = streams.filter(
      (edge) => edge.target === block.id && block.type === BlockTypes.OutputNode
    );

    if (incomingStreams.length > 0) {
      return {
        ...block,
        calculatedComponets: incomingStreams[0].components,
        hasError: false,
        calculationComplete: true,
      };
    }
    return block; // No change
  });

  //apply updates
  updateMultipleBlocks(updatedBlocks);
};

import { useStore } from "../Store";
import { BlockTypes, StreamData } from "@/Types";
import { useToast } from "../hooks/use-toast";

export const useSolveMassBalance = () => {
  const { blocks, streams, updateMultipleStreams, updateMultipleBlocks } =
    useStore();
  const { toast } = useToast();

  const solveMassBalance = () => {
    try {
      // Display toast notification when solving starts
      toast({
        title: "Running...",
        description: "Solving mass balance",
        variant: "default",
      });

      // Track unresolved blocks and streams
      let remainingBlocks = new Set(
        blocks.map((block) => {
          block.data.hasError = true;
          block.data.calculationComplete = false;
          return block.id;
        })
      );
      let remainingStreams = new Set(
        streams.map((stream) => {
          (stream.data as StreamData).hasError = true;
          (stream.data as StreamData).calculationComplete = false;
          return stream.id;
        })
      );

      // Create local copies of blocks and streams to modify during calculations
      let updatedBlocks = [...blocks];
      let updatedStreams = [...streams];

      let attemptCount = 0;
      const maxAttempts = 10; // Prevent infinite loops

      while (remainingBlocks.size > 0 || remainingStreams.size > 0) {
        if (attemptCount >= maxAttempts) {
          throw new Error(
            `Maximum attempts reached (${maxAttempts} iterations) while solving mass balance.`
          );
        }
        attemptCount++;

        let newlySolvedBlocks = new Set();
        let newlySolvedStreams = new Set();

        // **Step 1: Solve Input Blocks**
        // If a block is a manually defined input, set its calculated values and mark as solved.
        updatedBlocks = updatedBlocks.map((block) => {
          if (
            block.type === BlockTypes.InputNode &&
            !block.data.isAutoCalc && // Skip auto-calculated input nodes
            remainingBlocks.has(block.id)
          ) {
            console.log("Solved Input Block", block);
            newlySolvedBlocks.add(block.id);
            remainingBlocks.delete(block.id);

            return {
              ...block,
              data: {
                ...block.data,
                hasError: false,
                calculationComplete: true,
                calculatedComponents: block.data.components, // Directly use user-defined input components
              },
            };
          }
          return block;
        });

        // **Step 2: Solve Streams**
        // If a stream has a solved source block, copy the components from the block to the stream.
        updatedStreams = updatedStreams.map((stream) => {
          const sourceBlock = updatedBlocks.find(
            (block) => block.id === stream.source
          );

          if (
            sourceBlock &&
            sourceBlock.data.calculationComplete &&
            remainingStreams.has(stream.id)
          ) {
            newlySolvedStreams.add(stream.id);
            remainingStreams.delete(stream.id);

            return {
              ...stream,
              data: {
                ...stream.data,
                // label: stream.data?.label || "",
                calculatedComponents: sourceBlock.data.calculatedComponents,
                hasError: false,
                calculationComplete: true,
              },
            };
          }
          return stream;
        });

        // **Step 3: Solve Process Blocks (Mixers, Reactors, etc.)**
        // If all incoming streams to a process block are solved, calculate the block's output.
        // updatedBlocks = updatedBlocks.map((block) => {
        //   if (
        //     block.type !== BlockTypes.InputNode && // Skip input blocks (already handled)
        //     block.type !== BlockTypes.OutputNode && // Skip output blocks (solved later)
        //     remainingBlocks.has(block.id)
        //   ) {
        //     const incomingStreams = updatedStreams.filter((stream) => stream.target === block.id);
        //     const solvedStreams = incomingStreams.filter((stream) => stream.calculationComplete);

        //     // Only solve the block if ALL input streams are solved
        //     if (solvedStreams.length === incomingStreams.length && solvedStreams.length > 0) {
        //       // Sum up all incoming components from multiple input streams
        //       let newComponents = {};
        //       solvedStreams.forEach((stream) => {
        //         Object.keys(stream.components).forEach((comp) => {
        //           newComponents[comp] = (newComponents[comp] || 0) + stream.components[comp];
        //         });
        //       });

        //       newlySolvedBlocks.add(block.id);
        //       remainingBlocks.delete(block.id);

        //       return {
        //         ...block,
        //         calculatedComponents: newComponents, // Assign sum of inputs
        //         hasError: false,
        //         calculationComplete: true,
        //       };
        //     }
        //   }
        //   return block;
        // });

        // **Step 4: Solve Output Blocks**
        // If a block is an output node, set its components based on the solved input stream.
        updatedBlocks = updatedBlocks.map((block) => {
          if (
            block.type === BlockTypes.OutputNode &&
            remainingBlocks.has(block.id)
          ) {
            const incomingStream = updatedStreams.find(
              (stream) =>
                stream.target === block.id && stream.data?.calculationComplete
            );

            if (incomingStream) {
              newlySolvedBlocks.add(block.id);
              remainingBlocks.delete(block.id);

              return {
                ...block,
                data: {
                  ...block.data,
                  calculatedComponents:
                    incomingStream.data?.calculatedComponents || [],
                  hasError: false,
                  calculationComplete: true,
                },
              };
            }
          }
          return block;
        });

        // **Step 5: Check for Convergence**
        // If no new blocks or streams were solved in this iteration, stop looping.
        // if (newlySolvedBlocks.size === 0 && newlySolvedStreams.size === 0) {
        //   break;
        // }

        console.log(
          "Attempt: ",
          attemptCount
          // "Remaining Blocks: ",
          // remainingBlocks,
          // "Remaining Streams",
          // remainingStreams,
          // "Blocks: ",
          // updatedBlocks,
          // "Streams: ",
          // updatedStreams
        );
      }

      //After while loop is complete

      //Handle Unsolved Elements**
      if (remainingBlocks.size > 0 || remainingStreams.size > 0) {
        console.error(
          "Mass balance did not fully solve. Attempt count: ",
          attemptCount,
          "Remaining block count: ",
          remainingBlocks.size,
          "Remaining stream count: ",
          remainingStreams.size,
          "Blocks: ",
          updatedBlocks,
          "Streams: ",
          updatedStreams
        );
        console.log("Unresolved Blocks:", Array.from(remainingBlocks));
        console.log("Unresolved Streams:", Array.from(remainingStreams));

        toast({
          title: "Error",
          description:
            "Mass balance could not be solved. Check for missing inputs.",
          variant: "destructive",
        });

        return;
      }

      // Apply Final Updates
      console.log("Final Streams......", updatedStreams);
      console.log("Final Blocks......", updatedBlocks);

      updateMultipleStreams(updatedStreams);
      updateMultipleBlocks(updatedBlocks);

      //Success Notification
      toast({
        title: "Success",
        description: "Mass balance solved successfully!",
        variant: "default",
      });
    } catch (error: any) {
      //Error Handling
      console.error("Error solving mass balance:", error);
      toast({
        title: "Error",
        description: error?.message || "The mass balance did not converge.",
        variant: "destructive",
      });
    }
  };

  return { solveMassBalance };
};

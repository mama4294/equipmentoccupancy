import { useStore } from "../Store";
import { Block, BlockTypes, componentFlow, Stream } from "@/Types";
import { useToast } from "../hooks/use-toast";

export const useSolveMassBalance = () => {
  const { blocks, streams, updateMultipleStreams, updateMultipleBlocks } =
    useStore();
  const { toast } = useToast();

  const solveMassBalance = () => {
    try {
      toast({
        title: "Running...",
        description: "Solving mass balance",
        variant: "default",
      });

      let remainingBlocks = new Set(blocks.map((block) => block.id));
      let remainingStreams = new Set(streams.map((stream) => stream.id));

      let updatedBlocks = blocks.map((block: Block) => ({
        ...block,
        data: { ...block.data, hasError: true, calculationComplete: false },
      }));
      let updatedStreams = streams.map((stream: Stream) => ({
        ...stream,
        data: {
          ...stream.data,
          hasError: true,
          calculationComplete: false,
          calculatedComponents: stream.data?.calculatedComponents || [],
        },
      }));

      let attemptCount = 0;
      const maxAttempts = 10;

      while (remainingBlocks.size > 0 || remainingStreams.size > 0) {
        if (attemptCount++ >= maxAttempts) {
          throw new Error(
            `Maximum attempts (${maxAttempts}) reached while solving mass balance.`
          );
        }

        let newlySolvedBlocks = new Set<string>();
        let newlySolvedStreams = new Set<string>();

        // Solve Input Blocks
        updatedBlocks.forEach((block: Block) => {
          if (
            block.type === BlockTypes.InputNode &&
            !block.data.isAutoCalc &&
            remainingBlocks.has(block.id)
          ) {
            newlySolvedBlocks.add(block.id);
            remainingBlocks.delete(block.id);

            block.data = {
              ...block.data,
              hasError: false,
              calculationComplete: true,
              calculatedComponents: block.data.components,
            };
          }
        });

        // Solve Streams
        updatedStreams.forEach((stream: Stream) => {
          const sourceBlock = updatedBlocks.find(
            (block) => block.id === stream.source
          );
          if (
            sourceBlock?.data.calculationComplete &&
            remainingStreams.has(stream.id)
          ) {
            newlySolvedStreams.add(stream.id);
            remainingStreams.delete(stream.id);

            stream.data = {
              ...stream.data,
              calculatedComponents: sourceBlock.data.calculatedComponents,
              hasError: false,
              calculationComplete: true,
            };
          }
        });

        // Solve Process Blocks
        updatedBlocks.forEach((block: Block) => {
          if (
            block.type !== BlockTypes.InputNode &&
            block.type !== BlockTypes.OutputNode &&
            remainingBlocks.has(block.id)
          ) {
            const incomingStreams = updatedStreams.filter(
              (stream: Stream) => stream.target === block.id
            );

            if (
              incomingStreams.some(
                (stream: Stream) => !stream.data?.calculationComplete
              )
            )
              return;

            let newComponents = sumStreamComponents(incomingStreams);
            newlySolvedBlocks.add(block.id);
            remainingBlocks.delete(block.id);

            block.data = {
              ...block.data,
              calculatedComponents: newComponents,
              hasError: false,
              calculationComplete: true,
            };
          }
        });

        // Solve Output Blocks
        updatedBlocks.forEach((block) => {
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

              block.data = {
                ...block.data,
                calculatedComponents:
                  incomingStream.data.calculatedComponents || [],
                hasError: false,
                calculationComplete: true,
              };
            }
          }
        });

        if (newlySolvedBlocks.size === 0 && newlySolvedStreams.size === 0)
          break; // No progress, exit loop

        console.table({
          Attempt: attemptCount,
          Remaining_Blocks: remainingBlocks.size,
          Remaining_Streams: remainingStreams.size,
        });
      }

      if (remainingBlocks.size > 0 || remainingStreams.size > 0) {
        toast({
          title: "Error",
          description:
            "Mass balance could not be solved. Check for missing inputs.",
          variant: "destructive",
        });
        return;
      }

      updateMultipleStreams(updatedStreams);
      updateMultipleBlocks(updatedBlocks);

      toast({
        title: "Success",
        description: "Mass balance solved successfully!",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error solving mass balance:", error);
      toast({
        title: "Error",
        description: error?.message || "The mass balance did not converge.",
        variant: "destructive",
      });
    }
  };

  // Helper function to sum components across multiple streams
  const sumStreamComponents = (streams: Stream[]) => {
    return streams.reduce<componentFlow[]>((acc, stream) => {
      stream.data?.calculatedComponents?.forEach((component) => {
        let existingComponent = acc.find((c) => c.id === component.id);
        if (existingComponent) {
          existingComponent.mass += component.mass;
        } else {
          acc.push({ ...component });
        }
      });
      return acc;
    }, []);
  };

  return { solveMassBalance };
};

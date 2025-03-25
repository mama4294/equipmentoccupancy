import { Handle, NodeProps, Position } from "@xyflow/react";
import { Block, BlockData } from "@/Types";
import { useStore } from "@/Store";
import { cn } from "@/lib/utils";

//TODO: enfore only 1 stream per handle

export interface ProcessIO {
  id: string;
  label: string;
  description?: string;
}

export interface ProcessNodeProps {
  title: string;
  inputs: ProcessIO[];
  outputs: ProcessIO[];
  data: BlockData;
  selected: Boolean;
}

export const ProcessNode = ({
  title,
  inputs,
  outputs,
  data,
  selected,
}: ProcessNodeProps) => {
  const { isDebug } = useStore();

  // Dimensions for positioning
  const innerWidth = 240;
  const innerHeight = 120;
  const handleDistance = 100;
  const outerPadding = 20;

  // Calculate outer container dimensions
  const outerWidth = innerWidth + handleDistance * 2 + outerPadding * 2;
  const outerHeight = Math.max(
    innerHeight + outerPadding * 2,
    Math.max(inputs.length, outputs.length) * 60
  );

  return (
    <div
      className="relative"
      style={{
        width: outerWidth,
        height: outerHeight,
      }}
    >
      {/* Input Handles */}
      {inputs.map((input, index) => {
        const position = (index + 1) / (inputs.length + 1);
        return (
          <div key={`input-${input.id}`}>
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{
                left: outerPadding,
                top: outerHeight * position,
                width: 10,
                height: 10,
              }}
              className="border-2 border-primary bg-primary"
            />

            {/* Input connecting line */}
            <div
              className="absolute bg-primary"
              style={{
                left: outerPadding + 6,
                top: outerHeight * position,
                width: handleDistance - 6,
                height: 2,
              }}
            >
              <div
                className="absolute px-2 text-xs font-medium whitespace-nowrap bg-background"
                style={{
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {input.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Output Handles */}
      {outputs.map((output, index) => {
        const position = (index + 1) / (outputs.length + 1);
        return (
          <div key={`output-${output.id}`}>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{
                right: outerPadding,
                top: outerHeight * position,
                width: 10,
                height: 10,
              }}
              className="border-2 border-primary bg-primary"
            />

            {/* Output connecting line */}
            <div
              className="absolute bg-primary"
              style={{
                right: outerPadding + 6,
                top: outerHeight * position,
                width: handleDistance - 6,
                height: 2,
              }}
            >
              <div
                className="absolute px-2 text-xs font-medium whitespace-nowrap bg-background"
                style={{
                  top: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {output.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Inner process block */}
      <div
        className={cn(
          "absolute px-4 py-2 shadow-md rounded-md border-2 border-primary bg-background cursor-pointer",
          data.hasError
            ? "bg-destructive text-destructive-foreground"
            : "bg-background",
          selected ? "border-selected" : "border-primary"
        )}
        style={{
          left: outerPadding + handleDistance,
          top: outerPadding,
          width: innerWidth,
          height: innerHeight,
        }}
      >
        <div className="text-center p-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm">{data.equipment}</p>
          {/* Render additional data if provided */}
          {isDebug && (
            <pre
              className={cn(
                data.hasError
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-background"
              )}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
          {/* {additionalData && Object.entries(additionalData).length > 0 && (
            <div className="mt-2 pt-2 border-t border-border text-xs">
              {Object.entries(additionalData).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-2">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

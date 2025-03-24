import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { Stream } from "@/Types";
import { useStore } from "@/Store";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  selected,
}: EdgeProps<Stream>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { isDebug } = useStore();

  return (
    <>
      <svg>
        <defs>
          <marker
            id={`arrow-${id}`}
            markerWidth="4"
            markerHeight="3"
            refX="4"
            refY="1.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L4,1.5 L0,3 Z"
              className={selected ? "fill-selected" : "fill-primary"}
            />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        path={edgePath}
        markerEnd={`url(#arrow-${id})`}
        className={selected ? "stroke-selected" : "stroke-primary"}
        style={{ strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan bg-background text-center "
          style={{
            width: "fit-content",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <p className="text-xs">{label}</p>
          {isDebug && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

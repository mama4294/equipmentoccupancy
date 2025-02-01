import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeMarker,
  getBezierPath,
  MarkerType,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

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
            <path d="M0,0 L4,1.5 L0,3 Z" className="fill-primary" />
          </marker>
        </defs>
      </svg>
      <BaseEdge
        path={edgePath}
        markerEnd={`url(#arrow-${id})`}
        className="stroke-primary"
        style={{ strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan bg-background text-center"
          style={{
            width: "fit-content",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <p className="text-xs">{label}</p>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";
import type { Options } from "vis-network";
import {
  entityColors,
  type GraphNode,
} from "@/lib/graphData";

interface RelationshipGraphProps {
  nodes: GraphNode[];
  edges: import("@/lib/graphData").GraphEdge[];
  onSelectNode: (node: GraphNode | null) => void;
}

const edgeColorByKind: Record<string, string> = {
  direct: "#414754",
  inferred: "#414754",
  temporal: "#414754",
  suspicious: "#EF4444",
};

export default function RelationshipGraph({ nodes: graphNodes, edges: graphEdges, onSelectNode }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = new DataSet(
      graphNodes.map((n) => ({
        id: n.id,
        label: n.label,
        shape: "dot",
        size: n.id === "per_a" ? 26 : 18,
        color: {
          background: "#181b25",
          border: n.risk === "high" ? "#EF4444" : entityColors[n.type],
          highlight: { background: "#262a34", border: entityColors[n.type] },
        },
        borderWidth: n.id === "per_a" ? 3 : 2,
        font: { color: "#dfe2ef", size: 13, face: "Inter" },
      }))
    );

    const edges = new DataSet(
      graphEdges.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        label: e.label,
        dashes: e.kind === "temporal" || e.kind === "suspicious",
        color: { color: edgeColorByKind[e.kind], highlight: "#adc7ff" },
        font: { color: "#8b90a0", size: 10, strokeWidth: 0, background: "#0f131c" },
        smooth: { enabled: true, type: "continuous", roundness: 0.2 },
      }))
    );

    const options: Options = {
      physics: {
        enabled: true,
        stabilization: { iterations: 150 },
        barnesHut: { gravitationalConstant: -8000, springLength: 140, springConstant: 0.03 },
      },
      interaction: { hover: true, tooltipDelay: 150 },
      nodes: { shadow: false },
      edges: { arrows: { to: { enabled: false } }, width: 1 },
    };

    const network = new Network(containerRef.current, { nodes, edges }, options);
    networkRef.current = network;

    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        const node = graphNodes.find((n) => n.id === id) ?? null;
        onSelectNode(node);
      } else {
        onSelectNode(null);
      }
    });

    return () => {
      network.destroy();
      networkRef.current = null;
    };
  }, [graphNodes, graphEdges, onSelectNode]);

  return <div ref={containerRef} className="w-full h-full" />;
}

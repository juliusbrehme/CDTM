import React, { useEffect, useRef } from "react";
import vegaEmbed, { VisualizationSpec } from "vega-embed";

interface Props {
  spec: VisualizationSpec;
}

export default function VegaChart({ spec }: Props) {
  const chartRef = useRef();

  useEffect(() => {
    vegaEmbed(chartRef.current, spec);
  }, []);

  return <div ref={chartRef} />;
}

const sampleSpec: VisualizationSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "A simple bar chart",
  data: {
    values: [
      { category: "A", amount: 28 },
      { category: "B", amount: 55 },
      { category: "C", amount: 43 },
      { category: "D", amount: 91 },
      { category: "E", amount: 81 },
      { category: "F", amount: 53 },
      { category: "G", amount: 19 },
      { category: "H", amount: 87 },
    ],
  },
  mark: "bar",
  encoding: {
    x: { field: "category", type: "nominal" },
    y: { field: "amount", type: "quantitative" },
  },
};

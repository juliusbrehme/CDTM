/* eslint-disable max-classes-per-file */
import React, { PureComponent } from "react";
import { Treemap, ResponsiveContainer } from "recharts";

const data2 = [
  {
    name: "axis",

    children: [
      { name: "Axes", size: 1302 },
      { name: "Axis", size: 24593 },
      { name: "AxisGridLine", size: 652 },
      { name: "AxisLabel", size: 636 },
      { name: "CartesianAxes", size: 6703 },
    ],
  },
  {
    name: "controls",
    children: [
      { name: "AnchorControl", size: 2138 },
      { name: "ClickControl", size: 3824 },
      { name: "Control", size: 1353 },
      { name: "ControlList", size: 4665 },
      { name: "DragControl", size: 2649 },
      { name: "ExpandControl", size: 2832 },
      { name: "HoverControl", size: 4896 },
      { name: "IControl", size: 763 },
      { name: "PanZoomControl", size: 5222 },
      { name: "SelectionControl", size: 7862 },
      { name: "TooltipControl", size: 8435 },
    ],
  },
  {
    name: "data",
    children: [
      { name: "Data", size: 20544 },
      { name: "DataList", size: 19788 },
      { name: "DataSprite", size: 10349 },
      { name: "EdgeSprite", size: 3301 },
      { name: "NodeSprite", size: 19382 },
      {
        name: "render",
        children: [
          { name: "ArrowType", size: 698 },
          { name: "EdgeRenderer", size: 5569 },
          { name: "IRenderer", size: 353 },
          { name: "ShapeRenderer", size: 2247 },
        ],
      },
      { name: "ScaleBinding", size: 11275 },
      { name: "Tree", size: 7147 },
      { name: "TreeBuilder", size: 9930 },
    ],
  },
  {
    name: "events",
    children: [
      { name: "DataEvent", size: 7313 },
      { name: "SelectionEvent", size: 6880 },
      { name: "TooltipEvent", size: 3701 },
      { name: "VisualizationEvent", size: 2117 },
    ],
  },
  {
    name: "legend",
    children: [
      { name: "Legend", size: 20859 },
      { name: "LegendItem", size: 4614 },
      { name: "LegendRange", size: 10530 },
    ],
  },
  {
    name: "operator",
    children: [
      {
        name: "distortion",
        children: [
          { name: "BifocalDistortion", size: 4461 },
          { name: "Distortion", size: 6314 },
          { name: "FisheyeDistortion", size: 3444 },
        ],
      },
      {
        name: "encoder",
        children: [
          { name: "ColorEncoder", size: 3179 },
          { name: "Encoder", size: 4060 },
          { name: "PropertyEncoder", size: 4138 },
          { name: "ShapeEncoder", size: 1690 },
          { name: "SizeEncoder", size: 1830 },
        ],
      },
      {
        name: "filter",
        children: [
          { name: "FisheyeTreeFilter", size: 5219 },
          { name: "GraphDistanceFilter", size: 3165 },
          { name: "VisibilityFilter", size: 3509 },
        ],
      },
      { name: "IOperator", size: 1286 },
      {
        name: "label",
        children: [
          { name: "Labeler", size: 9956 },
          { name: "RadialLabeler", size: 3899 },
          { name: "StackedAreaLabeler", size: 3202 },
        ],
      },
      {
        name: "layout",
        children: [
          { name: "AxisLayout", size: 6725 },
          { name: "BundledEdgeRouter", size: 3727 },
          { name: "CircleLayout", size: 9317 },
          { name: "CirclePackingLayout", size: 12003 },
          { name: "DendrogramLayout", size: 4853 },
          { name: "ForceDirectedLayout", size: 8411 },
          { name: "IcicleTreeLayout", size: 4864 },
          { name: "IndentedTreeLayout", size: 3174 },
          { name: "Layout", size: 7881 },
          { name: "NodeLinkTreeLayout", size: 12870 },
          { name: "PieLayout", size: 2728 },
          { name: "RadialTreeLayout", size: 12348 },
          { name: "RandomLayout", size: 870 },
          { name: "StackedAreaLayout", size: 9121 },
          { name: "TreeMapLayout", size: 9191 },
        ],
      },
      { name: "Operator", size: 2490 },
      { name: "OperatorList", size: 5248 },
      { name: "OperatorSequence", size: 4190 },
      { name: "OperatorSwitch", size: 2581 },
      { name: "SortOperator", size: 2023 },
    ],
  },
];

type TreeData = {
  name: string;
  children: TreeData[];
  size?: number;
  color?: string;
};

interface CustomizedContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: any;
  color?: string;
  rank?: number;
  name?: string;
  size?: number;
}

interface TreeMapChartProps {
  data?: TreeData[];
}

const COLORS = [
  "#8889DD",
  "#9597E4",
  "#8DC77B",
  "#A5D297",
  "#E2CF45",
  "#F8C12D",
  "#3C3E3F",
  "#a451e3",
  "#f8c12d",
  "#3c3e3f",
  "#8889dd",
  "#9597e4",
  "#8dc77b",
  "#a5d297",
  "#e2cf45",
  "#f8c12d",
];

class CustomizedContent extends PureComponent<CustomizedContentProps> {
  handleMouseOver = (event: React.MouseEvent<SVGRectElement>, name: string, size?: number, x?:number, y?:number) => {
    const tooltip = document.getElementById("treemap-tooltip");
    const target = event.currentTarget;
    if (target) {
      target.style.stroke = "black";
      target.style.strokeWidth = "1px"
      target.style.strokeOpacity = "1";
    }
    if (tooltip) {
      tooltip.style.opacity = "1";
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y + 30}px`;
      tooltip.innerHTML = `${name}: ${size ? size + "$" : "N/A"}`;
    }
  };

  handleMouseLeave = (event: React.MouseEvent<SVGRectElement>) => {
    const tooltip = document.getElementById("treemap-tooltip");
    const target = event.currentTarget;
    if (target) {
      target.style.stroke = "none";
      target.style.strokeWidth = "0px";
    }
    if (tooltip) {
      tooltip.style.opacity = "0";
    }
  };
  render() {
    const {
      root,
      depth,
      x,
      y,
      width,
      height,
      index,
      payload,
      color,
      rank,
      name,
      size,
    } = this.props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill:
              depth < 2
                ? COLORS[Math.floor((index / root.children.length) * 6)]
                : color,
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
          onMouseOver={(e) => this.handleMouseOver(e, name, size, x, y)}
          onMouseLeave={this.handleMouseLeave}
        />
        {depth !== 1 ? (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="black"
            fontSize={14}
          >
            {name}
          </text>
        ) : null}
        {depth === 1 ? (
          <text
            x={x + 4}
            y={y + 18}
            fill="black"
            fontSize={16}
            fillOpacity={0.9}
          >
            {index + 1}
          </text>
        ) : null}
      </g>
    );
  }
}

export default class TreeMapChart extends PureComponent<TreeMapChartProps> {
  render() {
    const data = this.props.data || data2;
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg text-gray-500">TreeMap Chart</h3>
            <p className="text-3xl font-bold"></p>
            <div
              className={`flex items-center mt-1 ${true ? "text-traderepublic-green" : "text-traderepublic-red"}`}
            >
              <span className="font-medium"></span>
              <span className="ml-2"></span>
            </div>
          </div>
        </div>

        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              width={400} // Replace with a numeric value or a dynamic calculation
              height={400} // Replace with a numeric value or a dynamic calculation
              data={data}
              dataKey="size"
              fill="transparent"
              stroke="#fff"
              content={<CustomizedContent depth={2} />}
            />
          </ResponsiveContainer>
        </div>
        <span
        id="treemap-tooltip"
        style={{
          position: "absolute",
          opacity: 0,
          backgroundColor: "#f3f3f3",
          border: "1px solid #d2d2d2",
          borderRadius: "5px",
          padding: "10px",
          pointerEvents: "none",
          transition: "opacity 0.2s",
        }}></span>
      </div>
    );
  }
}

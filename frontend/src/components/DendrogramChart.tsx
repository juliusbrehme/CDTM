import { useMemo } from "react";
import * as d3 from "d3";

export type TreeNode = {
    type: 'node';
    id: string;
    value: number;
    name: string;
    children: Tree[];
    color?: string;
  };
  
  export type TreeLeaf = {
    type: 'leaf';
    name: string;
    value: number;
    id: string;
    color?: string;
  };
  
  export type Tree = TreeNode | TreeLeaf;

  const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];
  
  export const dataT: Tree = {
    id: "a0",
    type: "node",
    name: "APRIL 25",
    value: 234,
    color: '#F8C12D',
    children: [
      {
        type: "node",
        name: "Food",
        id: "a1",
        value: 102,
        color: "#9597E4",
        children: [
          { type: "leaf", name: "Restaurants", value: 90, id: "a2", color: '#8DC77B' },
          { type: "leaf", name: "Groceries", value: 12, id: "a3", color: '#8DC77B' },
        ],
      },
      {
        type: "node",
        name: "Culture",
        value: 166,
        id: "a4",
        color: "#9597E4",
        children: [
          { type: "leaf", name: "Museum", value: 98, id: "a5", color: '#E2CF45' },
          { type: "leaf", name: "Concert", value: 34, id: "a6", color: '#E2CF45' },
          { type: "leaf", name: "Opera", value: 22 , id: "a7", color: '#E2CF45' },
          { type: "leaf", name: "Football Game", value: 12, id: "a8", color: '#E2CF45' },
        ],
      },
      {
        type: "node",
        name: "Plants",
        value: 0,
        id: "a9",
        color: "#9597E4",
        children: [
          
        ],
      },
    ],
  };
  

const MARGIN = { top: 35, right: 10, bottom: 10, left: 35 };



type DendrogramProps = {
  width?: number;
  height?: number;
  data?: Tree;
};

export const Dendrogram = ({ width = 450, height= 550, data = dataT }: DendrogramProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const hierarchy = useMemo(() => {
    return d3.hierarchy(data).sum((d) => d.value);
  }, [data]);

  var Tooltip = d3.select("#div_template")
    
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#f3f3f3")
    .style("border", "solid")
    .style("border-color", "#d2d2d2")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "20px")

  var mouseover = function(node: any , d) {
    
    Tooltip
      .html(node.data.name + " : " + node.data.value + " $")
      .style("opacity", 1)
      .style("position", "absolute")
      .style("left", node.y + "px")
      .style("top", node.x + "px")
    d3.select("#" + node.data.id)
      .style("stroke", "grey")
      .style("opacity", 1)
      
  }

  var mouseleave = function(node, d) {
    Tooltip
      .style("opacity", 0)
    d3.select("#" + node.data.id)
      .style("stroke", "none")
  }

  const dendrogram = useMemo(() => {
    const dendrogramGenerator = d3
      .cluster<Tree>()
      .size([boundsHeight, boundsWidth]);
    return dendrogramGenerator(hierarchy);
  }, [hierarchy, width, height]);

  const allNodes = dendrogram.descendants().map((node) => {
    return (
      <g key={node.data.id}>
        <circle
          id={node.data.id}
          cx={node.y}
          cy={node.x}
          r={16}
          stroke="none"
          fill={node.data.color}
          opacity={1}
          onMouseOver={(e: React.MouseEvent<SVGCircleElement>) => mouseover(node, e)}
          onMouseLeave={(e: React.MouseEvent<SVGCircleElement>) => mouseleave(node, e)}
        />
        
        {true && (
          <text
            x={node.y + 15}
            y={node.x + 15}
            fontFamily="ui-sans-serif system-ui -apple-system BlinkMacSystemFont 'Segoe UI' Roboto 'Helvetica Neue' Arial sans-serif 'Apple Color Emoji' 'Segoe UI Emoji' 'Segoe UI Symbol'"
            fontSize={16}
            fontWeight={500}
            textAnchor="left"
            alignmentBaseline="hanging"
            fill="test">
            {node.data.name}
          </text>
        )}
      </g>
    );
  });

  const horizontalLinkGenerator = d3.linkHorizontal();

  const allEdges = dendrogram.descendants().map((node) => {
    if (!node.parent) {
      return;
    }
    return (
      <g key={node.data.id}>
      <path
        key={node.id}
        fill="none"
        stroke="grey"
        d={horizontalLinkGenerator({
          source: [node.parent.y, node.parent.x],
          target: [node.y, node.x],
        })}
      />
      {true && (
        <text
          x={(node.parent.y + node.y) / 2}
          y={(node.parent.x + node.x) / 2 - 10}
          fontSize={12}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="grey">
          {node.data.value}$
        </text>
      )}
      </g>
    );
  });

  

  // Three function that change the tooltip when user hover / move / leave a cell
  


  return (
    
    <div className="mb-4 items-center"> 
          <h3 className="text-lg text-gray-500">Dendogram Chart</h3>
        

            <svg className="w-full p-15" height={height}>   
                <g transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
                {allEdges}
                {allNodes}
          
                </g>
        
            </svg>
      
     
            <span id="div_template"></span>
        </div>
    
    
  );
};

import { useMemo, useState } from "react";
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
    name: "04/2025",
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
  

const MARGIN = { top: 35, right: 150, bottom: 10, left: 35 };



type DendrogramProps = {
  width?: number;
  height?: number;
  data?: Tree;
  id?: string;
};

export const Dendrogram = ({ width = 600, height= 550, data = dataT, id}: DendrogramProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const hierarchy = useMemo(() => {
    return d3.hierarchy(data).sum((d) => d.value);
  }, [data]);



  const mouseover = function(node: any , d) {
    const tooltipElement = document.getElementById("tooltip" + id);
    if (tooltipElement) {
      tooltipElement.innerHTML = `${node.data.name} : ${node.data.value} $`;
      tooltipElement.style.opacity = "1";
      tooltipElement.style.position = "absolute";
      tooltipElement.style.left = `${node.y}px`;
      tooltipElement.style.top = `${node.x}px`;
    }
    d3.select("#" + node.data.id)
      .style("stroke", "grey")
      .style("opacity", 1)
      
  }

  var mouseleave = function(node, d) {
    const tooltipElement = document.getElementById("tooltip" + id);
    if (tooltipElement) {
      tooltipElement.style.opacity = "0";
    }
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

    const strokeWidth = Math.max(1, node.data.value / 40); // Adjust the divisor (10) to scale the thickness


    return (
      <g key={node.data.id}>
      <path
        key={node.id}
        fill="none"
        stroke="grey"
        strokeWidth={strokeWidth}
        
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
          fill="black"
          fontWeight={500}>
          {node.data.value}$
        </text>
      )}
      </g>
    );
  });

  

  // Three function that change the tooltip when user hover / move / leave a cell
  


  return (
    
    <div className="mb-4 w-full p-6 items-center relative overflow-scroll animate-fade-in mx-auto"> 
            <h3 className="text-lg text-gray-700 font-bold">
              Dynamic Mindmap
            </h3>
            <p className="text-gray-500">Get deep insights to your data</p>
        

            <svg className="p-15" width={width} height={height}>   
                <g transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
                {allEdges}
                {allNodes}
          
                </g>
        
            </svg>
      
     
        <span
        id={"tooltip" + id}
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
};

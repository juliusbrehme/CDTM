"use client";
import * as d3 from "d3";
import { useEffect } from "react";

export default function KnowledgeGraph(){
  useEffect(() => {
    const width = 800;
    const height = 600;

    const svg = d3
      .select("#knowledge-graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const data: {nodes: (d3.SimulationNodeDatum & {id: string, text: string})[], links: {source: string, target: string}[]} = {
      nodes: [
        { id: "A", text: "Node A" },
        { id: "B", text: "Node B" },
        { id: "C", text: "Node C" },
        { id: "D", text: "Node D" },
        { id: "E", text: "Node E" }
      ],
      links: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "C", target: "E" },
        { source: "B", target: "C" }
      ],
    };

    const simulation = d3
      .forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      .force("link", d3.forceLink().id((d: any) => (d as { id: string }).id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke-width", 5)
      .attr("length", 100)
      .style("stroke", "#aaa");

    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 12)
      .attr("title", "TEST")
      .attr("hover", "TEST")
      .attr("fill", "#69b3a2");
       // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      

    node.append("title").text((d) => d.text);

    simulation
      .nodes(data.nodes)
      .on("tick", () => {
        link
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .attr("x1", (d: any) => d.source.x)
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .attr("y1", (d: any) => d.source.y)
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .attr("x2", (d: any) => d.target.x)
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          .attr("y2", (d: any) => d.target.y);

        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      });

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const linkForce = simulation.force<d3.ForceLink<any, any>>("link");
    if (linkForce) {
      linkForce.links(data.links);
    }
  }, []); 
  return (
    <div>
      <h2>Knowledge Graph</h2>
      <div id="knowledge-graph"></div>
    </div>
  );
}
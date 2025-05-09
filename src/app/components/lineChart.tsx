"use client"
import * as d3 from "d3";
import {useRef, useEffect} from "react";

export default function LineChart() {
    const data = [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 1}, {x: 4, y: 3}];
    const svgRef = useRef(null);
    const margin = {top: 20, right: 30, bottom: 30, left: 40};
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set the scales
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.x) as [number, number])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.y) || 0])
            .range([height, 0]);

        // Add the axes
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));

        // Add the line
        const line = d3.line<{ x: number; y: number }>()
            .x(d => x(d.x))
            .y(d => y(d.y));

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

    }, [data]);

    return (
      <svg ref={svgRef} />
    );
}
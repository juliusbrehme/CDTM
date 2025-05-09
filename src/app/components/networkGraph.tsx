// components/ForceGraph.tsx

'use client';

import * as d3 from 'd3';
import { useEffect } from 'react';

interface Node {
  id: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export default function ForceGraph() {
  
  const forceProperties = {
    center: { x: 0.5, y: 0.5 },
    charge: { enabled: true, strength: -30, distanceMin: 1, distanceMax: 2000 },
    collide: { enabled: true, strength: 0.7, iterations: 1, radius: 5 },
    forceX: { enabled: false, strength: 0.1, x: 0.5 },
    forceY: { enabled: false, strength: 0.1, y: 0.5 },
    link: { enabled: true, distance: 30, iterations: 1 },
  };

  useEffect(() => {
    const svg = d3.select<SVGSVGElement, unknown>("#force-graph");
    let width = svg.node()?.getBoundingClientRect().width || 600;
    let height = svg.node()?.getBoundingClientRect().height || 400;

    const simulation = d3.forceSimulation<Node>();

    let graph: GraphData;

    d3.json<GraphData>('./test.json').then((_graph) => {
      graph = _graph;
      initializeDisplay();
      initializeSimulation();
    });

    function initializeSimulation() {
      simulation.nodes(graph.nodes);
      initializeForces();
      simulation.on('tick', ticked);
    }

    function initializeForces() {
      simulation
        .force('link', d3.forceLink<Node, Link>())
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide())
        .force('center', d3.forceCenter())
        .force('forceX', d3.forceX())
        .force('forceY', d3.forceY());
      updateForces();
    }

    function updateForces() {
      (simulation.force('center') as d3.ForceCenter<Node>)
        ?.x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);

      (simulation.force('charge') as d3.ForceManyBody<Node>)
        .strength(forceProperties.charge.strength * +forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax);

      (simulation.force('collide') as d3.ForceCollide<Node>)
        .strength(forceProperties.collide.strength * +forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations);

      (simulation.force('forceX') as d3.ForceX<Node>)
        .strength(forceProperties.forceX.strength * +forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);

      (simulation.force('forceY') as d3.ForceY<Node>)
        .strength(forceProperties.forceY.strength * +forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y);

      (simulation.force('link') as d3.ForceLink<Node, Link>)
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .id((d: any) => d.id)
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? graph.links : []);

      simulation.alpha(1).restart();
    }

    function ticked() {
      const link = svg.selectAll('.links line');
      const node = svg.selectAll('.nodes circle');

      link
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .attr('x1', (d: any) => (d.source as Node).x!)
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .attr('y1', (d: any) => (d.source as Node).y!)
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .attr('x2', (d: any) => (d.target as Node).x!)
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        .attr('y2', (d: any) => (d.target as Node).y!);

      node.attr('cx', (d: Node) => d.x!).attr('cy', (d: Node) => d.y!);
    }

    function initializeDisplay() {
      /*const link = svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
        .attr('stroke-width', forceProperties.link.enabled ? 1 : 0.5)
        .attr('opacity', forceProperties.link.enabled ? 1 : 0);*/

      const node = svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
        .attr('r', forceProperties.collide.radius)
        .attr('stroke', forceProperties.charge.strength > 0 ? 'blue' : 'red')
        .attr('stroke-width', forceProperties.charge.enabled ? Math.abs(forceProperties.charge.strength) / 15 : 0)
        .call(
          d3.drag<Element, Node>()
            .on('start', (event, d: Node) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d: Node) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d: Node) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      node.append('title').text((d) => d.id);
    }

    const resizeObserver = new ResizeObserver(() => {
      width = svg.node()?.getBoundingClientRect().width || 600;
      height = svg.node()?.getBoundingClientRect().height || 400;
      updateForces();
    });


    return () => {
      resizeObserver.disconnect();
      simulation.stop();
    };
  }, []);

  return <div id='force-graph'></div>;
}


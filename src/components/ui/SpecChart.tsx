"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface SpecData {
    label: string;
    value: number;
    unit: string;
}

interface SpecChartProps {
    data: SpecData[];
    title: string;
}

export default function SpecChart({ data, title }: SpecChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const margin = { top: 30, right: 30, bottom: 40, left: 60 };
        const width = 450 - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Clear previous SVG
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.label))
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value) || 100])
            .range([height, 0]);

        // X Axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "text-[10px] text-gray-400 uppercase tracking-widest");

        // Y Axis
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5))
            .selectAll("text")
            .attr("class", "text-[10px] text-gray-400");

        // Bars
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", d => x(d.label) || 0)
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", "#111")
            .attr("rx", 4)
            .transition()
            .duration(1000)
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value));

        // Values on top
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text-[10px] font-medium fill-gray-900")
            .attr("x", d => (x(d.label) || 0) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 10)
            .attr("text-anchor", "middle")
            .text(d => `${d.value}${d.unit}`);

    }, [data]);

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-8">{title}</h3>
            <svg ref={svgRef}></svg>
        </div>
    );
}

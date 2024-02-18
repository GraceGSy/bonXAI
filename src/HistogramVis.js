import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

export const HistogramVis = ({data=[],
							 dataTypes={},
							 variable="",
							 layout={"height": 80,
							 		"width": 200,
							 		"marginRight": 5,
							 		"marginLeft": 5,
							 		"marginTop": 5,
							 		"marginBottom": 20},
							 currentFilters,
							 handleFilter}) => {
  
	const ref = useRef("svgCompare");
	
	useEffect(() => {

		let svg = d3.select(ref.current);
		let svgElement = svg.select("#vis");

		let type = dataTypes[variable].type;

		if (type === "string") {
			const bins = d3.bin()
				.thresholds(10)
				.value((d) => d.length)(data.map(d => d[variable]));

			// Declare the x (horizontal position) scale.
			const x = d3.scaleLinear()
			  .domain([bins[0].x0, bins[bins.length - 1].x1])
			  .range([layout.marginLeft, layout.width - layout.marginRight]);

			// Declare the y (vertical position) scale.
			const y = d3.scaleLinear()
			  .domain([0, d3.max(bins, (d) => d.length)])
			  .range([layout.height - layout.marginBottom, layout.marginTop]);

			// Add a rect for each bin.
			svgElement.selectAll(".bins")
				.data(bins)
				.join("rect")
				.attr("class", "bins")
				.attr("x", (d) => x(d.x0) + 1)
				.attr("width", (d) => x(d.x1) - x(d.x0) - 1)
				.attr("y", (d) => y(d.length))
				.attr("height", (d) => y(0) - y(d.length))
				.attr("cursor", "pointer")
				.attr("fill", d => {
					if (!currentFilters || !currentFilters[variable]) {
						return "steelblue"
					}

					let filterValues = currentFilters[variable];
					if (filterValues.filter(a => a[0] <= x.invert(d.x0) && a[1] >= x.invert(d.x1)).length == 0) {
						return "gray"
					} else {
						return "steelblue"
					}
				})
				.on("click", (e, d) => {
					let binMin = x.invert(d.x0);
					let binMax = x.invert(d.x1);
					handleFilter(variable, [binMin, binMax], currentFilters);
				});

			// Add the x-axis and label.
			svg.select("#xaxis")
			  .attr("transform", `translate(0,${layout.height - layout.marginBottom})`)
			  .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0).tickSize(2))
			  .call(g => g.select(".domain").remove())

		} else {

			let counts = [];

			for (let n of dataTypes[variable].ints) {
				let nCounts = data.filter(d => d[variable] === n).length;
				counts.push({"nVar":n, "nCounts":nCounts});
			}

			// Declare the x (horizontal position) scale.
			const x = d3.scaleBand()
			  .domain(counts.map(c => c.nVar))
			  .range([layout.marginLeft, layout.width - layout.marginRight]);

			// Declare the y (vertical position) scale.
			const y = d3.scaleLinear()
			  .domain([0, d3.max(counts.map(c => c.nCounts))])
			  .range([layout.height - layout.marginBottom, layout.marginTop]);

			// Add a rect for each bin.
			svgElement.selectAll(".bins")
				.data(counts)
				.join("rect")
				.attr("class", "bins")
				.attr("x", (d) => x(d.nVar) + 1)
				.attr("width", (d) => x.bandwidth() - 2)
				.attr("y", (d) => y(d.nCounts))
				.attr("height", (d) => y(0) - y(d.nCounts))
				.attr("cursor", "pointer")
				.attr("fill", d => {
					if (!currentFilters || !currentFilters[variable]) {
						return "steelblue"
					}

					let filterValues = currentFilters[variable];
					if (filterValues.filter(a => a == d.nVar).length == 0) {
						return "gray"
					} else {
						return "steelblue"
					}
				})
				.on("click", (e, d) => {
					handleFilter(variable, d.nVar, currentFilters);
				});

			// Add the x-axis and label.
			svg.select("#xaxis")
			  .attr("transform", `translate(0,${layout.height - layout.marginBottom})`)
			  .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0).tickSize(2))
			  .call(g => g.select(".domain").remove())

		}

	}, [data, dataTypes, variable, currentFilters])    

  return (
    <div>
      <svg width={layout.width} height={layout.height} ref={ref}>
      	<g id="vis" />
      	<g id="xaxis" />
      </svg>
    </div>
  )
}
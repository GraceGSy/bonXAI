import React, {useRef, useState, useEffect} from 'react'
import * as d3 from 'd3';

import Button from '@mui/material/Button';

import { SelectedTable } from "./SelectedTable.js";
import { Search } from "./Search.js";

export const UMAPVis = ({allTrainData=[],
						allTestData=[],
						layout={"height": 500,
						 		"width": 650,
						 		"marginRight": 25,
						 		"marginLeft": 25,
						 		"marginTop": 25,
						 		"marginBottom": 25},
						 _queryInput}) => {
  
	const ref = useRef("svgUMAP");

	const [brushed, setBrushed] = useState([]);
	const [searchStr, setSearchStr] = useState("");
	const [hover, setHover] = useState(null);
	
	useEffect(() => {

		let svg = d3.select(ref.current);
		let svgElement = svg.select("#vis");

		let xExtent = d3.extent(allTrainData.concat(allTestData), d => d["0"]);

		let yExtent = d3.extent(allTrainData.concat(allTestData), d => d["1"]);

		// Declare the x (horizontal position) scale.
		const x = d3.scaleLinear()
		  .domain(xExtent)
		  .range([layout.marginLeft, layout.width - layout.marginRight]);

		// Declare the y (vertical position) scale.
		const y = d3.scaleLinear()
		  .domain(yExtent)
		  .range([layout.height - layout.marginBottom, layout.marginTop]);

		let uniqueLabels = Array.from(new Set(allTrainData.map(d => d.label)));

		const colorScale = d3.scaleOrdinal(d3.schemeSet2)
			.domain(uniqueLabels)

		// Add a rect for each bin.
		let trainDataPoint = svgElement.select("#train")
			.selectAll(".trainEmbeddings")
			.data(allTrainData)
			.join("circle")
			.attr("class", "trainEmbeddings")
			.attr("cx", (d) => x(d["0"]))
			.attr("cy", (d) => y(d["1"]))
			.attr("r", 3)
			.attr("fill", "none")
			.attr("stroke", (d, i) => {
				return colorScale(d.label)})
			.attr("opacity", 0.25);

		// Add a rect for each bin.
		let testDataPoint = svgElement.select("#test")
			.selectAll(".testEmbeddings")
			.data(allTestData)
			.join("circle")
			.attr("class", "testEmbeddings")
			.attr("cx", (d) => x(d["0"]))
			.attr("cy", (d) => y(d["1"]))
			.attr("r", 3)
			.attr("fill", "red")
			.on("mouseover", (d, i) => {
				setHover(i);
			})
			.on("mouseout", setHover(null));

		const brush = d3.brush().on("start brush end", ({selection}) => {
			let value = [];
			if (selection) {
			  d3.select(".selection").attr("fill", "none").attr("stroke", "gray").attr("stroke-dasharray", "2px 5px 5px 5px");
			  const [[x0, y0], [x1, y1]] = selection;
			  trainDataPoint
			    .attr("fill", (d, i) => {
			    	if (x0 <= x(d["0"]) && x(d["0"]) < x1 && y0 <= y(d["1"]) && y(d["1"]) < y1) {
			    		return colorScale(d.label)
			    	} else {
			    		return "none"
			    	}
			    })
			    .attr("stroke", (d, i) => {
			    	if (x0 <= x(d["0"]) && x(d["0"]) < x1 && y0 <= y(d["1"]) && y(d["1"]) < y1) {
			    		return colorScale(d.label)
			    	} else {
			    		return "gray"
			    	}
			    })
			    .attr("opacity", (d, i) => {
			    	if (x0 <= x(d["0"]) && x(d["0"]) < x1 && y0 <= y(d["1"]) && y(d["1"]) < y1) {
			    		return 0.5
			    	} else {
			    		return 0.25
			    	}
			    });

			  value = allTrainData.filter((d, i) => (x0 <= x(d["0"]) && x(d["0"]) < x1
			  									&& y0 <= y(d["1"]) && y(d["1"]) < y1));
			  setBrushed(value);
			} else {
			  trainDataPoint
			  	.attr("stroke", (d, i) => {
					return colorScale(d.label)})
			  	.attr("fill", "none")
			  	.attr("opacity", 0.25);
			}
		})

	    // Create the brush behavior.
		svg.call(brush);

	}, [allTrainData, allTestData])

	function runQuery(query) {
		if (query) {

	    	let hidden = document.getElementById(_queryInput);
	    	let data_string = JSON.stringify([query]);

	    	if (hidden) {
		        hidden.value = data_string;
		        var event = document.createEvent('HTMLEvents');
		        event.initEvent('input', false, true);
		        hidden.dispatchEvent(event);
	    	}
	    }
	}

  return (
    <div>
      <p>Brush to select training sentences for comparison.</p>
      <svg width={layout.width} height={layout.height} ref={ref}>
      	<g id="vis">
      		<g id="train" />
      		<g id="test" />
      	</g>
      	<g id="xaxis" />
      </svg>

      <div style={{"display":"flex", "alignItems":"center"}}>
	      <Search title={"Query Sentence"} width={`${550-25}px`} setSearchStr={setSearchStr} />
	      <Button
	      	style={{"height":"40px"}}
	      	variant="outlined"
	      	onClick={(event) => {
	          runQuery(searchStr);
	        }}>Compute</Button>
      </div>
      <SelectedTable selectedData={allTestData} hover={hover} />
      <SelectedTable title="Compare" selectedData={brushed} />
    </div>
  )
}
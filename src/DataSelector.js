import React, {useRef, useState, useEffect} from "react";

import { DataTable } from "./DataTable.js";
import { Search } from "./Search.js";

export const DataSelector = ({data=[], dataTypes={}, _selectedData}) => {

	const [variables, setVariables] = useState([]);

	const [filters, setFilters] = useState({});
	const [filteredData, setFilteredData] = useState([]);
	const [searchStr, setSearchStr] = useState("");

	useEffect(() => {
		if (data.length === 0) {
			return
		}

		setVariables(Object.keys(data[0]));
		setFilteredData(data);
	}, [data])

	function inArray(variable, originalArray, item) {

		if (dataTypes[variable].type != "string") {
			if (originalArray.filter(a => a == item).length === 0) {
				return false
			} else {
				return originalArray.filter(a => a != item)
			}
		} else {
			if (originalArray.filter(a => a[0] == item[0] && a[1] == item[1]).length === 0) {
				return false
			} else {
				return originalArray.filter(a => a[0] != item[0] && a[1] != item[1])
			}
		}

		return false
	}

	function handleFilter(variable, selection, currentFilters) {
		if (currentFilters[variable]) {
			let currentSelection = currentFilters[variable];

			let isInArray = inArray(variable, currentSelection, selection);
			let newSelection;
			if (!isInArray) {
				newSelection = currentSelection.concat([selection]);
			} else {
				newSelection = isInArray;
			}

			if (newSelection.length == 0) {
				delete currentFilters[variable];
			} else {
				currentFilters[variable] = newSelection;
			}
			
			setFilters(currentFilters => ({...currentFilters}));
		} else {
			currentFilters[variable] = [selection];
			setFilters(currentFilters => ({...currentFilters}));
		}
	}

	useEffect(() => {

		let newFilteredData = data.filter(d => {

			for (let dataVariable of Object.keys(d)) {
				if (dataTypes[dataVariable].type === "string" && d[dataVariable].search(searchStr) != -1) {
					return true
				}
			}

			return false

		})

		let allFilteredData = newFilteredData.filter((d, i) => {

			for (let filterVariable of Object.keys(filters)) {

				let varFilters = filters[filterVariable];
				let dValue = d[filterVariable];

				if (dataTypes[filterVariable].type != "string") {
					if (varFilters.filter(a => a == dValue).length == 0) {
						return false
					}
				}

				if (dataTypes[filterVariable].type == "string") {
					if (varFilters.filter(a => a[0] <= dValue.length && a[1] >= dValue.length).length == 0) {
						return false
					}
				}

			}

			return true

		})

		setFilteredData(allFilteredData);

	}, [filters, searchStr, dataTypes])

	useEffect(() => {

		if (filteredData) {

	    	let hidden = document.getElementById(_selectedData);
	    	let data_string = JSON.stringify(filteredData);

	    	if (hidden) {
		        hidden.value = data_string;
		        var event = document.createEvent('HTMLEvents');
		        event.initEvent('input', false, true);
		        hidden.dispatchEvent(event);
	    	}
	    }

	}, [filteredData])

	return (
	    <div>
	    	<Search setSearchStr={setSearchStr} />
	    	<DataTable data={data}
	    			   filteredData={filteredData}
	    			   dataTypes={dataTypes}
	    			   variables={variables}
	    			   currentFilters={filters}
	    			   handleFilter={handleFilter} />
	    </div>
  )
}
import React, {useRef, useState, useEffect} from "react";

import { DataExplorer } from "../src/DataExplorer.js";

import trainTweets from "../public/my-dataset-train.json";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DataExplorerDemo',
};

export const DataExplorerDemo = () => {

	const dataTypes = {'text': {'type': 'string'},
						'label': {'type': 'int64',
						'names': ['anger', 'joy', 'optimism', 'sadness'],
						'ints': [0, 1, 2, 3],
						'int2str': {0: 'anger', 1: 'joy', 2: 'optimism', 3: 'sadness'},
						'str2int': {'anger': 0, 'joy': 1, 'optimism': 2, 'sadness': 3}}}

	useEffect(() => {

	}, [trainTweets])

	return (
		<div>
			<DataExplorer data={trainTweets} dataTypes={dataTypes} />
		</div>
	)
}

DataExplorerDemo.story = {
  name: 'DataExplorerDemo',
};
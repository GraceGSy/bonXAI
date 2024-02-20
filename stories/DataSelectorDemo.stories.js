import React, {useRef, useState, useEffect} from "react";

import { DataSelector } from "../src/DataSelector.js";

import trainTweets from "../public/my-dataset-train.json";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DataSelectorDemo',
};

export const DataSelectorDemo = () => {

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
			<DataSelector data={trainTweets} dataTypes={dataTypes} />
		</div>
	)
}

DataSelectorDemo.story = {
  name: 'DataSelectorDemo',
};
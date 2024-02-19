import React, {useRef, useState, useEffect} from "react";

import { InferenceExplorer } from "../src/InferenceExplorer.js";

import trainData from "../public/my-dataset-train.json";
import trainDataEmbeddings from "../public/embeddings_train.json";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'InferenceExplorerDemo',
};

export const InferenceExplorerDemo = () => {

	const dataTypes = {'text': {'type': 'string'},
						'label': {'type': 'int64',
							'names': ['anger', 'joy', 'optimism', 'sadness'],
							'ints': [0, 1, 2, 3],
							'int2str': {0: 'anger', 1: 'joy', 2: 'optimism', 3: 'sadness'},
							'str2int': {'anger': 0, 'joy': 1, 'optimism': 2, 'sadness': 3}}
						}

	// useEffect(() => {

	// }, [trainData, trainDataEmbeddings])

	return (
		<div>
			<InferenceExplorer dataTypes={dataTypes} trainData={trainData} trainDataEmbeddings={trainDataEmbeddings} />
		</div>
	)
}

InferenceExplorerDemo.story = {
  name: 'InferenceExplorerDemo',
};
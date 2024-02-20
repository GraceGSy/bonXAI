import React, {useRef, useState, useEffect} from "react";

import { UMAPVis } from "./UMAPVis.js";

/* 
Parameters:

trainData - [{"text":, "label"}, ...]
trainDataEmbeddings - [{"0":x, "1":y}, ...]
testData - ["text1", "text2", ...]
testDataEmbeddings - [{"0":x, "1":y}, ...]
testDataPrediction - [{'label':, 'score':}, ...]
*/
export const InferenceExplorer = ({allTrainData=[],
								   allTestData=[],
								   _queryInput}) => {

	console.log(allTestData);

	return (
	    <div>
	    	<UMAPVis allTrainData={allTrainData} allTestData={allTestData} _queryInput={_queryInput} />
	    </div>
  )
}
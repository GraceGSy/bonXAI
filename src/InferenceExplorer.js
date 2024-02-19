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
export const InferenceExplorer = ({dataTypes={},
								   trainData=[],
								   trainDataEmbeddings=[],
								   testData=[],
								   testDataEmbeddings=[],
								   testDataPrediction=[]}) => {

	return (
	    <div>
	    	<UMAPVis dataTypes={dataTypes}
	    			trainData={trainData}
	    			trainDataEmbeddings={trainDataEmbeddings}
	    			testDataEmbeddings={testDataEmbeddings} />
	    </div>
  )
}
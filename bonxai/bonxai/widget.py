import json
import pandas as pd
from datasets import Dataset
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import umap

import ipywidgets as widgets
from traitlets import Unicode, Dict, List, TraitError

# Returns train split of data set as json
def _get_data(data):
    _train_data = data
    
    _all_data = []
    for row in _train_data:
        _all_data.append(row)
        
    return _all_data

def _data_type(data):
    _features = data.features
    
    _types = {}
    for f in _features:
        _ftype = _features[f].dtype
        
        if _ftype == "int64":
            _fnames = _features[f].names
            
            _str2int = {}
            _int2str = {}
            _ints = []
            for n in _fnames:
                _nint = _features[f].str2int(n)
                _str2int[n] = _nint
                _int2str[_nint] = n
                _ints.append(_nint)
            
            _types[f] = {"type":_ftype, "names":_fnames, "ints":_ints, "int2str":_int2str, "str2int":_str2int}
            
        else:
            _types[f] = {"type":_ftype}
    return _types

class DataExplorerBaseWidget(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('DataExplorerView').tag(sync=True)
    _model_name = Unicode('DataExplorerModel').tag(sync=True)
    _view_module = Unicode('bonxai').tag(sync=True)
    _model_module = Unicode('bonxai').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__()

        self.component = self.__class__.__name__
        self.props = kwargs

    def update_prop(self, prop_name, prop_value):
        self.props = {**self.props, prop_name: prop_value}


@widgets.register
class DataExplorer(DataExplorerBaseWidget):
    def __init__(self, data=[], **kwargs):
        
        self.dataJSON = _get_data(data)
        self.dataTypes = _data_type(data)

        # print("here", self.data)
        
        super().__init__(
            data=self.dataJSON,
            dataTypes=self.dataTypes,
            **kwargs
        )

class DataSelectorBaseWidget(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('DataSelectorView').tag(sync=True)
    _model_name = Unicode('DataSelectorModel').tag(sync=True)
    _view_module = Unicode('bonxai').tag(sync=True)
    _model_module = Unicode('bonxai').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)
    selected = List().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__()

        self.component = self.__class__.__name__
        self.props = kwargs

    def update_prop(self, prop_name, prop_value):
        self.props = {**self.props, prop_name: prop_value}

@widgets.register
class DataSelector(DataSelectorBaseWidget):
    def __init__(self, data=[], **kwargs):
        
        self.dataOriginal = data
        self.dataJSON = _get_data(data)
        self.dataTypes = _data_type(data)

        super().__init__(
            data=self.dataJSON,
            dataTypes=self.dataTypes,
            **kwargs
        )

    def getSelected(self):
        df = pd.DataFrame(self.selected)
        df_dict = df.to_dict()
        for k in df_dict:
            df_dict[k] = list(df_dict[k].values())
        return Dataset.from_dict(df_dict)

# @widgets.register
# class DataExplorer(DataExplorerBaseWidget):
#     def __init__(self, data=[], **kwargs):
        
#         self.dataTrain = _get_data(data)
#         self.dataTypes = _data_type(data)

#         # print("here", self.data)
        
#         super().__init__(
#             data=self.dataTrain,
#             dataTypes=self.dataTypes,
#             **kwargs
#         )

# Should only run once
def getEmbeddings(sentences, model):
    return model.encode(sentences)

# Train-dataset UMAP reducer
# Should only run once
def getReducer(embeddings):
  reducer = umap.UMAP().fit(embeddings)
  return reducer

# Train-dataset UMAP embeddings
def getReducedEmbeddings(reducer):
  return reducer.embedding_[:]

# New data UMAP embeddings, newData is list
def getNewReducedEmbeddings(newData, reducer, model):
  new_sentence_embedding = model.encode(newData)
  new_reduced = reducer.transform(new_sentence_embedding)
  return new_reduced

class InferenceExplorerBaseWidget(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('InferenceExplorerView').tag(sync=True)
    _model_name = Unicode('InferenceExplorerModel').tag(sync=True)
    _view_module = Unicode('bonxai').tag(sync=True)
    _model_module = Unicode('bonxai').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__()

        self.component = self.__class__.__name__
        self.props = kwargs

    def update_prop(self, prop_name, prop_value):
        self.props = {**self.props, prop_name: prop_value}

@widgets.register
class InferenceExplorer(InferenceExplorerBaseWidget):

    query = List().tag(sync=True)

    def __init__(self, data, model, label2id, **kwargs):

        self.label2id = label2id

        # Run inference on new input query
        self.observe(handler=self.__run_inference, names="query")

        # Should only load once, for computing sentence embeddings
        self.transformer_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

        # Path to predictive model
        self.model = model

        # Get umap coords for reduced data
        self.umapReducer = getReducer(getEmbeddings([d["text"] for d in data], self.transformer_model))
        self.umapCoords = getReducedEmbeddings(self.umapReducer)

        self.allTrainData = _get_data(data)

        for i in range(len(self.allTrainData)):
            self.allTrainData[i]["0"] = self.umapCoords[i][0]
            self.allTrainData[i]["1"] = self.umapCoords[i][1]

        self.allTestData = []

        super().__init__(
            allTrainData=self.allTrainData,
            allTestData=self.allTestData,
            **kwargs
        )

    def __run_inference(self, change):

        newQueryPrediction = pipeline("sentiment-analysis", model=self.model)(change["new"][0])
        newQueryUmapCoords = getNewReducedEmbeddings(change["new"], self.umapReducer, self.transformer_model)

        print(newQueryPrediction, newQueryUmapCoords)

        self.allTestData = [{"text":self.query, "label":self.label2id[newQueryPrediction[0]["label"]], "0":newQueryUmapCoords[0][0], "1":newQueryUmapCoords[0][1]}]
        self.props = {**self.props, "allTestData": self.allTestData}

        return 
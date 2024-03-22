import json
import pandas as pd
from datasets import Dataset
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import umap
import torch

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

# def getEmbeddings(texts, model, tokenizer, device):

#     # print(model, tokenizer, device)

#     vector_array = []

#     for text in texts:
#         a1 = text
#         b1 = tokenizer.encode(a1)

#         # print(b1)

#         input_ids = torch.tensor(b1).unsqueeze(0).to(device)  # Batch size 1

#         # print(input_ids)

#         outputs = model(input_ids , output_hidden_states = True)

#         hidden_states = [i for i in range(1,len(outputs.hidden_states))]

#         last_hidden_states = outputs.hidden_states[-1]
#         if len(last_hidden_states.shape)>1:
#             last_hidden_states = torch.mean(last_hidden_states, 1)
#         last_hidden_states = last_hidden_states[0].flatten()
#         vectors = last_hidden_states.cpu().detach().numpy()
#         vector_array.append(vectors)

#     return vector_array

def getEmbeddings(texts, model, tokenizer, device, batch_size=32):
    vector_array = []

    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        encoded_batch = [tokenizer.encode(text, add_special_tokens=True) for text in batch_texts]
        max_len = max(len(encoded_text) for encoded_text in encoded_batch)
        padded_batch = [encoded_text + [tokenizer.pad_token_id] * (max_len - len(encoded_text)) for encoded_text in encoded_batch]

        input_ids = torch.tensor(padded_batch).to(device)

        with torch.no_grad():
            outputs = model(input_ids, output_hidden_states=True)

        last_hidden_states = outputs.hidden_states[-1]
        mean_hidden_states = torch.mean(last_hidden_states, dim=1)
        vectors = mean_hidden_states.cpu().detach().numpy()
        vector_array.extend(vectors)

    return vector_array

# Train-dataset UMAP reducer
# Should only run once
def getReducer(embeddings):
  reducer = umap.UMAP().fit(embeddings)
  return reducer

# Train-dataset UMAP embeddings
def getReducedEmbeddings(reducer):
  return reducer.embedding_[:]

# New data UMAP embeddings, newData is list
def getNewReducedEmbeddings(newData, model, tokenizer, device, reducer):
  new_sentence_embedding = getEmbeddings(newData, model, tokenizer, device)
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

    def __init__(self, data, model, tokenizer, device, label2id, **kwargs):

        self.label2id = label2id

        # Run inference on new input query
        self.observe(handler=self.__run_inference, names="query")

        # Should only load once, for computing sentence embeddings
        # self.transformer_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

        # Path to predictive model
        self.model = model

        self.tokenizer = tokenizer
        self.device = device

        # Get umap coords for reduced data
        self.umapReducer = getReducer(getEmbeddings([d["text"] for d in data], model, tokenizer, device))
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

        newQueryPrediction = pipeline("sentiment-analysis", model=self.model, tokenizer=self.tokenizer, device=self.device)(change["new"][0])
        newQueryUmapCoords = getNewReducedEmbeddings(change["new"], self.model, self.tokenizer, self.device, self.umapReducer)

        print(newQueryPrediction, newQueryUmapCoords)

        self.allTestData = [{"text":self.query, "label":self.label2id[newQueryPrediction[0]["label"]], "0":newQueryUmapCoords[0][0], "1":newQueryUmapCoords[0][1]}]
        self.props = {**self.props, "allTestData": self.allTestData}

        return 
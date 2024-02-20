import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';

var React = require('react');
var ReactDOM = require('react-dom');
const e = React.createElement;

var dataExplorer = require('../../../lib/DataExplorer.js');
var dataSelector = require('../../../lib/DataSelector.js');
var inferenceExplorer = require('../../../lib/InferenceExplorer.js');

var lib = {...dataExplorer, ...dataSelector, ...inferenceExplorer};

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class DataExplorerModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'bonxai',
        _view_module : 'bonxai',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class DataExplorerView extends DOMWidgetView {
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);
    }

    value_changed() {
        var props = this.model.get("props");

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }
}

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class DataSelectorModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'bonxai',
        _view_module : 'bonxai',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class DataSelectorView extends DOMWidgetView {
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);

        // // Create input element to track changes in selected data
        this.inputSelected = document.createElement('input');
        this.inputSelected.type = 'text';
        this.inputSelected.id = `_hiddenSelected${this.model.model_id}`;
        this.inputSelected.style.display = 'none';
        this.inputSelected.value = this.model.get('selected');
        this.inputSelected.oninput = this.data_changed.bind(this);

        this.el.appendChild(this.inputSelected);
    }

    value_changed() {
        var props = this.model.get("props");

        props = {...props,
                "_selectedData": `_hiddenSelected${this.model.model_id}`};

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    data_changed() {
        this.model.set('selected', JSON.parse(this.inputSelected.value));
        this.model.save_changes();
    }
}

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class InferenceExplorerModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'bonxai',
        _view_module : 'bonxai',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class InferenceExplorerView extends DOMWidgetView {
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);

        // // Create input element to track changes in selected data
        this.inputQuery = document.createElement('input');
        this.inputQuery.type = 'text';
        this.inputQuery.id = `_hiddenQuery${this.model.model_id}`;
        this.inputQuery.style.display = 'none';
        this.inputQuery.value = this.model.get('query');
        this.inputQuery.oninput = this.data_changed.bind(this);

        this.el.appendChild(this.inputQuery);
    }

    value_changed() {
        var props = this.model.get("props");

        props = {...props,
                "_queryInput": `_hiddenQuery${this.model.model_id}`};

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    data_changed() {
        this.model.set('query', JSON.parse(this.inputQuery.value));
        this.model.save_changes();
    }
}

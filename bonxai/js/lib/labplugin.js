import {DataExplorerModel, DataExplorerView, DataSelectorModel, DataSelectorView, InferenceExplorerModel, InferenceExplorerView, version} from './index';
import {IJupyterWidgetRegistry} from '@jupyter-widgets/base';

export const helloWidgetPlugin = {
  id: 'bonxai:plugin',
  requires: [IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'bonxai',
          version: version,
          exports: { DataExplorerModel, DataExplorerView, DataSelectorModel, DataSelectorView, InferenceExplorerModel, InferenceExplorerView }
      });
  },
  autoStart: true
};

export default helloWidgetPlugin;

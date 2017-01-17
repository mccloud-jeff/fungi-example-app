import React from 'react';

export default function (BaseComponent) {
  class Observable extends React.Component {
    // TEMP: Moved into separate HOC
    static wrappedType = BaseComponent;
    static isType = o => o.type.wrappedType === BaseComponent;

    constructor(props) {
      super(props);

      const listeners = {};

      this.listen = function (api, type, listener) {
        if (listener) {
          listeners[type] = api.on(type, listener);
        }
      };

      this.unlisten = function (api, type) {
        if (type) {
          api.unByKey(type);
          delete listeners[type];
        } else {
          Object.keys(listeners).forEach(key => api.unByKey(key));
        }
      };
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          ref={ref => this.api = ref && ref.api}
          listen={this.listen}
          unlisten={this.unlisten}
        />
      );
    }
  }

  return Observable;
}

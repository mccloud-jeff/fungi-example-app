import React from 'react';
import ol from 'openlayers/dist/ol-debug.js';

class TileLayer extends React.Component {
  componentDidMount() {
    const { type, visible, apiKey, ...props  } = this.props;

    this.api = new ol.layer.Tile({
      preload: Infinity,
      source: new ol.source[type]({ ...props, key: apiKey }),
      visible
    });
  }

  render() {
    return null;
  }
}

export default TileLayer;

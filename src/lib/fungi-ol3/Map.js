import React from 'react';
import _ from 'lodash';
import ol from 'openlayers/dist/ol-debug.js';
import observable from './observable';
import FeatureLayer from './FeatureLayer';
import TileLayer from './TileLayer';
import proj4 from 'proj4';

import 'openlayers/css/ol.css';

if (typeof window !== 'undefined') {
  window.proj4 = proj4;
}

// TODO: Put this somewhere else, and make it dynamic
proj4.defs('EPSG:26904', '+proj=utm +zone=4 +ellps=GRS80 +datum=NAD83 +units=m +no_defs');

class Map extends React.Component {
  constructor(props) {
    super(props);

    const { layers, basemaps } = props;

    this.state = { layers, basemaps };

    this.apiLayers = [];
    this.apiBasemaps = [];
  }

  componentDidMount() {
    const { center, zoom, onMove } = this.props;

    const view = new ol.View({
      center: ol.proj.fromLonLat(center),
      zoom
    });

    this.api = new ol.Map({
      target: this.mapDiv,
      layers: [
        ...this.apiBasemaps,
        ...this.apiLayers
      ],
      view
    });

    this.api.on('moveend', (e) => {
      const zoom = view.getZoom();
      const center = ol.proj.toLonLat(view.getCenter());
      const extent = view.calculateExtent(this.api.getSize());

      onMove && onMove({ center, zoom, extent });
    });

    this.api.on('singleclick', (e) => {
      // TODO: Idenitfy, select, etc
    });
  }

  componentWillUnmount() {
    this.api && this.api.setTarget(null);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.layers !== this.props.layers
      || nextProps.basemaps !== this.props.basemaps
      || !_.isEqual(nextProps.center, this.props.center)
      || nextProps.zoom !== this.props.zoom;
  }

  render() {
    let { style } = this.props;

    const layers = Object
      .keys(this.state.layers)
      .map(id =>
        <FeatureLayer key={id} {...this.state.layers[id]} ref={ref => ref && this.apiLayers.push(ref.api)} />
      );

    const basemaps = Object
      .keys(this.state.basemaps)
      .map(id => (
        <TileLayer key={id} {...this.state.basemaps[id]} ref={ref => ref && this.apiBasemaps.push(ref.api)} />
      ));

    return (
      <div style={style} ref={ref => (this.mapDiv = ref)}>
        {basemaps}
        {layers}
      </div>
    );
  }
}

export default observable(Map);

import React from 'react';
import _ from 'lodash';
import turf from '@turf/turf';
import ol from 'openlayers/dist/ol-debug.js';
import fungi from '../../lib/fungi';
import wkx from 'wkx';
import FeatureSource from './FeatureSource';
import styleFunction from './styleFunction';
import styleFromArcGis from './styleFromArcGis';

class FeatureLayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const that = this;
    const { layerId, source } = this.props;
    let { style } = this.props;

    if (!style) {
      if (source.type === 'arcgis') {
        const { url } = source;
        const configUrl = `${url}?f=json`;

        // TODO: Probably shouldn't go here!
        fetch(configUrl)
          .then(response => response.json())
          .then(config => {
            this.api.setStyle(styleFunction(styleFromArcGis(config.drawingInfo)));
            // this.setState({
            //   name: config.name,
            //   description: config.description,
            //   style: Style(config.drawingInfo),
            //   extent: [config.extent.xmin, config.extent.ymin, config.extent.xmax, config.extent.ymax],
            // });
          })
          .catch();
      } else if (source.type === 'graphql') {
        // TODO: Fetch native style and config from GraphQL (e.g. __meta)
      }
    } else {
      if (typeof style === 'string') {
        // TODO: URL to style JSON in native format (need this?)
      } else {
        style = styleFunction(style);
      }
    }

    this.api = new ol.layer.Vector({
      id: layerId,
      style,
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.bbox,
        format: new ol.format.GeoJSON({
          featureProjection: 'EPSG:3857',
          defaultDataProjection: `EPSG:${source.srid || 3857}`
        }),
        loader: (extent, resolution, projection) => {
          const projectionCode = projection.getCode();
          const srid = Number(projectionCode.split(':')[1]);
          const ext = source.srid && srid !== source.srid
            ? ol.proj.transformExtent(extent, projectionCode, `EPSG:${source.srid}`)
            : extent;

          var geom = turf.polygon([[
            [ext[0], ext[1]],
            [ext[2], ext[1]],
            [ext[2], ext[3]],
            [ext[0], ext[3]],
            [ext[0], ext[1]]
          ]]).geometry;

          that.setState({ geom: ext, resolution, srid });
        }
      })
    });
  }

  loadFeatures(layerId, features) {
    const source = this.api.getSource();
    const format = source.getFormat();

    const apiFeatures = format.readFeatures(features);

    source.addFeatures(apiFeatures);
    
    // TODO: Notify parent (map) that features were loaded (so they may be cached in state)
    // this.props.onFeatures && this.props.onLayerUpdated(layerId, features);
  }

  render() {
    const { layerId, source } = this.props;
    const { geom, srid } = this.state;

    if (!geom) return null;

    const Source = fungi[source.type](source)(FeatureSource);

    return (
      <div>
        <Source
          key={layerId}
          geom={geom}
          srid={srid}
          onLoaded={features => this.loadFeatures(layerId, features)}
          />
      </div>
    );
  }
}

export default FeatureLayer;

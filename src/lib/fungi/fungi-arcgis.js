import React from 'react';
import _ from 'lodash';
import turf from '@turf/turf';
import { arcgisToGeoJSON } from 'arcgis-to-geojson-utils';

export default ({ url }) => {
  return (WrappedComponent) => {
    class Source extends React.Component {
      constructor(props) {
        super(props);

        this.state = {};
      }

      componentDidMount() {
        this.setState({ loading: true });
      }

      componentWillUpdate(nextProps, nextState) {
        if (!nextState.loading) return;

        const ext = nextProps.geom;

        const geom = turf.polygon([[
          [ext[0], ext[1]],
          [ext[2], ext[1]],
          [ext[2], ext[3]],
          [ext[0], ext[3]],
          [ext[0], ext[1]]
        ]]).geometry;

        const extent = geom.coordinates[0];

        const params = {
          returnGeometry: (nextProps.returnGeometry == null ? true : nextProps.returnGeometry),
          inSR: nextProps.inSR || 3857,
          outSR: nextProps.outSR || 3857,
          geometryType: 'esriGeometryEnvelope',
          outFields: nextProps.outFields || '*'
        };

        const requestExtent = {
          xmin: extent[0][0],
          ymin: extent[0][1],
          xmax: extent[2][0],
          ymax: extent[2][1],
          spatialReference: { wkid: params.inSR },
        };

        const qs = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const baseUrl = `${url}/query/?f=json&${qs}&spatialRel=esriSpatialRelIntersects&geometry=`;
        const requestUrl = `${baseUrl}${JSON.stringify(requestExtent)}`;

        fetch(requestUrl)
          .then(response => response.json())
          .then((data) => {
            // TODO: Do in Worker()
            const results = (data.features || []);
            const geoJSON = {
              type: 'FeatureCollection',
              features: results.map(f => arcgisToGeoJSON(f))
            };

            this.setState({ loading: false, features: geoJSON, error: undefined })
          })
          .catch(error => this.setState({ loading: false, error, features: undefined }));
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state } />;
      }
    }

    return Source;    
  }
};

import _ from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import turf from '@turf/turf';
import wkx from 'wkx';

export default ({ id, fields }) => {
  const GetFeatures = gql`
    query GetFeaturesQuery($geom: String!) {
        features: ${id}(geom: $geom) {
            nodes {
                ${fields}
            }
        }
    }`;

  return graphql(GetFeatures, {
    options: ({ geom }) => {
      const wkt = new wkx.Geometry.parseGeoJSON(geom).toWkt();

      return { variables: { geom: wkt } };
    },
    props: ({ data: { loading, error, features, refetch } }) => {
      // loading state
      if (loading) {
        return { loading: true };
      }

      // error state
      if (error) {
        console.error(error);
        return { error };
      }

      // TODO: Do in Worker()
      const results = (features.nodes || []);
      const geoJSON = {
        type: 'FeatureCollection',
        features: results.map(f => {
          // Geometry field (in HEXEWKB format) - TODO: data format should not be hard-coded
          const wkb = f['wkbGeometry'];
          // Chop string into 2 character chunks, representing hex integers
          const hex = wkb.match(/.{2}/g);
          // Populate array of bytes with parsed hex values
          const bytes = hex.map(h => parseInt(h, 16));

          return {
            id: f['objectid'],
            type: 'Feature',
            properties: _.omit(f, ['wkbGeometry', '__typename']),
            geometry: wkx.Geometry.parse(new Buffer(bytes)).toGeoJSON()
          };
        })
      };

      // OK state
      return { features: geoJSON, refetch };
    }
  });
};

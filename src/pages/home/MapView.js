import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Map from '../../lib/fungi-ol3/Map';
import { Actions } from '../../state';

const MapView = ({ basemaps, layers, center, zoom, onMove }) => {
  return (
    <Map
      style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: -1 }}
      basemaps={basemaps}
      layers={layers}
      center={center}
      zoom={zoom}
      onMove={onMove}
    />
  );
};

export default connect(
  state => ({
    basemaps: state.basemaps,
    layers: state.layers
  }),
  dispatch => ({
    ...bindActionCreators(Actions, dispatch)
  })
)(MapView);

import React from 'react';

class FeatureSource extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      nextProps.onLoading && nextProps.onLoading(nextProps.features);
    } else if (nextProps.error) {
      nextProps.onError && nextProps.onError(nextProps.error);
    } else if (nextProps.features && nextProps.features !== this.props.features) {
      nextProps.onLoaded && nextProps.onLoaded(nextProps.features);
    }
  }

  render() {
    return null;
  }
}

export default FeatureSource;

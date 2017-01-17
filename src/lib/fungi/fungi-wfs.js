import React from 'react';
import _ from 'lodash';

export default ({ srid, url }) => {
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

        const extent = nextProps.geom;  // .coordinates[0];

        const params = {
          srsname: `EPSG:${srid || 3857}`,
          bbox: `${extent.join(',')},EPSG:${srid || 3857}`,
          outputformat: 'json'
        };

        const qs = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        const requestUrl = `${url}&${qs}`;

        fetch(requestUrl)
          .then(response => response.json())
          .then((data) => {
            this.setState({ loading: false, features: data, error: undefined })
          })
          .catch(error => {
            console.error(error);

            this.setState({ loading: false, error, features: undefined });
          });
      }

      render() {
        return <WrappedComponent {...this.props} {...this.state } />;
      }
    }

    return Source;    
  }
};

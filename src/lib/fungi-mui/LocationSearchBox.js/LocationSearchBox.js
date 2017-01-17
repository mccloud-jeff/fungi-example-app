import React from 'react';
import ReactDOM from 'react-dom';
import SearchBox from './SearchBox';

export default class LocationSearchBox extends React.Component {
  componentWillMount() {
    // TODO: Just do this kind of stuff with LESS and webpack, or some React CSS library (Radium?)
    this.cssStyle = `
      .pac-container {
        width: 75% !important;
        max-width: 480px !important;
      }

      .pac-container:after {
        background-image: none;
      }

      .pac-item {
        padding: 0.5em;
      }

      .pac-item,
      .pac-item * {
        font-size: 16px;
        font-family: inherit;
      }

      .pac-matched {
        padding-left: 2px;
        padding-right: 2px;
        background-color: #FFECB3 !important;
        color: #666666;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.19), 0 6px 30px rgba(0, 0, 0, 0.23);
        font-size: 110%;
        font-weight: bold;
        line-height: normal;
      }
      `;
  }

  componentWillReceiveProps(nextProps) {
    if (typeof google === 'undefined') {
      console.warn('Google Places was not initialized. LocationSearchBox will not function.');
      return;
    }

    //if (!_.isEqual(nextProps.extent, this.props.extent)) {
      this.initAutoComplete();
    //}
  }

  initAutoComplete() {
    const that = this;
    const { extent, onPlaceChanged } = this.props;
    const { LatLng, LatLngBounds, places } = google.maps;

    let options;

    if (extent) {
      options = {
        bounds: new LatLngBounds(
          new LatLng(extent[1], extent[0]),
          new LatLng(extent[3], extent[2])
        )/*,
        componentRestrictions: { country: 'us' }*/
      };
    }

    const input = ReactDOM.findDOMNode(this.refs.locationSearch).getElementsByTagName('input')[0];
    input.setAttribute('placeholder', '');

    if (!input._autocomplete) {
      input._autocomplete = new places.Autocomplete(input, options);

      input._autocomplete.addListener('place_changed', function () {
        onPlaceChanged && onPlaceChanged(this.getPlace());
      });
    } else {
      options && options.bounds && input._autocomplete.setBounds(options.bounds);
    }
  }

  render() {
    return (
      <span>
        <style dangerouslySetInnerHTML={{ __html: this.cssStyle }}/>
        <SearchBox ref="locationSearch" hintText="Search nearby" {...this.props} />
      </span>
    );
  }
}

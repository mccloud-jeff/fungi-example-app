const TEST_BASEMAPS = {
  bingAerial: {
    type: 'BingMaps',
    imagerySet: 'aerial',
    apiKey: 'AqXMIrjIH6Ve-4HvZJGwdjIg9A3fIorY3GA7cmYASsZSUNVJxRHOL22KzrqZOdF9',
    visible: false
  },
  bingRoad: {
    type: 'BingMaps',
    imagerySet: 'road',
    apiKey: 'AqXMIrjIH6Ve-4HvZJGwdjIg9A3fIorY3GA7cmYASsZSUNVJxRHOL22KzrqZOdF9',
    visible: false
  },
  osm: {
    type: 'OSM',
    visible: false
  },
  topo: {
    type: 'XYZ',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    visible: true
  }
};

const TEST_LAYERS = {
  // airports: {
  //   // source: fungi.graphql({ id: 'airports', fields: ['objectid', 'airportCo', 'wkbGeometry']}),
  //   source: {
  //     type: 'graphql',
  //     id: 'airports',
  //     fields: ['objectid', 'airportCo', 'wkbGeometry'],
  //     srid: 26904
  //   },
  //   style: [
  //     { fill: { color: '#cd5c5c', opacity: 0.6 }, stroke: { color: '#ffffff', width: 1 } },
  //     { text: { fill: { color: '#FFFFFF' }, text: '${airportCo}', font: 'normal 18px Roboto' } }
  //   ]
  // },
  // farmersMarkets: {
  //   // source: fungi.graphql({ id: 'airports', fields: ['objectid', 'airportCo', 'wkbGeometry']}),
  //   source: {
  //     type: 'graphql',
  //     id: 'farmersMarkets',
  //     fields: ['objectid', 'wkbGeometry'],
  //     srid: 26904
  //   },
  //   style: [
  //     { image: { fill: { color: '#2E7D32', opacity: 0.9 }, type: 'Circle', radius: 16 } },
  //     { text: { fill: { color: '#FFFFFF' }, text: '', font: 'normal 18px FontAwesome' } }
  //   ]
  // },
  Hotpin: {
    visible: true,
    source: {
      type: 'arcgis',
      url: 'https://services1.arcgis.com/CHRAD8xHGZXuIQsJ/ArcGIS/rest/services/Hotpin/FeatureServer/0'
    },
    // "style": [
    //   {
    //     "image": { "fill": { "color": "#F44336", "opacity": 0.9 }, "type": "Circle", "radius": 16 }
    //   },
    //   {
    //     "text": { "fill": { "color": "#FFFFFF" }, "text": "", "font": "normal 18px FontAwesome" }
    //   }
    // ]
  },
  CalFireData: {
    visible: true,
    source: {
      type: 'arcgis',
      url: 'https://services.arcgis.com/QJfoC7c7Z2icolha/ArcGIS/rest/services/CalFireData/FeatureServer/0',
    }
  },
  test: {
    visible: true,
    source: {
      type: 'wfs',
      srid: 4326,
      url: 'http://www.ga.gov.au/geophysics-rockpropertypub-gws/ga_rock_properties_wfs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ga_rock_properties_wfs:remanent_magnetisation&maxFeatures=50',
    }
  }  
};

const initialState = {
  basemaps: TEST_BASEMAPS,
  layers: TEST_LAYERS,
  leftDrawer: { open: false },
  rightDrawer: { open: false }
};

// Members of the state that should be remembered across browser vists
export const appStateKeys = [];
// Members of the state that should be remembered in this browser session only
export const sessionStateKeys = ['token'];

// Reducer
export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case 'LOGIN':
      if (payload.error) {
        return { ...state, loginError: payload.error.message };
      } else if (payload.response) {
        return { ...state, token: payload.response };
      } else {
        // Logging in...
        return state;
      }

    case 'LEFT_DRAWER_TOGGLE':
      return {
        ...state,
        leftDrawer: { ...state.leftDrawer, open: state.leftDrawer && !state.leftDrawer.open }
      };

    case 'RIGHT_DRAWER_TOGGLE':
      return {
        ...state,
        rightDrawer: { ...state.rightDrawer, open: state.rightDrawer && !state.rightDrawer.open }
      };

    default:
      return state;
  }
}

// Actions
export const Actions = {
  login({ username, password }) {
    return dispatch => {
      dispatch({ type: 'LOGIN', payload: { username, password } });

      const bytes = username.trim() + ':' + password.trim();
      // const encoded = base64.encode(bytes);

      // TEMP:
      return new Promise((resolve, reject) => {
        dispatch({ type: 'LOGIN', payload: { response: 'TOTALLY_VALID_TOKEN' } })

        resolve();
      });

      // return fetch(
      //   "https://api.github.com/authorizations",
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': 'Basic ' + encoded,
      //       'User-Agent': 'GitHub Issue Browser',
      //       'Content-Type': 'application/json; charset=utf-8',
      //       'Accept': 'application/vnd.github.inertia-preview+json'
      //     },
      //     body: JSON.stringify({
      //       'client_id': githubClientId,
      //       'client_secret': githubClientSecret,
      //       'scopes': ['user', 'repo'],
      //       'note': 'not abuse'
      //     })
      //   })
      //   .then(response => response.json())
      //   .then(response => {
      //     if (!response.token) {
      //       return dispatch({ type: 'LOGIN', payload: { error: response } })
      //     } else {
      //       return dispatch({ type: 'LOGIN', payload: { response: response.token } })
      //     }
      //   });
    }
  },
  leftDrawerToggle() {
    return {
      type: 'LEFT_DRAWER_TOGGLE',
      payload: null
    };
  },
  rightDrawerToggle() {
    return {
      type: 'RIGHT_DRAWER_TOGGLE',
      payload: null
    };
  }
}

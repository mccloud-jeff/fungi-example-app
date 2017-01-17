import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import Page from './components/Page';
import Home from './pages/home';
import Login from './pages/login';
import Explore from './pages/explore';
import Detail from './pages/detail';
import configureStore from './state/configureStore';
import { Actions } from './state';

const store = configureStore();

const networkInterface = createNetworkInterface('http://192.168.0.9:3000/graphql');

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    //const TOKEN = store.getState().token;

    //req.options.headers.authorization = `Bearer ${TOKEN}`;

    next();
  }
}]);

const client = new ApolloClient({
  networkInterface,
});

const App = () => {
  const requireLogin = (nextState, replace, cb) => {
    const isAuthLoaded = () => {
      const state = store.getState();

      return !!state.token;
    };

    if (!isAuthLoaded(store)) {
      replace('/login');
    }

    cb && cb();
  };

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path='/' component={Page}>
            <Route path='login' component={Login} />
            <IndexRoute component={Home} onEnter={requireLogin} />
            <Route path="/" component={Home} onEnter={requireLogin}>
              <Route path='explore(/:coords)' component={Explore} />
              <Route path='detail' component={Detail} />
              <Route path=':coords' component={Home} />
            </Route>
          </Route>
        </Router>
      </Provider>
    </ApolloProvider>
  );
}

export default App;

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import persistSession from 'redux-sessionstorage';
import reducer, { appStateKeys, sessionStateKeys } from '../state';

const enhancers = [];
const middleware = [thunk];

if (typeof window !== 'undefined') {
  // Persist portions of Redux state to localStorage
  enhancers.push(persistState(appStateKeys, { key: '__APP_STATE__' }));
  // Persist portions of Redux state to sessionStorage
  enhancers.push(persistSession(sessionStateKeys, { key: '__SESSION_STATE__' }));

  // Developer tools
  // if (__DEVELOPMENT__) {
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
      enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    } else {
      middleware.push(require('redux-logger')())
    }
  // }
}

// Middleware must be first enhancer
enhancers.splice(0, 0, applyMiddleware.apply(null, middleware));

// Combine enhancers
const enhancer = compose.apply(null, enhancers);

export default (preloadedState) => createStore(reducer, preloadedState, enhancer);

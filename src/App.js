import { hot } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';
import React from 'react';

import { PersistGate } from 'redux-persist/integration/react';

import { init } from 'utils';
import AppRouter from 'routes/AppRouter';

import './App.scss';

function App() {
  const { store, history, persistor } = init();

  return (
    <ReduxProvider store={store}>
      {/* <PersistGate loading={<div>Loading</div>} persistor={persistor}> */}
      <Router history={history}>
        <AppRouter history={history} />
      </Router>
      {/* </PersistGate> */}
    </ReduxProvider>
  );
}

export default hot(module)(App);

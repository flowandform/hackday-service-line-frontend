import { configureStore } from 'store';
import * as History from 'history';
import { persistStore } from 'redux-persist';
import Api from 'api';
import * as Models from 'models';

const conf = __CONF__;

let history = null;
let store = null;
let persistor = null;

export default function() {
  if (!store) {
    store = configureStore();
    persistor = persistStore(store);
  }
  if (!history) {
    history = History.createBrowserHistory();
  }

  Api.setOptions({
    hostUrl: conf.api.baseUrl,
    authenticationPath: 'token',
    accountPath: 'accounts/get_my_account',
    accountConfirmPath: 'accounts/confirm_registration',
  });

  Api.setModels(Models);

  return { store, history, persistor };
}

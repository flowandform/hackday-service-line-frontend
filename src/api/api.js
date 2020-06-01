import { serialize, deserialize } from './JSONSerialization';

import {
  preFetchAction,
  successAction,
  errorAction,
  postFetchAction,
} from './actions';

import * as calls from './calls';
import * as reducers from './reducers';

let apiUUIDCounter = 0;

let options = {
  hostUrl: '',
  authenticationPath: '',
  accountPath: '',
  accountConfirmPath: '',
  default: {
    perPage: 200,
  },
  fetchOptions: {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  },
};

let Models = {};

const apiCallActions = {
  onSuccess(body, dispatch) {}, // eslint-disable-line no-unused-vars
  onError(e, dispatch) {}, // eslint-disable-line no-unused-vars
  onFinal(dispatch) {}, // eslint-disable-line no-unused-vars
};

let apiCalls = {
  ...calls,
};

const api = {
  fetch(...params) {
    return window.fetch(...params);
  },
  setHostUrl(url) {
    options.hostUrl = url;
  },
  setAuthenticationPath(path) {
    options.authenticationPath = path;
  },
  setAccountPath(path) {
    options.accountPath = path;
  },
  getOptions() {
    return options;
  },
  setOptions(opts) {
    options = { ...options, ...opts };
  },
  getReducers() {
    return reducers;
  },
  getCalls() {
    return apiCalls;
  },
  registerCalls(newCalls) {
    apiCalls = {
      ...apiCalls,
      ...newCalls,
    };
  },
  setAuthorizationToken(token) {
    if (options.token !== token) {
      options.token = token;
      options.fetchOptions.headers = {
        ...options.fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  },
  resetAuthorizationToken() {
    if (options.fetchOptions.headers.Authorization) {
      delete options.fetchOptions.headers.Authorization;
    }

    if (options.token) {
      delete options.token;
    }
  },
  setModels(models) {
    Models = models;
  },
  serialize(model) {
    return JSON.stringify(serialize(model, Models));
  },
  deserialize(response) {
    return deserialize(response);
  },
  apiCall(stateOpts, url, fetchOpts, actions, skipSerialization) {
    const act = { ...apiCallActions, ...actions };
    apiUUIDCounter += 1;
    const uuid = apiUUIDCounter;

    return async dispatch => {
      dispatch(
        preFetchAction(stateOpts.name, stateOpts.methodName, stateOpts.id, uuid)
      );

      await this.fetch(url, fetchOpts)
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            return res.json();
          }
          if (res.status > 201 && res.status < 300) {
            return {};
          }

          if (res.status >= 400) {
            return Promise.reject(
              new Error(`Request error (status code ${res.status.toString()})`)
            );
          }

          return res;
        })
        .then(body => (skipSerialization ? body : this.deserialize(body)))
        .then(body => {
          dispatch(
            successAction(
              stateOpts.name,
              stateOpts.methodName,
              body,
              stateOpts.id,
              uuid
            )
          );
          return body;
        })
        .then(b => act.onSuccess(b, dispatch))
        .catch(e => {
          dispatch(
            errorAction(
              stateOpts.name,
              stateOpts.methodName,
              e,
              stateOpts.id,
              uuid
            )
          );
          return e;
        })
        .catch(e => act.onError(e, dispatch));

      act.onFinal(dispatch);
      dispatch(
        postFetchAction(
          stateOpts.name,
          stateOpts.methodName,
          stateOpts.id,
          uuid
        )
      );
    };
  },
};

export default api;

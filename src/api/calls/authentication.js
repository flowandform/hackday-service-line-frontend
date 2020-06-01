import i from 'inflection';
import { generateFixedURL } from './utils';
import {
  authLogInAction,
  authLogOutAction,
  authAccountAction,
} from '../actions';

export function authenticate({ api, promise }, model, opts) {
  console.log('authenticate', { api, promise }, model, opts);
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'POST' };
  // fo.body = api.serialize(model);
  fo.body = JSON.stringify(model);
  console.log(fo);
  return api.apiCall(
    {
      methodName: 'post',
      name: 'Authentication',
    },
    generateFixedURL(o.hostUrl, o.authenticationPath),
    fo,
    {
      onSuccess(body, dispatch) {
        console.log(body);
        api.setAuthorizationToken(body.jwt);
        dispatch(authLogInAction(body.jwt, ''));

        promise.resolve();
      },
      onError(e) {
        promise.reject(e);
      },
    },
    true
  );
}

export function deauthenticate({ api, promise }) {
  return dispatch => {
    api.resetAuthorizationToken();

    dispatch(authLogOutAction());

    promise.resolve();
  };
}

export function getAuthAccount({ api, promise }, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'GET' };

  return api.apiCall(
    {
      methodName: 'get',
      name: 'AuthAccount',
    },
    generateFixedURL(o.hostUrl, o.accountPath),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch(authAccountAction(body));
        promise.resolve(body.data.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

export function confirmRegistration({ api, promise }, model, opts) {
  const o = { ...api.getOptions(), ...opts };
  const fo = { ...o.fetchOptions, method: 'PATCH' };
  fo.body = api.serialize(model);

  return api.apiCall(
    {
      methodName: 'post',
      name: i.camelize(model.type),
    },
    generateFixedURL(o.hostUrl, o.accountConfirmPath),
    fo,
    {
      onSuccess(body, dispatch) {
        dispatch({
          type: `UPSERT_${model.type.toUpperCase()}`,
          payload: body,
        });

        promise.resolve(body?.data?.id);
      },
      onError(e) {
        promise.reject(e);
      },
    }
  );
}

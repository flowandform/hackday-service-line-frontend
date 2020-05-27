export function preFetchAction(name, action, id, uuid) {
  return {
    type: 'API_START',
    payload: {
      name,
      action,
      id,
      uuid,
    },
  };
}

export function successAction(name, action, body, id, uuid) {
  return {
    type: 'API_SUCCESS',
    payload: {
      name,
      action,
      data: body.meta,
      id,
      uuid,
    },
  };
}

export function errorAction(name, action, error, id, uuid) {
  return {
    type: 'API_ERROR',
    payload: {
      name,
      action,
      error,
      id,
      uuid,
    },
  };
}

export function postFetchAction(name, action, id, uuid) {
  return {
    type: 'API_FINISH',
    payload: {
      name,
      action,
      id,
      uuid,
    },
  };
}

export function authLogInAction(token, refreshToken) {
  return {
    type: 'AUTH_LOG_IN',
    payload: {
      token,
      refreshToken,
    },
  };
}

export function authLogOutAction() {
  return {
    type: 'AUTH_LOG_OUT',
  };
}

export function authAccountAction(account) {
  return {
    type: 'AUTH_ACCOUNT',
    payload: {
      account,
    },
  };
}

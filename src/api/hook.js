import { useDispatch, useSelector } from 'react-redux';
import api from './api';

export function useApi() {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth.isLoggedIn);
  const authToken = useSelector(state => state.auth.token);

  if (authState) {
    api.setAuthorizationToken(authToken);
  }

  return Object.entries(api.getCalls()).reduce((res, [key, value]) => {
    return {
      ...res,
      [key]: (...params) => {
        return new Promise((resolve, reject) => {
          const arg = {
            api,
            promise: {
              resolve,
              reject,
            },
          };
          dispatch(value(arg, ...params));
        });
      },
    };
  }, {});
}

const initAuthState = {
  isLoggedIn: false,
};

export function auth(state = initAuthState, action) {
  switch (action.type) {
    case 'AUTH_LOG_IN':
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    case 'AUTH_LOG_OUT':
      return {
        ...state,
        isLoggedIn: false,
        token: '',
        refreshToken: '',
        account: undefined,
      };
    case 'AUTH_ACCOUNT':
      return {
        ...state,
        account: action.payload.account.data,
      };
    case 'AUTH_EXPIRED':
      return {
        ...state,
      };
    default:
      return state;
  }
}

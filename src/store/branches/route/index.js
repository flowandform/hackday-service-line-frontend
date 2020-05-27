const initRouterState = {};

export function router(state = initRouterState, action) {
  switch (action.type) {
    case 'ROUTE_TRANSITION':
      return {
        ...state,
        lastRoute: state.currentRoute,
        lastRouteParams: state.currentRouteParams,
        currentRoute: action.payload.route,
        currentRouteParams: action.payload.params,
      };
    case 'ROUTE_REDIRECT':
      return {
        ...state,
        currentRoute: action.payload.route,
        currentRouteParams: action.payload.params,
      };
    default:
      return state;
  }
}

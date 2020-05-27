import { useHistory, useLocation } from 'react-router';
import { routes } from 'routes/routes';
import { useDispatch, useSelector } from 'react-redux';

const paramReg = /:\w+/gi;

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function generateURL(location, ...params) {
  if (location && typeof location !== 'string') {
    const { path } = location;
    if (path) {
      const ar = path.split(paramReg);
      const count = path.match(paramReg)?.length;
      return ar.reduce(
        (acc, pp, index) =>
          acc +
          pp +
          ((index < count && params[index] && params[index].toString()) || ''),
        ''
      );
    }

    return '';
  }

  return location;
}

function to(history, dispatch, location, ...params) {
  dispatch({
    type: 'ROUTE_TRANSITION',
    payload: {
      route: location.key,
      params,
    },
  });
  history.push(generateURL(location, ...params));
}

function replace(history, dispatch, location, ...params) {
  dispatch({
    type: 'ROUTE_REDIRECT',
    payload: {
      route: location.key,
      params,
    },
  });
  history.replace(generateURL(location, ...params));
}

export function useRouter() {
  const history = useHistory();
  const dispatch = useDispatch();

  const lastRoute = useSelector(state => {
    return {
      route: state.router.lastRoute,
      params: state.router.lastRoutePrams,
    };
  });

  const currentRoute = useSelector(state => {
    return {
      route: state.router.currentRoute,
      params: state.router.currentRoutePrams,
    };
  });

  return {
    transitionTo: to.bind(this, history, dispatch),
    redirectTo: replace.bind(this, history, dispatch),
    currentRoute,
    lastRoute,
    routes,
  };
}

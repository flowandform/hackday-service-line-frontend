import React, { memo, useEffect } from 'react';
import { Switch, Route, matchPath } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import layoutConfig from './routes';

function AppRouter({ history }) {
  const dispatch = useDispatch();

  // Preload current path into redux after inital page loaad
  useEffect(() => {
    const layout = layoutConfig.find(l => {
      return (
        matchPath(history.location.pathname, {
          path: l.path,
          exact: l.exact,
        }) !== null
      );
    });

    const route = layout?.routes.find(r => {
      return (
        matchPath(history.location.pathname, {
          path: r.path,
          exact: r.exact,
        }) !== null
      );
    });

    if (route) {
      const routeResult = matchPath(history.location.pathname, {
        path: route.path,
        exact: route.exact,
      });

      dispatch({
        type: 'ROUTE_TRANSITION',
        payload: {
          route: route.key,
          params: routeResult.params,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch>
      {layoutConfig.map(layout => (
        <Route
          key={layout.key}
          exact={layout.exact}
          path={layout.path}
          render={props => (
            <layout.layoutComponent
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              routes={layout.routes}
              defaultComponents={layout.defaultComponents}
            />
          )}
        />
      ))}
    </Switch>
  );
}

AppRouter.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }),
};

AppRouter.defaultProps = {
  history: { location: { pathname: '/' } },
};

export default memo(AppRouter);

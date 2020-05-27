import React, { memo, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useRouter } from 'router';

function Authenticated({ defaultComponents, routes }) {
  const authState = useSelector(state => state.auth.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    if (!authState) {
      router.redirectTo(router.routes.login);
    }
  }, [router, authState]);

  return (
    <div>
      <header>
        <Switch>
          {routes.map(route => (
            <Route
              key={route.key}
              exact={route.exact}
              path={route.path}
              component={route.components.header || defaultComponents.header}
            />
          ))}
        </Switch>
      </header>
      <main>
        <div className="page-container">
          <Switch>
            {routes.map(route => (
              <Route
                key={route.key}
                exact={route.exact}
                path={route.path}
                component={route.components.main || defaultComponents.main}
              />
            ))}
          </Switch>
        </div>
      </main>
    </div>
  );
}

Authenticated.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      path: PropTypes.string,
      exact: PropTypes.bool,
      components: PropTypes.object.isRequired,
    })
  ).isRequired,
  defaultComponents: PropTypes.objectOf(PropTypes.object).isRequired,
};

Authenticated.defaultProps = {};

export default memo(Authenticated);

// add components instead of component to route, which is passed to a Layout type object. Add layouts to match for layout types.

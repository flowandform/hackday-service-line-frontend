import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

function Public({ defaultComponents, routes }) {
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

Public.propTypes = {
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

Public.defaultProps = {};

export default memo(Public);

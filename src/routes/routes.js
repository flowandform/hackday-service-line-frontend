/* eslint-disable import/no-extraneous-dependencies */

import SharedHeader from './routeComponents/Shared/Header/Header';
import Shared404 from './routeComponents/Shared/Page404/Page404';

import PublicLayout from './layouts/Public/Public';
import AuthenticatedLayout from './layouts/Authenticated/Authenticated';

const authPath = 'auth';

// keys of layouts and routes MUST BE UNIQUE
// Routes have to have a path with the exception of a 404
const layoutConfig = [
  {
    key: 'auth',
    layoutComponent: AuthenticatedLayout,
    path: `/${authPath}`,
    defaultComponents: {
      header: SharedHeader,
      main: Shared404,
    },
    routes: [
      {
        key: 'home',
        path: `/${authPath}`,
        exact: true,
        components: {
          main: Shared404,
        },
      },
      {
        key: '404',
        path: `/${authPath}`,
        components: {},
      },
    ],
  },
  {
    key: 'public',
    layoutComponent: PublicLayout,
    path: '/',
    defaultComponents: {
      header: SharedHeader,
      main: Shared404,
    },
    routes: [
      {
        key: 'login',
        path: '/',
        exact: true,
        components: {
          main: Shared404,
        },
      },
      {
        key: '404',
        components: {},
      },
    ],
  },
];

export default layoutConfig;
export const routes = layoutConfig.reduce((lyacc, layout) => {
  return {
    ...lyacc,
    ...layout.routes.reduce((rtacc, route) => {
      return { ...rtacc, [route.key]: route };
    }, {}),
  };
}, {});

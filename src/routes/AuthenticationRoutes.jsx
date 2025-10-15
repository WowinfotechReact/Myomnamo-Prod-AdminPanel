import React from 'react';
import { lazy } from 'react';

// project imports
import Loadable from 'component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import Logout from './LogoutRoute';

const AuthLogin = Loadable(lazy(() => import('../views/Login')));

const LogoutRoute = Loadable(lazy(() => import('./LogoutRoute')));


// ==============================|| AUTHENTICATION ROUTES ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <AuthLogin />
    },
    {
      path: '/logout',
      element: <Logout />
    },

  ]
};

export default AuthenticationRoutes;

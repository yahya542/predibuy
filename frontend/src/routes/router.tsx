import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router';
import paths, { rootPaths } from './paths';

import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
import Signin from 'pages/authentication/Signin';
import Signup from 'pages/authentication/Signup';
import Error404 from 'pages/Error404';
import RequireAuth from 'pages/RequireAuth';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const Prediction = lazy(() => import('pages/Prediction'));
const History = lazy(() => import('pages/History'));
const Admin = lazy(() => import('pages/Admin'));
const DatasetAnalysis = lazy(() => import('pages/DatasetAnalysis'));
const ModelTrees = lazy(() => import('pages/ModelTrees'));

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: paths.prediction,
            element: (
              <RequireAuth>
                <Prediction />
              </RequireAuth>
            ),
          },
          {
            path: paths.history,
            element: (
              <RequireAuth>
                <History />
              </RequireAuth>
            ),
          },
          {
            path: paths.admin,
            element: (
              <RequireAuth>
                <Admin />
              </RequireAuth>
            ),
          },
          {
            path: paths.datasetAnalysis,
            element: (
              <RequireAuth>
                <DatasetAnalysis />
              </RequireAuth>
            ),
          },
          {
            path: paths.modelTrees,
            element: (
              <RequireAuth>
                <ModelTrees />
              </RequireAuth>
            ),
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        ),
        children: [
          {
            path: paths.signin,
            element: <Signin />,
          },
          {
            path: paths.signup,
            element: <Signup />,
          },
        ],
      },
      {
        path: '*',
        element: <Error404 />,
      },
    ],
  },
]);

export default router;

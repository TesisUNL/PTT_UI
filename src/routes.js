import { Navigate, useRoutes, Outlet } from 'react-router-dom';
// layouts
import PropTypes  from 'prop-types';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import { useAuth } from './hooks/useAuth';

// ----------------------------------------------------------------------

ProtectedRoute.propTypes = {
  role: PropTypes.string,
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};

// https://www.robinwieruch.de/react-router-private-routes/
function ProtectedRoute ({
  role,
  redirectPath = '/login',
  children,
}) {
  const { user } = useAuth();
  if (user && ( !role || role && user?.role?.toLoweCase().equals(role))) {
    return children || <Outlet />;
  }
    return <Navigate to={redirectPath} replace />;
  }


const LoginRoute = () => {
  const { user } = useAuth();

  if (!user) return <Login />;
  return <Navigate to="/dashboard/app" />;
};

export default function Router() {

  return useRoutes([
    {
      path: '/dashboard',
      element: <ProtectedRoute children={<DashboardLayout/>}/>,
      children: [ 
        { path: 'app', element:  <DashboardApp /> },
        { path: 'user', element: <User/> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: 'login',
      element: <LoginRoute />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

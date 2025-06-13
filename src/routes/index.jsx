import Layout from 'components/Layout/Layout';
import FullPageLoader from 'components/Shared/FullPageLoader';
import { useAuth } from 'Context/authContext';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { routesList } from './RoutesList';

function CustomRoutes() {
  const { authUser, isGlobalLoading } = useAuth();

  const blocked = authUser?.uid && authUser.role === 'Blocked';
  const emailNotVerified =
    authUser &&
    authUser.role === 'Authorized' &&
    (!authUser.isEmailVerified || !authUser.emailVerified);

  const notVerifiedByAdmin =
    authUser &&
    authUser.role === 'Authorized' &&
    authUser.emailVerified &&
    authUser.isEmailVerified &&
    !authUser.isVerified;

  const authorized =
    authUser.uid &&
    authUser.role === 'Authorized' &&
    authUser.emailVerified &&
    authUser.isEmailVerified &&
    authUser.isVerified;

  const admin =
    authUser.uid &&
    authUser.role === 'Admin' &&
    authUser.emailVerified &&
    authUser.isEmailVerified &&
    authUser.isVerified;

  // const unAuthorized = !authUser.uid;

  // const unAuthorized =
  //   (authUser.uid && !authUser.isEmailVerified) ||
  //   !authUser.uid ||
  //   !authUser.emailVerified ||
  //   !authUser.role === 'Blocked';
  // const unVerified =
  //   authUser.uid && !authUser.isVerified && authUser.isEmailVerified; // email is verified, admin is not yet verified from portal

  const result = blocked
    ? 'blocked'
    : emailNotVerified
    ? 'emailNotVerified'
    : notVerifiedByAdmin
    ? 'notVerifiedByAdmin'
    : admin
    ? 'admin'
    : authorized
    ? 'authorized'
    : 'unAuthorized';

  return isGlobalLoading ? (
    <FullPageLoader />
  ) : (
    <ReactRoutes>
      {routesList[result]?.map((item) => (
        <Route
          key={item.path}
          path={item.path}
          element={
            <Layout withLayout={item.withLayout}>{item.renderer()}</Layout>
          }
        />
      ))}
    </ReactRoutes>
  );
}

export default CustomRoutes;

import React from 'react';
import Login from 'pages/Login';
import Signup from 'pages/Signup/Signup';
import UserProfile from 'pages/Profile/Components/UserProfile';
import UnVerifiedUser from 'pages/UnVerified';
import UserAttendance from 'pages/Attendance/Components/UserAttendance';
import AdminAttendance from 'pages/Attendance/Components/AdminAttendance';
import AdminPayroll from 'pages/Payroll/Components/AdminPayroll';
import PageNotFound from 'pages/PageNotFound/PageNotFound';
import Test from 'pages/Test';
import UserDashboard from 'pages/Dashboard/UserDashboard';
import ManageUsers from 'pages/ManageUsers/ManageUsers';
import AdminDashboard from 'pages/Dashboard/AdminDashboard';
import AdminPayslip from 'pages/Payslip/AdminPayslip';
import EditPayroll from 'pages/EditPayroll';
import UserPayslip from 'pages/Payslip/UserPayslip';
import UserLeaves from 'pages/Leave/UserLeaves';
import AdminLeaves from 'pages/Leave/AdminLeaves';
import Blocked from 'pages/Blocked';
import Verify from 'pages/Verify';
import VerifyEmail from 'pages/VerifyEmail';
import ChangePassword from 'pages/Login/Components/ChangePassword';


const blocked = [
  {
    path: '*',
    renderer: (params = {}) => <Blocked {...params} />,
    withLayout: false,
  },
];

const emailNotVerified = [
  // {
  //   path: '/',
  //   renderer: (params = {}) => <Login {...params} />,
  //   withLayout: false,
  // },
  {
    path: '/verify/:email',
    renderer: (params = {}) => <Verify {...params} />,
    withLayout: false,
  },
  {
    path: '/verifyEmail',
    renderer: (params = {}) => <VerifyEmail {...params} />,
    withLayout: false,
  },
  {
    path: '*',
    renderer: (params = {}) => <VerifyEmail {...params} />,
    withLayout: false,
  },
];

const notVerifiedByAdmin = [
  {
    path: '/',
    renderer: (params = {}) => <UnVerifiedUser {...params} />,
    withLayout: true,
  },
  {
    path: '/signup',
    renderer: (params = {}) => <Signup {...params} />,
    withLayout: false,
  },
  {
    path: '/profile',
    renderer: (params = {}) => <UserProfile {...params} />,
    withLayout: true,
  },
  {
    path: '*',
    renderer: (params = {}) => <UnVerifiedUser {...params} />,
    withLayout: true,
  },
];

const authorizedGlobalRoutes = [
  {
    path: '/profile',
    renderer: (params = {}) => <UserProfile {...params} />,
    withLayout: true,
  },
  {
    path: '/test',
    renderer: (params = {}) => <Test {...params} />,
    withLayout: true,
  },
  {
    path: '/un-authorized',
    renderer: (params = {}) => <UnVerifiedUser {...params} />,
    withLayout: true,
  },
  {
    path: '/not-found',
    renderer: (params = {}) => <PageNotFound {...params} />,
    withLayout: false,
  },
  {
    path: '*',
    renderer: (params = {}) => <PageNotFound {...params} />,
    withLayout: false,
  },
 
];

const adminRoutes = [
  {
    path: '/',
    renderer: (params = {}) => <AdminDashboard />,
    withLayout: true,
  },
  {
    path: '/dashboard',
    renderer: (params = {}) => <AdminDashboard />,
    withLayout: true,
  },
  {
    path: '/attendance',
    renderer: (params = {}) => <AdminAttendance />,
    withLayout: true,
  },
  {
    path: '/manage-payroll',
    // renderer: (params = {}) => <Payslip {...params} />,
    renderer: (params = {}) => <AdminPayroll {...params} />,
    withLayout: true,
  },
  {
    path: '/edit-payroll',
    // renderer: (params = {}) => <Payslip {...params} />,
    renderer: (params = {}) => <EditPayroll {...params} />,
    withLayout: true,
  },
  {
    path: '/payslip',
    renderer: (params = {}) => <AdminPayslip {...params} />,
    withLayout: true,
  },
  {
    path: '/manage-users',
    renderer: (params = {}) => <ManageUsers {...params} />,
    // renderer: (params = {}) => <AdminPayroll {...params} />,
    withLayout: true,
  },
  {
    path: '/leave-report',
    renderer: (params = {}) => <AdminLeaves />,
    withLayout: true,
  },
  ...authorizedGlobalRoutes,
];

const authorizedUserRoutes = [
  {
    path: '/',
    renderer: (params = {}) => <UserDashboard />,
    withLayout: true,
  },
  {
    path: '/dashboard',
    renderer: (params = {}) => <UserDashboard />,
    withLayout: true,
  },
  // {
  //   path: '/',
  //   renderer: (params = {}) => (
  //     <Navigate to="/dashboard">
  //       <UserDashboard />
  //     </Navigate>
  //   ),
  //   withLayout: true,
  // },
  {
    path: '/attendance',
    renderer: (params = {}) => <UserAttendance />,
    withLayout: true,
  },
  {
    path: '/leave-report',
    renderer: (params = {}) => <UserLeaves />,
    withLayout: true,
  },

  {
    path: '/payslip',
    renderer: (params = {}) => <UserPayslip {...params} />,
    withLayout: true,
  },
  ...authorizedGlobalRoutes,
];

const unAuthorized = [
  {
    path: '/',
    renderer: (params = {}) => <Login {...params} />,
    withLayout: false,
  },
  {
    path: '/changePassword',
    renderer: (params = {}) => <ChangePassword {...params} />,
    withLayout: false,
  },
  {
    path: '/signup',
    renderer: (params = {}) => <Signup {...params} />,
    withLayout: false,
  },
  {
    path: '/verify/:email',
    renderer: (params = {}) => <Verify {...params} />,
    withLayout: false,
  },
  {
    path: '/verifyEmail',
    renderer: (params = {}) => <VerifyEmail {...params} />,
    withLayout: false,
  },
  {
    path: '*',
    renderer: (params = {}) => <Login {...params} />,
    withLayout: false,
  },
];

export const routesList = {
  blocked: blocked,
  emailNotVerified: emailNotVerified,
  notVerifiedByAdmin: notVerifiedByAdmin,
  admin: adminRoutes,
  authorized: authorizedUserRoutes,
  unAuthorized: unAuthorized,
};

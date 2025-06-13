export const Months = [
  'Month',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const actionCodeSettings = {
  // url: 'http://localhost:3000/dashboard',
  url: 'https://smart-attendance-fyp.firebaseapp.com',
  handleCodeInApp: true,
};

export const ValidCheckedInStatuses = ['BreakedIn', 'BreakedOut', 'CheckedIn'];
export const validRoles = ['Authorized', 'Admin'];
export const PasswordResetSuccess =
  'Password reset successfull, Your are being redirected to change password screen.';
export const PasswordResetFailed =
  'Password reset Failed, Your are being redirected to our website.';

export const EmailVerificationSuccess =
  'Your Email is successfully verified, Your are being redirected to our website.';
export const EmailVerificationFailed =
  'Email verification failed, Your are being redirected to our website.';

// const dev = 'https://3jcl4u9yo3.execute-api.us-east-1.amazonaws.com/dev';
const dev = 'http://localhost:4000';
const stag = 'https://3jcl4u9yo3.execute-api.us-east-1.amazonaws.com/dev';
const prod = 'https://3rtybwhi99.execute-api.us-east-1.amazonaws.com/prod';

export const baseURL =
  window.location.hostname.split(':')[0] === 'localhost' ||
  window.location.hostname.includes('192')
    ? stag
    : window.location.origin === 'https://smart-attendance-fyp.firebaseapp.com'
    ? stag
    : prod;

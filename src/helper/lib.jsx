import dayjs from 'dayjs';
import { child, get, onValue, ref, update } from 'firebase/database';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { auth, db, dbRef, getStorageRef } from '../firebase';
import {
  applyActionCode,
  confirmPasswordReset,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from 'firebase/auth';
import axios from 'axios';

let utc = require('dayjs/plugin/utc');
let timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.guess();
dayjs.extend(customParseFormat);
dayjs.extend(duration);

const options = {
  method: 'GET',
  url: 'https://o88g4yqla9.execute-api.us-east-1.amazonaws.com/default/cy-current-time',
};
export const errorPrettier = (error) => {
  if (error.message.includes('auth/user-not-found')) {
    return 'User not found';
  } else if (error.message.includes('auth/email-already-in-use')) {
    return 'Email is already in use.';
  } else if (error.message.includes('auth/expired-action-code')) {
    return 'Link is expired.';
  } else if (error.message.includes('auth/invalid-action-code')) {
    return 'Invalid URL.';
  } else if (error.message.includes('auth/wrong-password')) {
    return 'Wrong credentials.';
  } else if (error.message.includes('auth/too-many-requests')) {
    return 'Too many request, Please try after 5 minutes, if issue still persist then contact your Administrator.';
  } else if (error.message.includes('auth/invalid-email')) {
    return 'Invalid email address.';
  } else if (error.message.includes('auth/network-request-failed')) {
    return 'Internet issue! Make sure you have active internet connection.';
  } else return String(error?.message) || 'Something went wrong!';
};

export const getCurrentUserData = async (
  setState,
  otherUserDetails,
  loadingCallBack,
  setDBUnSub,
  uuid,
) => {
  try {
    const UID = uuid || auth.currentUser?.uid;
    const dbRef = ref(db, `Users/${UID}`);

    const unsubscribe = await onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        setState({
          ...data,
          ...otherUserDetails,
          // isEmailVerified: otherUserDetails.emailVerified,
        });
        loadingCallBack?.(false);
      } else {
        loadingCallBack?.(false);
      }
    });
    setDBUnSub({ unSub: unsubscribe });
  } catch (error) {
    return { success: false, user: null, error };
  }
};

export const getAttendance = ({ month, year, uid, specificYear }) => {
  try {
    const UID = uid || auth.currentUser?.uid;
    const dbPath = specificYear
      ? `Attendance/${UID}/${specificYear}`
      : `Attendance/${UID}/${year}/${month}`;

    return get(child(dbRef, dbPath)).then((snapshot) => {
      return { success: true, data: snapshot.val() || [] };
    });
  } catch (error) {
    return { success: false, error };
  }
};

export const getAllUsersList = async (setState, setAllUsersError) => {
  try {
    const dbRef = ref(db, 'Users/');

    await onValue(dbRef, (snapshot) => {
      setState(Object.values(snapshot.val()));
    });
  } catch (error) {
    setAllUsersError(error);
    return { success: false, allUsers: [], error };
  }
};

export const uploadToStorage = async (image, uid) => {
  const UID = uid || auth.currentUser?.uid;
  const storageRefPath = `profilePictures/${UID}/profilePic`;
  const storageRef = getStorageRef(storageRefPath);
  if (typeof image !== 'object') return;
  try {
    return await uploadBytes(storageRef, image)
      .then(() => {
        return getDownloadURL(storageRef)
          .then((url) => {
            return { success: true, url: url };
          })
          .catch((error) => {
            return { success: false, url: '', error };
          });
      })
      .catch((err) => {
        return { success: false, url: '', error: err };
      });
  } catch (error) {
    return { success: false, url: '', error };
  }
};

export const updateUserData = async (updates) => {
  try {
    if (!updates) return;
    const updatedData = await update(ref(db), updates);
    return { success: true, data: updatedData };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const FormatedDateTime = (date) => {
  return date ? dayjs(date).format('DD-MMM-YYYY, hh:mm A') : '-';
};

export const FormatedDateTimeSecond = (date) => {
  return date ? dayjs(date).format('DD-MMM-YYYY, hh:mm:ss A') : '-';
};

export const FormatedTime = (time) => {
  return time ? new Date(Number(time)).toLocaleTimeString() : '-';
};

export const YearHelper = async (setYearList) => {
  let max = new Date().getFullYear();
  let min = max - 4;
  let years = [];

  for (let i = max; i >= min; i--) {
    years.push(i);
  }
  return setYearList(years);
};

export const VerifyUser = async (UID, cyUserId) => {
  if (!UID) return { error: 'UID is required' };

  try {
    await update(ref(db, `Users/${UID}`), {
      isVerified: true,
      employeeId: cyUserId,
    });
    return { success: true, isVerified: true };
  } catch (error) {
    return { error: error, success: false };
  }
};

export const UpdateUserRole = async (UID, userRole) => {
  if (!UID) return { error: 'UID is required' };

  try {
    await update(ref(db, `Users/${UID}`), {
      role: userRole,
    });
    return { success: true, role: userRole };
  } catch (error) {
    return { error: error, success: false };
  }
};


export const VerifyEmailVerification = async (actionCode) => {
  try {
    if (!auth?.currentUser?.uid) {
      return {
        isEmailVerified: false,
        error: { message: 'User is not loggedin!' },
        success: false,
      };
    }
    // We can't use async await, because if the error occurs in the api it will go on catch and we can not update database as we do not have any status of api call in try block
    return applyActionCode(auth, String(actionCode))
      .then(async (res) => {
        return update(ref(db, `Users/${auth.currentUser.uid}`), {
          isEmailVerified: true,
        })
          .then((updateRes) => {
            return {
              success: true,
              isEmailVerified: true,
              dbUpdateResponse: updateRes,
              actionCodeRes: res,
              error: '',
            };
          })
          .catch((updateError) => {
            return {
              isEmailVerified: false,
              error: updateError,
              success: false,
            };
          });
      })
      .catch((err) => {
        return { isEmailVerified: false, error: err, success: false };
      });
  } catch (error) {
    console.log('error is ', error);
    return { isEmailVerified: false, error, success: false };
  }
};

export const SendEmailVerificationLink = async (user) => {
  try {
    const response = await sendEmailVerification(auth.currentUser);
    return { response: response, success: true };
  } catch (error) {
    return { error: error, success: false };
  }
};

export const SendPasswordResetEmailLink = async (email) => {
  try {
    const response = await sendPasswordResetEmail(auth, email);
    return { response: response, success: true };
  } catch (error) {
    return { error: error, success: false };
  }
};

export const VerifyPasswordReset = async (actionCode) => {
  try {
    const response = await verifyPasswordResetCode(auth, actionCode);

    return {
      changePassword: true,
      response,
      success: true,
    };
  } catch (error) {
    return { changePassword: false, error, success: false };
  }
};

export const ConfirmPasswordReset = async (actionCode, newPassword) => {
  try {
    const response = await confirmPasswordReset(auth, actionCode, newPassword);
    return {
      response,
      success: true,
    };
  } catch (error) {
    return { error, success: false };
  }
};

export const UpdateEmailVerificationStatus = async () => {
  try {
    await update(ref(db, `Users/${auth.currentUser.uid}`), {
      isEmailVerified: true,
    });
    return { success: true, isEmailVerified: true };
  } catch (error) {
    return { error, success: false };
  }
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export const MiliSecondsFormatter = (milliseconds, showOnlyHours) => {
  let seconds = Number(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let onlyHours = Math.floor(Math.floor(Number(milliseconds / 1000) / 60) / 60);

  // seconds = seconds % 60;
  // 👇️ if seconds are greater than 30, round minutes up (optional)
  // minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;

  // 👇️ If you don't want to roll hours over, e.g. 24 to 00
  // 👇️ comment (or remove) the line below
  // commenting next line gets you `24:00:00` instead of `00:00:00`
  // or `36:15:31` instead of `12:15:31`, etc.
  hours = hours % 24;
  // let formatedDay = `${days} days - ${hours} hours - ${minutes} minutes`;
  let formatedHours = `${hours} hours - ${minutes} minutes`;
  let formatedMinutes = `${minutes} minutes`;
  return showOnlyHours && onlyHours > 0
    ? `${onlyHours} Hours & ${formatedMinutes}`
    : !!hours
    ? formatedHours
    : !!minutes
    ? formatedMinutes
    : '-';
};

export const getRowHeight = () => {
  return 70;
};

export const UpdateMotivationCount = async ({ authUser }) => {
  try {
    const UID = authUser.uid;
    const response = await update(ref(db, `Users/${UID}`), {
      motivationCount: !authUser.motivationCount
        ? 1
        : authUser.motivationCount + 1,
    });
    return { response, success: true };
  } catch (error) {
    console.log('error is ', error);
    return { error, success: false };
  }
};

export const NumberFormatter = (value) =>
  value ? new Intl.NumberFormat('en-PK').format(value) : '-';

export const UpdatePayrollData = async (uid, data) => {
  try {
    if (!uid || !data) return;
    const response = await update(ref(db, `Users/${uid}/payroll`), data);
    return { response, success: true };
  } catch (error) {
    console.log('error is ', error);
    return { error, success: false };
  }
};

export const GetSelectedUserPayroll = async (
  uid,
  year,
  setState,
  loadingCallback,
  setErrorState,
) => {
  try {
    if (!uid || !year) return;

    const dbRef = ref(db, `Payroll/${uid}/${year}`);

    await onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setState(Object.values(snapshot.val()));
        loadingCallback?.(false);
      } else {
        setErrorState?.('No record found!');
        setState([]);
        loadingCallback?.(false);
      }
    });
  } catch (error) {
    setErrorState?.('Error while fetching records!');
    loadingCallback?.(false);
    return { success: false, allUsers: [], error };
  }
};

export const GetBusinessDays = (propsDate) => {
  const currentMonth = new Date(propsDate).getMonth();
  let sundayCount = 0;

  for (let i = 1; i <= dayjs(propsDate).daysInMonth(); i++) {
    const date = dayjs(propsDate).date(i);
    if (date.day() === 0 && date.month() === currentMonth) {
      sundayCount++;
    }
  }

  return dayjs(propsDate).daysInMonth() - sundayCount;
};

export function getWorkingDaysInMonth(currentMonth, workingDaysPerWeek) {
  const startDate = dayjs(currentMonth).startOf('month');
  const endDate = dayjs(currentMonth).endOf('month');
  const workingDays = [];

  for (let date = startDate; date <= endDate; date = date.add(1, 'day')) {
    if (date.day() >= 1 && date.day() <= 5) {
      // Assuming Monday to Friday are working days
      if (workingDays.length < workingDaysPerWeek) {
        workingDays.push(date.format('YYYY-MM-DD'));
      }
    }
  }

  return workingDays;
}

export const SaveEvent = async (userName, event, isAdmin) => {
  const serverTime = await serverDateHelper();

  const year = dayjs(serverTime).year();
  const month = dayjs(serverTime).month();
  const userIp = await getUserIpAddress();
  const userPlatform = getUserPlatform();
  const time = FormatedDateTimeSecond(dayjs(serverTime));
  const browser = getUserBrowser();
  let formatedEvent = `${
    isAdmin ? 'UPDATED BY ADMIN: ' : ''
  } ${userName} ${event} at: ${time} from browser: ${browser} : ${userPlatform}, IPV4: ${userIp}`;
  try {
    if (!event || !userName) return;

    const dbRef = ref(db, `Events/${year}/${month}/`);

    const updatedData = await update(dbRef, {
      [serverTime]: formatedEvent,
    });
    return { success: true, data: updatedData };
  } catch (error) {
    return { success: false, data: null, error };
  }
};

export const getUserIpAddress = async () => {
  const res = await axios.get('https://geolocation-db.com/json/');
  return res.data.IPv4;
};

export const getUserPlatform = () => navigator.platform;

export const getUserBrowser = () => {
  let ua = window.navigator.userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
};

export const getUserActivities = async (
  setState,
  loadingCallBack,
  cancelSubscription,
) => {
  try {
    const serverTime = await serverDateHelper();

    const currentYear = dayjs(serverTime).year();
    const currentMonth = dayjs(serverTime).month();
    const dbRef = ref(db, `Events/${currentYear}/${currentMonth}`);
    const unSub = await onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        setState(data);
        loadingCallBack?.(false);
      } else {
        loadingCallBack?.(false);
      }
    });
    cancelSubscription({ cancel: unSub });
  } catch (error) {
    return { success: false, user: null, error };
  }
};

export const serverDateHelper = () => {
  return axios
    .request(options)
    .then(async function (response) {
      let rowServerDate = await response?.data;
      const formatedServerDate = Number(
        dayjs(rowServerDate?.ios?.split('Z')[0]).add(5, 'hours'),
      );
      return formatedServerDate;
    })
    .catch((error) => {
      throw error;
    });
};

export const getSelectedUserPayrollFormat = async (uid) => {
  try {
    return await get(child(dbRef, `Users/${uid}/payroll`)).then((snapshot) => {
      return { success: true, data: snapshot.val() || [] };
    });
  } catch (error) {
    return { success: false, error };
  }
};

export const getUniqueArray = (arr1, arr2) => {
  const uniqueArr1 = arr1?.filter(
    (obj) => !arr2?.find((o) => JSON.stringify(o) === JSON.stringify(obj)),
  );
  return uniqueArr1;
};

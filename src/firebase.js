// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as FBStorageRef } from 'firebase/storage';
import { getDatabase, ref as FireBaseDBRef } from 'firebase/database';

// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnN2u0RADFtg65beDHjzGRX-ERZ4FpfgI",
  authDomain: "smart-attendance-fyp.firebaseapp.com",
  projectId: "smart-attendance-fyp",
  storageBucket: "smart-attendance-fyp.firebasestorage.app",
  messagingSenderId: "42298092977",
  appId: "1:42298092977:web:496729d12d6f750ff32190",
  measurementId: "G-R32D15E2ZE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseInitialize);

// creates different instances of firebase utilities
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const dbRef = FireBaseDBRef(db); // for `get(child())` methodss

export const getStorageRef = (storageRefPath) => {
  return FBStorageRef(storage, storageRefPath);
};

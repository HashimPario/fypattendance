import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import { getCurrentUserData } from 'helper/lib';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<any>({});
  const [isGlobalLoading, setGlobalLoading] = useState(true);
  const [dbUnSub, setDBUnSub] = useState<any>();

  const clear = () => {
    dbUnSub?.unSub();
    setAuthUser({});
    setGlobalLoading(false);
  };

  const authStateChanged: any = async (user: User) => {
    setGlobalLoading(true);

    if (!user) {
      clear();
      setGlobalLoading(false);
      return;
    }
    await getCurrentUserData(setAuthUser, user, setGlobalLoading, setDBUnSub);
  };

  const updateAuthUser = (values: any) => {
    setAuthUser({
      ...values,
    });
  };
  const logout = async () => {
    setGlobalLoading(true);
    return await signOut(auth)
      .then(clear)
      .catch((err) => console.log('error on signout ', err));
  };

  // Listen for Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, [authUser?.presenceStatus]);

  return {
    authUser,
    isGlobalLoading,
    logout,
    updateAuthUser,
  };
}

type UserObject = {
  uid: number;
  role: string;
  firstName: string;
  designation: string;
  profilePicture: string;
  presenceStatus: string;
  lastCheckedIn: string;
};
type state = {
  authUser: UserObject | {} | any;
  isGlobalLoading?: boolean;
  logout: () => {};
  updateAuthUser?: (e: any) => void;
};

const initialState: state = {
  authUser: {},
  isGlobalLoading: true,
  logout: async () => { },
  updateAuthUser: async (e) => { },
};
const AuthUserContext = createContext(initialState);

type Props = {
  children: React.ReactNode;
};

export function AuthUserProvider({ children }: Props) {
  const auth = useFirebaseAuth();
  return (
    <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => useContext(AuthUserContext);

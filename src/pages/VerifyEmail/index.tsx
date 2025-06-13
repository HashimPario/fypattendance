import React, { useEffect, useState } from 'react';
import { Box, FormControl, Text, useToast } from '@chakra-ui/react';
import Logo from 'components/Shared/Logo';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { IoLogInOutline } from 'react-icons/io5';
import { useAuth } from 'Context/authContext';
import {
  errorPrettier,
  SendEmailVerificationLink,
  VerifyEmailVerification,
} from 'helper/lib';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsHourglassSplit } from 'react-icons/bs';
import CountDown from 'components/CountDown';
import { EmailVerificationSuccess } from 'helper/constants';
import Loader from 'components/Shared/Loader';

const VerifyEmail = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, logout, isGlobalLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const HandleResendEmail = async () => {
    setIsLoading(true);
    setTimer(10);
    setTimeout(() => {
      setTimer(0);
    }, 10000); // 1 minute - 60*1000
    const data = await SendEmailVerificationLink();
    if (data.error) {
      toast({
        title: errorPrettier(data.error),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: `Email Verification link sent to ${authUser.email}. Your are being redirected to login page.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
    setIsLoading(false);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  useEffect(() => {
    if (!authUser?.email || !state?.actionCode || !state?.email) {
      navigate('/', {
        state: { email: state?.email, actionCode: state?.actionCode },
      });
    }
    if (authUser?.email && state?.email && authUser?.email !== state?.email) {
      toast({
        title: 'Wrong email verification code!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, []);
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);

  const [emailVerificationFullLoader, setEmailVerificationFullLoader] =
    useState(false);
  const HandleVerifyUser = async () => {
    setEmailVerificationLoading(true);
    const data = await VerifyEmailVerification(state?.actionCode);

    if (!data) {
      return navigate('/');
    }

    if (data.isEmailVerified) {
      setEmailVerificationFullLoader(true);
      toast({
        title: EmailVerificationSuccess,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => {
        // setEmailVerificationFullLoader(false);
        navigate('/dashboard');
        window.location.reload();
      }, 1000);
    }
    if (data.error) {
      toast({
        title:
          errorPrettier(data.error) +
          ' You are being redirected to our website.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    setEmailVerificationLoading(false);
  };

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setTimer(10);
    setTimeout(() => {
      setTimer(0);
    }, 10000); // 1 minute - 60*1000
    return () => {
      setTimer(0);
    };
  }, []);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const LogoutHandler = () => {
    setLogoutLoading(true);
    logout?.();
    setLogoutLoading(false);
  };

  return isGlobalLoading || emailVerificationFullLoader ? (
    <Loader />
  ) : (
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={400}>
      <FormControl>
        <Logo styleProps={{ mb: 5 }} />
        <Text
          as="b"
          color={'gray.400'}
          sx={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          mb={2}
        >
          {authUser?.email && `You are logged in as: ${authUser?.email}`}
        </Text>

        {authUser?.email && !state?.email && (
          <Text color={'gray'} fontWeight={'bold'} textAlign={'center'}>
            Email Verification link has been sent to your registered
            email,Kindly check your email in spam / junk.
          </Text>
        )}

        {authUser?.uid && (
          <CustomButton
            text="Logout"
            rightIcon={<IoLogInOutline />}
            buttonStyleProps={{ marginBottom: 5, marginTop: 3 }}
            isLoading={logoutLoading}
            disabled={isLoading || logoutLoading}
            onClick={LogoutHandler}
          />
        )}

        {console.log(authUser, "authUser")}
        {console.log(state, "state")}

        {authUser?.email === state?.email && (
          <CustomButton
            text="Click to verify your account"
            rightIcon={<IoLogInOutline />}
            buttonStyleProps={{ marginBottom: 5 }}
            disabled={authUser?.email !== state?.email || isLoading}
            isLoading={isLoading || emailVerificationLoading || logoutLoading}
            onClick={HandleVerifyUser}
          />
        )}

        {authUser?.uid &&
          (!authUser.emailVerified || !authUser.isEmailVerified) && (
            <CustomButton
              text="Resend email verification link"
              rightIcon={<IoLogInOutline />}
              isLoading={isLoading}
              onClick={HandleResendEmail}
              disabled={!!timer}
              rightComponent={
                !!timer && (
                  <>
                    &nbsp;
                    <BsHourglassSplit />
                    &nbsp;
                    <CountDown minutes={timer} />
                  </>
                )
              }
            />
          )}
      </FormControl>
    </Box>
  );
};

export default VerifyEmail;

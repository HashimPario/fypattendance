import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputRightElement,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { IoLogInOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginSchema } from 'Schema';
import { LoginFormInputs } from 'Types';
import { yupResolver } from '@hookform/resolvers/yup';
import ResetPassword from './Components/ResetPassword';
import Logo from 'components/Shared/Logo';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import CustomLink from 'components/Shared/FormControls/CustomLink';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { errorPrettier, SaveEvent } from 'helper/lib';
import { auth } from '../../firebase';
import { useAuth } from 'Context/authContext';
import { validRoles } from 'helper/constants';
import Loader from 'components/Shared/Loader';

const Login = () => {
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { state } = useLocation();
  const toast = useToast();

  const handleClick = () => setShow(!show);
  let navigate = useNavigate();
  const { authUser, isGlobalLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  // const [error, setError] = useState('');
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      if (data.email && data.password) {
        setIsLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        SaveEvent(userCredential.user.email, 'Loggedin');
        // if (!userCredential || !authUser.role) return;
        // if (authUser.role === 'Blocked') {
        //   setIsLoading(false);
        //   setError('You are blocked, Kindly contact your administrator');
        // }
        // if (userCredential?.user?.emailVerified !== authUser.isEmailVerified) {
        //   await UpdateEmailVerificationStatus();
        // }

        if (!userCredential.user.emailVerified) {
          setIsLoading(false);
          return navigate('/verifyEmail', {
            state: { email: state?.email, actionCode: state?.actionCode },
          });
        }

        // if (
        //   !!authUser.role &&
        //   (authUser.role === 'Authorized' || authUser.role === 'Admin') &&
        //   userCredential.user.emailVerified
        // ) {
        setIsLoading(false);
        toast({
          title: 'Logged in Successfully',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        return navigate('/dashboard');
        // }
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: errorPrettier(error),
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    if (
      validRoles.includes(authUser.role) &&
      authUser.emailVerified &&
      authUser.role !== 'Blocked'
    ) {
      toast({
        title: 'Logged in Successfully',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
      return navigate('/dashboard');
    }
  }, [authUser.uid]);

  return isGlobalLoading ? (
    <Loader />
  ) : (
    
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={400}>
      <ResetPassword
        showForgotPassModal={showForgotPassModal}
        setShowForgotPassModal={setShowForgotPassModal}
      />
       
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <FormControl>
         
          <Logo styleProps={{ mb: 5 }} />
          <Stack spacing={3}>
            {state?.email && (
              <Text
                textAlign={'center'}
                fontSize={25}
                fontWeight={'bold'}
                color={'gray.400'}
              >
                Login to continue
              </Text>
            )}

            <CustomInput
              id={'email'}
              placeholder="Email"
              register={{ ...register('email') }}
              error={errors.email?.message}
              autoFocus={true}
            />

            <CustomInput
              id={'password'}
              placeholder="Password"
              register={{ ...register('password') }}
              error={errors.password?.message}
              rightSideElement={
                <InputRightElement width="4.5rem" top={'24px'}>
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              }
              type={show ? 'text' : 'password'}
            />
          </Stack>
          <Box
            mt={1}
            mb={5}
            textAlign={'right'}
            sx={{ fontSize: { xxs:10,xs: 13, sm: 15, md: 15, lg: 15 } }}
          >
            <span onClick={() => setShowForgotPassModal(true)}>
              <CustomLink text="Forgot Password ?" />
            </span>
          </Box>

          <CustomButton
            text="Signin"
            rightIcon={<IoLogInOutline />}
            isLoading={isLoading}
            disabled={
              !!errors.email?.message || !!errors.password?.message
              // !!error.length
            }
          />
        </FormControl>
        <CustomLink
          text="Don't have an account ? Click to Signup"
          route="/signup"
          sx={{
            textAlign: 'center',
            display: 'block',
            mt: 2,
            fontSize: { xxs:10,xs: 13, sm: 15, md: 15, lg: 15 },
          }}
        />
      </form>
    </Box>
  );
};

export default Login;

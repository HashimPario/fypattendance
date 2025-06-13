// @ts-nocheck
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
  Stack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import { IoLogInOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Logo from 'components/Shared/Logo';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignupSchema } from 'Schema';
import { SignupFormInputs } from 'Types';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import CustomLink from 'components/Shared/FormControls/CustomLink';
import CustomRadio from 'components/Shared/FormControls/CustomRadio';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import {
  errorPrettier,
  SaveEvent,
  SendEmailVerificationLink,
} from 'helper/lib';
import { useAuth } from 'Context/authContext';
import { auth, db } from '../../firebase';
import dayjs from 'dayjs';
import { baseURL } from 'helper/constants';
import axios from 'axios';
import FullPageLoader from 'components/Shared/FullPageLoader';

const Signup = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const today = new Date().toISOString();
  const { logout } = useAuth();
  const [fullPageLoader, setFullPageLoader] = useState(false);
  const handleClick = (value: string) => {
    const hander: any = {
      password: setPasswordShow,
      confirmPassword: setConfirmPasswordShow,
    };
    hander[value]?.((prev: boolean) => !prev);
  };
  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormInputs) => {
    if (data.email && data.password) {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
          const UID = auth.currentUser?.uid;
          setFullPageLoader(true);
          let formatedData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            DOB: data.DOB,
            uid: UID,
            role: 'Authorized',
            accountCreatedOn: today,
            isVerified: false,
            isEmailVerified: false,
          };

          SaveEvent(userCredential.user.email, 'Signed up');
          await set(ref(db, 'Users/' + UID), {
            ...formatedData,
            fullName: `${data.firstName} ${data.lastName}`,
            designation: 'New User',
            motivationCount: 0,
            workingDays: 6,
            payroll: {
              earnings: {
                'Basic Salary': '',
                Bonus: '',
                'Over Time': '',
              },
              deductions: {
                'Tax Deduction': '',
                PF: '',
                Loan: '',
              },
              netSalary: 0,
            },
          });

          await updateProfile(userCredential.user, {
            displayName: `${data.firstName} ${data.lastName}`,
          });

          await SendEmailVerificationLink(userCredential)
            .then((res) => {
              if (res.success) {
                toast({
                  title: `Signup Successfull, Email verification link sent to ${data.email}`,
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                  position: 'top-right',
                });
                navigate('/verifyEmail');
                setIsLoading(false);
              } else {
                toast({
                  title: `Signup is Successfull, Email verification link is failed to be sent on ${data.email}`,
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                  position: 'top-right',
                });
                navigate('/');
                setIsLoading(false);
              }
            })
            .catch((error) => {
              setIsLoading(false);
              console.error(error.message);
            });

          await axios
            .post(`${baseURL}/signup`, formatedData)
            .then((result) => {})
            .catch((err) => {
              toast({
                title: `Failed to send notification to admin about new signup!`,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
              });
            });
        })
        .catch((error) => {
          toast({
            title: errorPrettier(error),
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: 'top-right',
          });
          setIsLoading(false);
        });
      setFullPageLoader(false);
    }
  };
  const [customSM] = useMediaQuery('(max-width: 380px)');
  return fullPageLoader ? (
    <FullPageLoader />
  ) : (
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={500}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={false}>
          <Logo styleProps={{ mb: 5 }} />

          <Stack spacing={3}>
            <CustomInput
              id={'firstName'}
              labelPlaceholder={'First Name'}
              placeholder="Muhammad"
              register={{ ...register('firstName') }}
              error={errors.firstName?.message}
            />
            <CustomInput
              id={'lastName'}
              labelPlaceholder={'Last Name'}
              placeholder="Hashim"
              register={{ ...register('lastName') }}
              error={errors.lastName?.message}
            />

            <CustomInput
              id={'email'}
              labelPlaceholder={'Email'}
              placeholder="hashimpario@gmail.com"
              register={{ ...register('email') }}
              error={errors.email?.message}
            />

            <CustomInput
              id={'phone'}
              type="number"
              labelPlaceholder={'Phone Number'}
              placeholder={'3332387765'}
              register={{ ...register('phone') }}
              error={errors.phone?.message}
              leftSideElement={
                <InputLeftElement top={'24px'} zIndex={0}>
                  <InputLeftAddon
                    children="+92"
                    position={'absolute'}
                    left={0}
                  />
                </InputLeftElement>
              }
            />

            <CustomRadio
              label={'Gender'}
              values={customSM ? ['M', 'F', 'O'] : ['Male', 'Female', 'Other']}
              register={{ ...register('gender') }}
              error={errors.gender?.message}
            />
            <Box mt={8} mb={8}>
              <CustomInput
                type="date"
                id="DOB"
                restInputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                placeholder="Date of birth"
                register={{ ...register('DOB') }}
                error={errors.DOB?.message}
              />
            </Box>
            <CustomInput
              id={'password'}
              placeholder="Password"
              trigger={trigger}
              register={{ ...register('password') }}
              error={errors.password?.message}
              rightSideElement={
                <InputRightElement width="4.5rem" top={'24px'}>
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleClick('password')}
                  >
                    {passwordShow ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              }
              type={passwordShow ? 'text' : 'password'}
            />
            <CustomInput
              id={'confirmPassword'}
              trigger={trigger}
              placeholder="Confirm Password"
              register={{ ...register('confirmPassword') }}
              error={errors.confirmPassword?.message}
              rightSideElement={
                <InputRightElement width="4.5rem" top={'24px'}>
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleClick('confirmPassword')}
                  >
                    {confirmPasswordShow ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              }
              type={confirmPasswordShow ? 'text' : 'password'}
            />
          </Stack>
          <Box mt={5} mb={5}>
            <CustomLink text="Already have an account ?" route="/" />
          </Box>
          <CustomButton
            text="Signup"
            rightIcon={<IoLogInOutline />}
            isLoading={isLoading}
            disabled={!!Object.keys(errors)?.length}
          />
        </FormControl>
      </form>
    </Box>
  );
};

export default Signup;

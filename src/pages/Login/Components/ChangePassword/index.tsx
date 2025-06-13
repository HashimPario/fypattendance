import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { IoLogInOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { changePasswordSchema } from 'Schema';
import { ChangePasswordInput } from 'Types';
import { yupResolver } from '@hookform/resolvers/yup';
import Logo from 'components/Shared/Logo';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { ConfirmPasswordReset, errorPrettier } from 'helper/lib';
import { useAuth } from 'Context/authContext';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);

  const toast = useToast();
  let navigate = useNavigate();
  const { authUser } = useAuth();


  const handleClick = (value: string) => {
    const hander: any = {
      password: setPasswordShow,
      confirmPassword: setConfirmPasswordShow,
    };
    hander[value]?.((prev: boolean) => !prev);
  };


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: yupResolver(changePasswordSchema),
  });

  useEffect(() => {
    reset({
      email: authUser.changePasswordEmail || authUser.email,
      password: '',
      confirmPassword: '',
    });
  }, [authUser.uid]);


  const onSubmit = async (data: ChangePasswordInput) => {
    if (data?.email && data?.password) {
      setIsLoading(true);
      const response = await ConfirmPasswordReset(
        authUser.actionCode,
        data.password,
      );
      if (response.error) {
        toast({
          title: errorPrettier(response.error),
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        setIsLoading(false);
      } else {
        toast({
          title: 'Password changed successfully.',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/');
      }
    }
  };

  return (
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={400}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <Logo styleProps={{ mb: 5 }} />
          <Stack spacing={3} mb={4}>
            <CustomInput
              id={'email'}
              placeholder="Email"
              register={{ ...register('email') }}
              error={errors.email?.message}
              disable={true}
            />

            <CustomInput
              id={'password'}
              placeholder="New Password"
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

          <CustomButton
            text="Submit"
            rightIcon={<IoLogInOutline />}
            isLoading={isLoading}
            disabled={!!Object.keys(errors)?.length}
          />
        </FormControl>
      </form>
    </Box>
  );
};

export default ChangePassword;

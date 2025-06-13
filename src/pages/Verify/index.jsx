import React, { useEffect, useState } from 'react';
import { errorPrettier, VerifyPasswordReset } from 'helper/lib';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Text, useToast } from '@chakra-ui/react';
import Logo from 'components/Shared/Logo';
import { PasswordResetSuccess } from 'helper/constants';
import { useAuth } from 'Context/authContext';

function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { updateAuthUser } = useAuth();
  const params = useParams();

  const actionCode = searchParams.get('oobCode');
  const mode = searchParams.get('mode');
  const toast = useToast();

  const HandleResetPassword = async () => {
    const data = await VerifyPasswordReset(actionCode);
    if (!data) {
      return navigate('/');
    }
    if (data.changePassword) {
      updateAuthUser({
        changePasswordEmail: data.response, // change password email field is used to show email in change password screen
        actionCode: actionCode,
      });
      setSuccess(true);
      toast({
        title: PasswordResetSuccess,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
      setTimeout(() => {
        navigate('/changePassword');
      }, 2000);
    }
    if (data.error) {
      setSuccess(false);
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
    setLoading(false);
  };

  useEffect(() => {
    if (!mode || !params?.email || !actionCode) {
      navigate('/');
    } else if (mode === 'resetPassword') {
      HandleResetPassword();
    } else if (mode === 'verifyEmail') {
      navigate('/verifyEmail', { state: { email: params?.email, actionCode } });
    }
  }, []);

  const text = success ? 'Information Verified' : 'Verification Failed';
  return (
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={400}>
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
        {loading
          ? 'Validating Your information...'
          : `${text}, you are being redirected to our website.`}
      </Text>
    </Box>
  );
}

export default Verify;

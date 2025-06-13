import { Heading, Stack, Text, useToast } from '@chakra-ui/react';
import CustomModal from 'components/Shared/Modal';
import { useState } from 'react';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { useForm } from 'react-hook-form';
import { ResetPasswordEmail } from 'Types';
import { resetPasswordEmail } from 'Schema';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import { errorPrettier, SendPasswordResetEmailLink } from 'helper/lib';

type Props = {
  showForgotPassModal: any;
  setShowForgotPassModal: any;
};
const ResetPassword = (props: Props) => {
  const { showForgotPassModal, setShowForgotPassModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordEmail>({
    resolver: yupResolver(resetPasswordEmail),
  });

  const toast = useToast();
  const onSubmit = async (data: ResetPasswordEmail) => {
    if (data?.email) {
      setIsLoading(true);
      const response = await SendPasswordResetEmailLink(data.email);
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
          title: `Email verification code sent to your email ${data.email}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        setShowForgotPassModal(false);
      }
      setIsLoading(false);
    }
  };

  const ModalHeading = (
    <Heading lineHeight={1.1} fontSize={{ base: 'xl', md: '2xl' }}>
      Forgot your password?
    </Heading>
  );
  const ModalBodyContent = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} w={'full'} maxW={'100%'} rounded={'xl'}>
        <Text fontSize={{ base: 'sm', sm: 'md' }}>
          You&apos;ll get an email with a reset link
        </Text>

        <CustomInput
          id={'forgotEmail'}
          placeholder="Email"
          register={{ ...register('email') }}
          error={errors.email?.message}
        />
        <CustomButton text="Request Reset" isLoading={isLoading} />
      </Stack>
    </form>
  );
  return showForgotPassModal ? (
    <CustomModal
      openModal={showForgotPassModal}
      handleOpenModal={setShowForgotPassModal}
      modalHeading={ModalHeading}
      modalBodyContent={ModalBodyContent}
      modalFooterContent={<></>}
    />
  ) : (
    <></>
  );
};

export default ResetPassword;

import { Box, FormControl, Text } from '@chakra-ui/react';
import { IoLogInOutline } from 'react-icons/io5';
import Logo from 'components/Shared/Logo';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import Loader from 'components/Shared/Loader';
import { useAuth } from 'Context/authContext';
import CustomInput from 'components/Shared/FormControls/CustomInput';

const Blocked = () => {
  const { authUser, isGlobalLoading, logout } = useAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    logout();
  };
  return isGlobalLoading ? (
    <Loader />
  ) : (
    <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" width={400}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Logo styleProps={{ mb: 5 }} />

          <CustomInput
            id={'email'}
            placeholder="Email"
            defaultValue={authUser?.email}
            disable={true}
          />
        </FormControl>

        <Text
          as="b"
          mt={2}
          mb={2}
          color={'red.400'}
          sx={{
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          You are blocked, Kindly contact your administrator
        </Text>
        <CustomButton
          text="Logout"
          rightIcon={<IoLogInOutline />}
          // isLoading={isLoading}
          // disabled={
          //   !!errors.email?.message ||
          //   !!errors.password?.message ||
          //   !!error.length
          // }
        />
      </form>
    </Box>
  );
};

export default Blocked;

import { Box, Image } from '@chakra-ui/react';
import logo from 'assets/logo.png';

type Props = {
  styleProps?: Object;
};
const Logo = (props: Props) => {
  const { styleProps } = props;
  return (
    <Box display={'flex'} justifyContent={'center'} {...styleProps}>
      <Image src={logo} alt="Smart Attendance System Logo" width={130} />
    </Box>
  );
};

export default Logo;

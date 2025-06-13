import { ReactElement, ReactNode } from 'react';
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
} from '@chakra-ui/react';

import MobileNav from './AppHeader';
import Sidebar from './Sidebar';

type Props = {
  children: ReactNode;
  withLayout: boolean;
};
export default function Layout(props: Props): ReactElement {
  const { children, withLayout } = props || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const color = useColorModeValue('gray.100', 'gray.900');
  return withLayout ? (
    <Box minH="100vh" bg={color}>
      <Sidebar display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  ) : (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      maxWidth={1300}
      width={'100vw'}
      height={'auto'}
      minHeight={'100vh'}
      margin={'0 auto'}
      boxSizing={'border-box'}
      padding={'10px'}
    >
      {children}
    </Box>
  );
}

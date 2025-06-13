// import {
//   Box,
//   BoxProps,
//   CloseButton,
//   Flex,
//   FlexProps,
//   HStack,
//   Icon,
//   Link,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import Logo from 'components/Shared/Logo';
// import { Fragment } from 'react';
// import { IconType } from 'react-icons/lib';
// import { FiHome, FiTrendingUp, FiCompass } from 'react-icons/fi';
// import { useAuth } from 'Context/authContext';
// import CustomNavItem from './CustomNavItem';
// interface SidebarProps extends BoxProps {
//   onClose?: () => void;
// }

// interface LinkItemProps {
//   name: string;
//   icon: IconType;
//   path?: string;
//   isForAdmin?: boolean;
//   subMenu?: LinkItemProps[];
// }
// const LinkItems: Array<LinkItemProps> = [
//   { name: 'Dashboard', path: '/dashboard', icon: FiHome },
//   {
//     name: 'Manage Users',
//     path: '/manage-users',
//     icon: FiCompass,
//     isForAdmin: true,
//   },
//   {
//     name: 'Reports',
//     icon: FiTrendingUp,
//     subMenu: [
//       { name: 'Attendance report', path: '/attendance', icon: FiTrendingUp },
//       { name: 'Payslip report', path: '/payslip', icon: FiTrendingUp },
//       { name: 'Leave report', path: '/leave-report', icon: FiTrendingUp },
//     ],
//   },
//   {
//     name: 'Payroll',
//     icon: FiCompass,
//     isForAdmin: true,
//     subMenu: [
//       { name: 'Manage payroll', path: '/manage-payroll', icon: FiTrendingUp },
//       { name: 'Edit payroll', path: '/edit-payroll', icon: FiTrendingUp },
//     ],
//   },
// ];

// const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
//   const { authUser } = useAuth();
//   const userRole = authUser?.role;

//   return (
//     <Box
//       transition="3s ease"
//       bg={useColorModeValue('white', 'gray.900')}
//       borderRight="1px"
//       borderRightColor={useColorModeValue('gray.200', 'gray.700')}
//       w={{ base: 'full', md: 60 }}
//       pos="fixed"
//       h="full"
//       {...rest}
//     >
//       <HStack
//         width={'100%'}
//         padding={'0 20px 0 20px'}
//         justifyContent={{
//           xs: 'space-between',
//           sm: 'space-between',
//           lg: 'center',
//         }}
//       >
//         <Logo styleProps={{ mb: 5, mt: 3 }} />
//         <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
//       </HStack>
//       {LinkItems.filter(
//         (item) => !item.isForAdmin || (item.isForAdmin && userRole === 'Admin'),
//       ).map((link) => (
//         <Fragment key={link.name}>
//           <CustomNavItem link={link} onClose={onClose} />
//         </Fragment>
//       ))}
//     </Box>
//   );
// };

// interface NavItemProps extends FlexProps {
//   icon: IconType;
//   children: string;
//   isActive: boolean;
//   rightIcon?: IconType;
// }
// export const NavItem = ({
//   icon,
//   children,
//   isActive,
//   rightIcon,
//   ...rest
// }: NavItemProps) => {
//   return (
//     <Link
//       style={{ textDecoration: 'none' }}
//       _focus={{ bg: 'none' }}
//       _activeLink={{ bg: 'cyan.400', color: 'white' }}
//       _active={{ bg: 'cyan.400', color: 'white' }}
//     >
//       <Flex
//         align="center"
//         p="4"
//         mx="4"
//         borderRadius="lg"
//         role="group"
//         cursor="pointer"
//         bg={isActive ? 'cyan.400' : ''}
//         color={isActive ? 'white' : ''}
//         {...rest}
//       >
//         {icon && <Icon mr="4" fontSize="16" as={icon} />}

//         <Flex
//           justifyContent={'space-between'}
//           width={'100%'}
//           alignItems={'center'}
//         >
//           {children}
//           {rightIcon && <Icon mr="4" fontSize="16" as={rightIcon} />}
//         </Flex>
//       </Flex>
//     </Link>
//   );
// };

// export default Sidebar;







import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  FlexProps,
  HStack,
  Icon,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import Logo from 'components/Shared/Logo';
import { Fragment } from 'react';
import { IconType } from 'react-icons/lib';
import { FiHome, FiTrendingUp, FiCompass } from 'react-icons/fi';
import { useAuth } from 'Context/authContext';
import CustomNavItem from './CustomNavItem';
interface SidebarProps extends BoxProps {
  onClose?: () => void;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  path?: string;
  isForAdmin?: boolean;
  subMenu?: LinkItemProps[];
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', path: '/dashboard', icon: FiHome },
  {
    name: 'Manage Users',
    path: '/manage-users',
    icon: FiCompass,
    isForAdmin: true,
  },
  {
    name: 'Reports',
    icon: FiTrendingUp,
    subMenu: [
      { name: 'Attendance report', path: '/attendance', icon: FiTrendingUp },
      { name: 'Leave report', path: '/leave-report', icon: FiTrendingUp }
    ],
  },
];

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const { authUser } = useAuth();
  const userRole = authUser?.role;

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <HStack
        width={'100%'}
        padding={'0 20px 0 20px'}
        justifyContent={{
          xs: 'space-between',
          sm: 'space-between',
          lg: 'center',
        }}
      >
        <Logo styleProps={{ mb: 5, mt: 3 }} />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </HStack>
      {LinkItems.filter(
        (item) => !item.isForAdmin || (item.isForAdmin && userRole === 'Admin'),
      ).map((link) => (
        <Fragment key={link.name}>
          <CustomNavItem link={link} onClose={onClose} />
        </Fragment>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: string;
  isActive: boolean;
  rightIcon?: IconType;
}
export const NavItem = ({
  icon,
  children,
  isActive,
  rightIcon,
  ...rest
}: NavItemProps) => {
  return (
    <Link
      style={{ textDecoration: 'none' }}
      _focus={{ bg: 'none' }}
      _activeLink={{ bg: 'cyan.400', color: 'white' }}
      _active={{ bg: 'cyan.400', color: 'white' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'cyan.400' : ''}
        color={isActive ? 'white' : ''}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}

        <Flex
          justifyContent={'space-between'}
          width={'100%'}
          alignItems={'center'}
        >
          {children}
          {rightIcon && <Icon mr="4" fontSize="16" as={rightIcon} />}
        </Flex>
      </Flex>
    </Link>
  );
};

export default Sidebar;

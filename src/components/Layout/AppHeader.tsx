// @ts-nocheck
import {
  Avatar,
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack,
  useToast,
} from '@chakra-ui/react';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import CustomModal from 'components/Shared/Modal';
import { useAuth } from 'Context/authContext';
import dayjs from 'dayjs';
import { ref, set, update } from 'firebase/database';
import {
  errorPrettier,
  SaveEvent,
  serverDateHelper,
  UpdateMotivationCount,
} from 'helper/lib';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ValidCheckedInStatuses } from 'helper/constants';
import { auth, db } from '../../firebase';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const AppHeader = ({ onOpen, ...rest }: MobileProps) => {
  let navigate = useNavigate();

  const { authUser, logout } = useAuth();
  const { firstName, designation, profilePicture, presenceStatus } =
    authUser || {};

  const [checkOutConfirmation, setCheckOutConfirmation] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkin, setCheckin] = useState(
    !!presenceStatus && ValidCheckedInStatuses.includes(presenceStatus),
  );

  const UID = auth.currentUser?.uid;

  const [canCheckinToday, setCanCheckinToday] = useState(true);


  const SignoutHandler = async () => {
    logout();
    navigate('/');
  };
  const toast = useToast();
  const HandleCheckin = async () => {
    try {
      setCheckinLoading(true);
      const serverTime = await serverDateHelper();
      const today = dayjs(serverTime).format('DD-MMM-YYYY');
      const currentMonth = dayjs(serverTime).month();
      const currentYear = dayjs(serverTime).year();

      if (checkin) {
        setCheckinLoading(false);
        setCheckOutConfirmation(true);
        return;
      }
      SaveEvent(authUser.fullName, 'Checked in');
      await set(
        ref(db, `Attendance/${UID}/${currentYear}/${currentMonth}/${today}`),
        {
          checkedIn: serverTime,
        },
      );
      await update(ref(db, `Users/${UID}`), {
        presenceStatus: 'CheckedIn',
      });
      await update(ref(db, `Users/${UID}`), {
        lastCheckedIn: serverTime,
      });
      UpdateMotivationCount({ authUser });
      setCheckinLoading(false);
    } catch (error) {
      setCheckinLoading(false);
      toast({
        title: errorPrettier(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const CheckOutHandler = async () => {
    if (!checkin) return;
    setCheckinLoading(true);
    const today = dayjs(authUser?.lastCheckedIn).format('DD-MMM-YYYY');
    const currMonth = new Date(authUser?.lastCheckedIn).getMonth();
    const currYear = new Date(authUser?.lastCheckedIn).getFullYear();
    SaveEvent(authUser.fullName, 'Checked out');
    const serverTime = await serverDateHelper();
    await update(ref(db), {
      [`Attendance/${UID}/${currYear}/${currMonth}/${today}/checkedOut`]:
        serverTime,
    });

    await update(ref(db, `Users/${UID}`), {
      presenceStatus: 'CheckedOut',
    });
    setCheckOutConfirmation(false);
    setCheckinLoading(false);
  };

  // useEffect(() => {
  //   setCheckin(ValidCheckedInStatuses.includes(authUser.presenceStatus));
  // }, [authUser.presenceStatus]);


  useEffect(() => {
    const validateCheckinEligibility = async () => {
      if (!authUser?.lastCheckedIn) return;
  
      const serverTime = await serverDateHelper(); // get trusted time
      const today = dayjs(serverTime).format('DD-MMM-YYYY');
      const lastCheckinDate = dayjs(authUser.lastCheckedIn).format('DD-MMM-YYYY');
  
      // Disable if already checked out today
      if (lastCheckinDate === today && authUser.presenceStatus === 'CheckedOut') {
        setCanCheckinToday(false);
      } else {
        setCanCheckinToday(true);
      }
  
      setCheckin(ValidCheckedInStatuses.includes(authUser.presenceStatus));
    };
  
    validateCheckinEligibility();
  }, [authUser.presenceStatus, authUser.lastCheckedIn]);
  
  

  const isAuthorizedToCheckin =
    authUser.role === 'Authorized' && authUser.isVerified;
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack ml={3} width={'100%'} justifyContent={'space-between'}>
        <Text
          display={{ base: 'flex' }}
          fontSize={{ xs: 'md', sm: 'x-large', md: 'x-large', lg: '2xl',xl:'2xl' }}
          fontFamily="monospace"
          fontWeight="bold"
          textAlign={'center'}
        >
          Smart Attendance System
        </Text>

        <HStack spacing={{ base: '0', md: '6', sm: '4' }}>
          <Flex alignItems={'center'}>
            {isAuthorizedToCheckin && (
              <Button
                sx={{ fontSize: { lg: 17, md: 13, sm: 15, xs: 11 } }}
                onClick={HandleCheckin}
                mr={2}
                isLoading={checkinLoading}
                isDisabled={
                  checkinLoading || 
                  authUser.presenceStatus === 'BreakedIn' || 
                  !canCheckinToday
                }
                
                // isDisabled={
                //   checkinLoading || authUser.presenceStatus === 'BreakedIn'
                // }
              >
                {checkin ? 'Check out' : 'Check in'}
              </Button>
            )}{' '}
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
              >
                <HStack>
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                    width={'100%'}
                    maxWidth={'120px'}
                    minWidth={'min-content'}
                    wordBreak={'break-all'}
                  >
                    <Text fontSize="sm" whiteSpace={"nowrap"}>{firstName}</Text>
                    <Text fontSize="xs" color="gray.600" textAlign={'start'}>
                      {designation || 'New User'}
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={SignoutHandler}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          {checkOutConfirmation && (
            <CustomModal
              openModal={checkOutConfirmation}
              handleOpenModal={setCheckOutConfirmation}
              modalHeading={'Checkout'}
              modalBodyContent={<>Are you sure you want to checkout ?</>}
              modalFooterContent={
                <CustomButton
                  text="Yes"
                  onClick={CheckOutHandler}
                  isLoading={checkinLoading}
                />
              }
            />
          )}
        </HStack>
      </HStack>
    </Flex>
  );
};

export default AppHeader;

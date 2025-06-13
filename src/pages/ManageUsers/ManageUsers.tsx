import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import Staff from './Staff';
import { useEffect, useState } from 'react';
import {
  errorPrettier,
  getAllUsersList,
  UpdateUserRole,
  VerifyUser,
} from 'helper/lib';
import Loader from 'components/Shared/Loader';
import axios from 'axios';
import { baseURL } from 'helper/constants';

const ManageUsers = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refetchUsersList, setRefetchUsersList] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  useEffect(() => {
    getAllUsersList(setAllUsers).finally(() => {
      setLoading(false);
    });
  }, [refetchUsersList]);

  const headerStyle = { fontSize: { lg: 18, md: 18, sm: 17, xs: 12 } };

  const staffType = [
    'All Staff',
    'Active Staff',
    'Un-Verified Staff',
    'Blocked Staff',
    // 'Other Admins',
  ];

  type HandleCTAType = {
    key: string;
    value: string | boolean;
    uid: string;
    cyUserId?: string;
    gridapi?: any;
    userData?: any;
  };
  const toast = useToast();

  const HandleCTA = async ({
    key,
    value,
    uid,
    cyUserId,
    gridapi,
    userData,
  }: HandleCTAType) => {
    try {
      gridapi.current.api.showLoadingOverlay();
      if (key === 'verify') {
        setVerifyLoading(true);
        const { error } = await VerifyUser(uid, cyUserId);
        if (error) {
          return toast({
            title: errorPrettier(error),
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
        setRefetchUsersList((prev) => !prev);
        toast({
          title: 'User Verified Successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        await axios
          .post(`${baseURL}/verified`, {
            email: userData?.email,
            fullName: userData.fullName,
          })
          .then((result) => {
            toast({
              title: `Email sent to the user about his account verification!`,
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top-right',
            });
          })
          .catch((err) => {
            toast({
              title: `Failed to send notification to user about his account verification!`,
              status: 'error',
              duration: 2000,
              isClosable: true,
              position: 'top-right',
            });
          });
        gridapi.current.api.hideOverlay();
        setVerifyLoading(false);
      } else if (key === 'block') {
        const valueToBeUpdated =
          value === 'Authorized' ? 'Blocked' : 'Authorized';
        setBlockLoading(true);
        const { error } = await UpdateUserRole(uid, valueToBeUpdated);
        toast({
          title: errorPrettier(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });

        setRefetchUsersList((prev) => !prev);
        setBlockLoading(false);
        gridapi.current.api.hideOverlay();
      }
    } catch (error) {
      toast({
        title: errorPrettier(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <Box>
      <Box p={5} shadow="md" borderWidth="1px" bg={'#f8f8f8'} height={'100%'}>
        <Tabs padding={0} onChange={(index) => setTabIndex(index)}>
          <TabList flexWrap={'wrap'} justifyContent={'center'} padding={0}>
            {staffType.map((item) => (
              <Tab sx={headerStyle} key={item}>
                {item}
              </Tab>
            ))}
          </TabList>

          <TabPanels padding={0}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <TabPanel key={_} padding={0}>
                {loading ? (
                  <Flex
                    mt={5}
                    width={'100%'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Loader />
                  </Flex>
                ) : (
                  <Staff
                    allUsers={allUsers}
                    tabIndex={tabIndex}
                    HandleCTA={HandleCTA}
                    verifyLoading={verifyLoading}
                    blockedLoading={blockLoading}
                    reFetchData={setRefetchUsersList}
                  />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default ManageUsers;

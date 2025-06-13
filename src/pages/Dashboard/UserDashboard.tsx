//@ts-nocheck comment
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { useEffect, useState } from 'react';
import { ref, update } from 'firebase/database';
import {
  FormatedDateTime,
  FormatedTime,
  getAttendance,
  MiliSecondsFormatter,
  SaveEvent,
  serverDateHelper,
} from 'helper/lib';
import dayjs from 'dayjs';
import { auth, db } from '../../firebase';
import { useAuth } from 'Context/authContext';
import Quote from 'components/Quote';
import { useNavigate } from 'react-router-dom';
import CountDown from 'components/CountDown';
import { BsHourglassSplit } from 'react-icons/bs';

const UserDashboard = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [serverTime, setServerTime] = useState();

  useEffect(() => {
    serverDateHelper().then((res) => {
      setServerTime(res);
    });
  }, []);

  const [breakIn, setBreakIn] = useState(
    authUser.presenceStatus === 'BreakedIn',
  );
  const [attendance, setAttendance] = useState();
  const [breakinLoading, setBreakinLoading] = useState(false);
  const [tempBreakDisable, setTempBreakDisable] = useState(0);

  const UID = auth.currentUser?.uid;
  const today = dayjs(authUser?.lastCheckedIn).format('DD-MMM-YYYY');
  const currentMonth = dayjs(serverTime).month();
  const currentYear = dayjs(serverTime).year();
  const isAuthorizedToCheckin =
    authUser.role === 'Authorized' && authUser.isVerified;
  const HandleBreak = async () => {
    if (tempBreakDisable) return;
    setBreakinLoading(true);
    setTempBreakDisable(10);
    const serverTime = await serverDateHelper();
    SaveEvent(authUser.fullName, breakIn ? 'Breaked out' : 'Breaked in');
    const breakKey = breakIn ? 'BreakedOut' : 'BreakedIn';

    await update(
      ref(
        db,
        `Attendance/${UID}/${currentYear}/${currentMonth}/${today}/breaks`,
      ),
      {
        [serverTime]: breakKey,
      },
    );
    await update(ref(db, `Users/${UID}`), {
      presenceStatus: breakIn ? 'BreakedOut' : 'BreakedIn',
    });

    setBreakinLoading(false);
    setTimeout(() => {
      setTempBreakDisable(0);
    }, 10000); // 1 minute - 60*1000
  };

  useEffect(() => {
    const today = dayjs(authUser?.lastCheckedIn).format('DD-MMM-YYYY');

    getAttendance({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    }).then((res) => {
      if (!!Object.keys(res?.data)?.length) {
        setAttendance(res?.data?.[today]);
        setBreakIn(authUser.presenceStatus === 'BreakedIn');
      }
    });
  }, [authUser.presenceStatus]);
  let temp: any = [];
  temp.breakedIn = [];
  temp.breakedOut = [];
  let difference = 0;
  attendance?.['breaks'] &&
    Object?.entries(attendance?.['breaks'])
      .sort((a: any, b: any) => a[0] - b[0])
      .map((item) => {
        if (item[1] === 'BreakedOut') {
          difference += Number(item[0]);
          temp.breakedOut.push(item);
        } else if (item[1] === 'BreakedIn') {
          difference -= Number(item[0]);
          temp.breakedIn.push(item);
        }
      });
  const validRoles = ['Authorized', 'Admin'];

  useEffect(() => {
    if (!authUser.emailVerified) {
      toast({
        title: 'Your email address is not verified!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } else if (
      validRoles.includes(authUser.role) &&
      authUser.isEmailVerified &&
      authUser.role !== 'Blocked'
    ) {
      navigate('/dashboard');
    }
  }, []);

  const isBreakDisabled =
    !!tempBreakDisable ||
    breakinLoading ||
    !authUser.presenceStatus ||
    authUser.presenceStatus === 'CheckedOut';
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
        {isAuthorizedToCheckin && (
          <CustomButton
            text={breakIn ? 'Break out' : 'Break in'}
            onClick={HandleBreak}
            buttonStyleProps={{
              width: 200,
              _hover: {
                background: isBreakDisabled && 'gray',
                cursor: isBreakDisabled && 'not-allowed',
              },
            }}
            isLoading={breakinLoading}
            rightComponent={
              !!tempBreakDisable && (
                <>
                  &nbsp;
                  <BsHourglassSplit />
                  &nbsp;
                  <CountDown minutes={tempBreakDisable} />
                </>
              )
            }
            disabled={isBreakDisabled}
          />
        )}
      </Box>

      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        bg={'white'}
        height={'100%'}
        sx={{ padding: 0, borderRadius: '6px', overflow: 'hidden' }}
      >
        <TableContainer>
          <Table size="sm">
            <Thead backgroundColor={'blackAlpha.800'}>
              <Tr>
                <Th padding={15} color={'white'}>
                  Check in
                </Th>
                <Th color={'white'}>Check out</Th>
                <Th color={'white'}>Break in</Th>
                <Th color={'white'}>Break out</Th>
                <Th color={'white'}>Total Time spent</Th>
                <Th color={'white'}>Total Time Required</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from({
                length:
                  temp?.breakedIn?.length < 1 ? 1 : temp?.breakedIn?.length,
              }).map((_: any, index: number) => {
                return (
                  <Tr key={index}>
                    {index === 0 && (
                      <Td padding={18} rowSpan={temp?.breakedIn?.length || 0}>
                        {FormatedDateTime(attendance?.['checkedIn'])}
                      </Td>
                    )}
                    {index === 0 && (
                      <Td rowSpan={temp?.breakedIn?.length || 0}>
                        {FormatedDateTime(attendance?.['checkedOut'])}
                      </Td>
                    )}
                    <Td>
                      {temp?.breakedIn?.[index]?.[1] === 'BreakedIn'
                        ? FormatedTime(temp?.breakedIn?.[index]?.[0])
                        : '-'}
                    </Td>
                    <Td>
                      {temp?.breakedOut?.[index]?.[1] === 'BreakedOut' ? (
                        FormatedTime(temp?.breakedOut[index][0])
                      ) : (
                        <Text ml={2}>-</Text>
                      )}
                    </Td>
                    {index === 0 && (
                      <Td rowSpan={temp?.breakedIn?.length || 0}>
                        {attendance?.['checkedOut'] ? (
                          MiliSecondsFormatter(
                            Number(
                              attendance?.['checkedOut'] -
                              attendance?.['checkedIn'] -
                              difference,
                            ),
                          )
                        ) : (
                          <Text ml={2}>-</Text>
                        )}
                      </Td>
                    )}

                    {index === 0 && (
                      <Td padding={18} rowSpan={temp?.breakedIn?.length || 0}>
                        9 Hours
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <Box mb={3} mt={100} display="flex" justifyContent="center" alignItems="center">
        <Box maxW="800px" textAlign="center">
          <Quote />
        </Box>
      </Box>

    </Box>
  );
};

export default UserDashboard;

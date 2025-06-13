// @ts-nocheck comment
import {
  Box,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import NoData from 'components/NoData';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import dayjs from 'dayjs';
import {
  errorPrettier,
  FormatedTime,
  getAttendance,
  GetBusinessDays,
  getWorkingDaysInMonth,
  MiliSecondsFormatter,
  YearHelper,
} from 'helper/lib';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { attendanceGenerateSchema } from 'Schema';
import { AttendanceGenerateInputs } from 'Types';

const UserAttendance = () => {
  const headerTitles = [
    'Day',
    'Check in',
    'Check out',
    'Break In',
    'Break Out',
    'Time Utilized',
    'Time Required',
    'Late',
    'Half Day',
    'Early Check-Out',
  ];

  type AttendanceDataType = {
    date?: string;
    checkin?: string;
    checkout?: string;
    checkedIn?: string;
    checkedOut?: string;
    breaks?: any;
    error?: string;
    difference?: number | any;
  };
  type ErrorType = {
    error: string;
  };
  const [attendanceData, setAttendanceData] = useState<
    AttendanceDataType[] | ErrorType
  >([]);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AttendanceGenerateInputs>({
    resolver: yupResolver(attendanceGenerateSchema),
  });
  const watchAllFields = watch(); // react hook form watch all fields

  const [CTAName, setCTAName] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const toast = useToast();
  const onSubmit = async (e: any) => {
    try {
      if (CTAName === 'Generate') {
        setGenerateLoading(true);
        const attendance = await getAttendance({
          month: Number(e.month) - 1,
          year: e.year,
        });
        if (attendance.error) {
          setGenerateLoading(false);
          return setAttendanceData({ error: attendance.error.message });
        } else if (!Object.keys(attendance?.data)?.length) {
          setGenerateLoading(false);
          setAttendanceError('No records found for selected result');
        } else {
          setGenerateLoading(false);
          return setAttendanceData(attendance.data);
        }
      }
    } catch (error) {
      setGenerateLoading(false);
      toast({
        title: errorPrettier(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  let temp: AttendanceDataType[] = [];
  temp.breakedIn = [];
  let totalTimeUtilized = 0;

  !attendanceData.error &&
    Object.entries(attendanceData).forEach((item, index) => {
      let breaks = !!item[1]?.breaks ? Object.entries(item[1]?.breaks) : [];

      let breakd = !!item[1]?.breaks
        ? Object.entries(item[1]['breaks']).reduce((prev, curr) => {
          if (curr[1] === 'BreakedIn') {
            prev += Number(curr[0]);
            return Number(prev);
          } else if (curr[1] === 'BreakedOut') {
            prev = prev - Number(curr[0]);
            return Number(prev);
          }
          return prev;
        }, 0)
        : 0;

      let breakD = breakd > 1 ? breakd : 0;

      if (item[1]['checkedOut'] && item[1]['checkedIn']) {
        totalTimeUtilized += Number(
          item[1]['checkedOut'] - item[1]['checkedIn'] - Math.abs(breakd),
        );
      }

      temp.push({
        checkin: item[1]['checkedIn']
          ? dayjs(item[1]['checkedIn']).format('DD-MM-YYYY, hh:mm A')
          : '-',
        checkout: item[1]['checkedOut']
          ? dayjs(item[1]['checkedOut']).format('DD-MM-YYYY, hh:mm A')
          : '-',

        difference:
          item[1]['checkedOut'] && item[1]['checkedIn']
            ? item[1]['checkedOut'] - breakD - item[1]['checkedIn']
            : '-',

        breakedIn: item[1]['breaks']
          ? Object.entries(item[1]['breaks'])
            .filter((val) => val[1] === 'BreakedIn')
            .map((item) => FormatedTime(item[0]))
          : ['-'],

        breakedOut: item[1]['breaks']
          ? Object.entries(item[1]['breaks'])
            .filter((val) => val[1] === 'BreakedOut')
            .map((item) => FormatedTime(item[0]))
          : ['-'],

        breakDifference:
          item[1]['breaks'] &&
            Object.entries(item[1]['breaks']).filter(
              (val) => val[1] === 'BreakedOut',
            ).length
            ? Object.keys(item[1]['breaks']).reduce(
              (prev, curr) => Number(curr) - Number(prev),
              0,
            )
            : '-',

        late:
          item[1]['checkedOut'] && item[1]['checkedIn']
            ? item[1]['checkedIn'] > dayjs(`${dayjs(item[1]['checkedIn']).format('YYYY-MM-DD')} 09:10`).tz('Asia/Karachi').valueOf() &&
              item[1]['checkedIn'] < dayjs(`${dayjs(item[1]['checkedIn']).format('YYYY-MM-DD')} 11:00`).tz('Asia/Karachi').valueOf()
              ? 'Yes'
              : 'No'
            : '-',


        halfDay:
          item[1]['checkedIn']
            ? new Date(Number(item[1]['checkedIn'])).getHours() >= 11
              ? 'Yes'
              : 'No'
            : '-',

        earlyCheckout:
          item[1]['checkedOut'] && item[1]['checkedOut'] < dayjs(`${dayjs(item[1]['checkedOut']).format('YYYY-MM-DD')} 17:00`).tz('Asia/Karachi').valueOf()
            ? 'Yes'
            : 'No',

        weekday: item[1]['checkedIn']
          ? dayjs(item[1]['checkedIn']).format('dddd') // Full day name
          : '-',

      });
    });


  // Object.entries(attendanceData).forEach((item, index) => {
  //   let breaks = !!item[1]?.breaks ? Object.entries(item[1]?.breaks) : [];

  //   let breakd = !!item[1]?.breaks
  //     ? Object.entries(item[1]['breaks']).reduce((prev, curr) => {
  //         if (curr[1] === 'BreakedIn') {
  //           prev += Number(curr[0]);
  //           return Number(prev);
  //         } else if (curr[1] === 'BreakedOut') {
  //           prev = prev - Number(curr[0]);
  //           return Number(prev);
  //         }
  //       }, 0)
  //     : 0;
  //   let breakD = breakd > 1 ? breakd : 0;

  //   if (item[1]['checkedOut'] && item[1]['checkedIn']) {
  //     totalTimeUtilized += Number(
  //       item[1]['checkedOut'] - item[1]['checkedIn'] - Math.abs(breakd),
  //     );
  //   }

  //   temp.push({
  //     checkin: item[1]['checkedIn']
  //       ? dayjs(item[1]['checkedIn']).format('DD-MM-YYYY, hh:mm A')
  //       : '-',
  //     checkout: item[1]['checkedOut']
  //       ? dayjs(item[1]['checkedOut']).format('DD-MM-YYYY, hh:mm A')
  //       : '-',

  //     difference:
  //       item[1]['checkedOut'] && item[1]['checkedIn']
  //         ? item[1]['checkedOut'] - breakD - item[1]['checkedIn']
  //         : '-',
  //     breakedIn: item[1]['breaks']
  //       ? Object.entries(item[1]['breaks'])
  //           .filter((val) => val[1] === 'BreakedIn')
  //           .map((item) => FormatedTime(item[0]))
  //       : ['-'],
  //     breakedOut: item[1]['breaks']
  //       ? Object.entries(item[1]['breaks'])
  //           .filter((val) => val[1] === 'BreakedOut')
  //           .map((item) => FormatedTime(item[0]))
  //       : ['-'],
  //     breakDifference:
  //       item[1]['breaks'] &&
  //       Object.entries(item[1]['breaks']).filter(
  //         (val) => val[1] === 'BreakedOut',
  //       ).length
  //         ? Object.keys(item[1]['breaks']).reduce(
  //             (prev, curr) => Number(curr) - Number(prev),
  //             0,
  //           )
  //         : '-',
  //   });
  // });

  useEffect(() => {
    setAttendanceData([]);
    setAttendanceError('');
  }, [watchAllFields.month, watchAllFields.year]);
  const [yearList, setYearList] = useState([]);
  useEffect(() => {
    YearHelper(setYearList);
    const month = new Date().getMonth() >= 12 ? 1 : new Date().getMonth() + 1;
    reset({
      month,
      year: new Date().getFullYear(),
    });
  }, []);

  const difference = temp
    .filter((val) => val.difference > 0)
    .reduce((prev, curr) => (prev += curr.difference), 0);
  let breakDifference = temp
    .filter((val) => val.breakDifference > 0)
    .reduce((prev, curr) => (prev += curr.breakDifference), 0);
  breakDifference = !isNaN(breakDifference) ? breakDifference : 0;
  const totalDifference = !isNaN(difference)
    ? difference
    : 0 - Number(!isNaN(breakDifference) ? breakDifference : 0);

  const tillDateWorkingHours = getWorkingDaysInMonth(new Date().getMonth(), 5);

  const totalLateCount = temp.filter((item) => item.late === 'Yes').length;
  const totalHalfDayCount = temp.filter((item) => item.halfDay === 'Yes').length;
  const totalEarlyCheckoutCount = temp.filter((item) => item.earlyCheckout === 'Yes').length;



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 6,
          flexWrap: 'wrap',
        }}
      >
        <Box mr={2}>
          <Select
            placeholder={watchAllFields.month ? '' : 'Month'}
            maxWidth={150}
            marginRight={5}
            marginBottom={3}
            {...register('month')}
          >
            <option disabled hidden>
              Month
            </option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </Select>
          <Text color={'red'}>{errors.month?.message}</Text>
        </Box>
        <Box mr={2}>
          <Select
            placeholder={watchAllFields.year ? '' : 'Year'}
            maxWidth={120}
            marginRight={5}
            marginBottom={3}
            {...register('year')}
          >
            <option disabled hidden>
              Year
            </option>
            {yearList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Select>
          <Text color={'red'}>{errors.year?.message}</Text>
        </Box>
        <Box marginRight={6}>
          <CustomButton
            text="Generate"
            isLoading={generateLoading}
            disabled={generateLoading}
            buttonStyleProps={{ maxWidth: 200, marginRight: 8 }}
            onClick={() => setCTAName('Generate')}
          />
        </Box>
      </Box>
      {!!temp.length ? (
        <TableContainer sx={{ padding: 0, borderRadius: '6px' }}>
          <Table variant="simple" colorScheme="cyan">
            <Thead backgroundColor={'blackAlpha.800'}>
              <Tr>
                {headerTitles?.map((headerTitle, index) => (
                  <Th key={headerTitle} padding={15} color={'white'}>
                    {headerTitle}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {temp?.map((item, index) => {
                return (
                  <Tr key={item}>
                    <Td>{item.weekday}</Td>
                    <Td>{item.checkin}</Td>
                    <Td>{item.checkout}</Td>
                    <Td>
                      {!!item.breakedIn?.length
                        ? item.breakedIn.map((val) => (
                          <Text key={val}>{val}</Text>
                        ))
                        : '-'}
                    </Td>
                    <Td>
                      {!!item.breakedOut.length
                        ? item.breakedOut.map((val) => (
                          <Text key={val}>{val}</Text>
                        ))
                        : '-'}
                    </Td>
                    {/* <Td>{MiliSecondsFormatter(item.breakDifference, true)}</Td> */}
                    <Td>
                      {!!item.checkout && item.checkout !== '-'
                        ? MiliSecondsFormatter(
                          isNaN(item.breakDifference)
                            ? item.difference
                            : item.difference - item.breakDifference,
                          true,
                        )
                        : '-'}
                    </Td>
                    <Td>{'9 Hours'}</Td>
                    <Td style={{ color: item.late === 'Yes' ? 'red' : 'inherit', fontWeight: item.late === 'Yes' ? 'bold' : 'normal' }}>
                      {item.late}
                    </Td>
                    <Td style={{ color: item.halfDay === 'Yes' ? 'red' : 'inherit', fontWeight: item.halfDay === 'Yes' ? 'bold' : 'normal' }}>
                      {item.halfDay}
                    </Td>
                    <Td style={{ color: item.earlyCheckout === 'Yes' ? 'red' : 'inherit', fontWeight: item.earlyCheckout === 'Yes' ? 'bold' : 'normal' }}>
                      {item.earlyCheckout}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot backgroundColor={'blackAlpha.800'}>
              <Tr>
                <Td colSpan={4} padding={15} color={'white'}>
                  Total
                </Td>
                <Td padding={15} color={'white'}>
                  {`${MiliSecondsFormatter(totalTimeUtilized, true)}`}
                </Td>
                <Td padding={15} color={'white'}>
                  {'198 Hours'}
                </Td>
                <Td padding={15} color={'white'}>
                 
                </Td>
                <Td padding={15} color={'white'}>
                  {totalLateCount}
                </Td>
                <Td padding={15} color={'white'}>
                  {totalHalfDayCount}
                </Td>
                <Td padding={15} color={'white'}>
                  {totalEarlyCheckoutCount}
                </Td>
                

              </Tr>
            </Tfoot>

          </Table>
        </TableContainer>
      ) : attendanceData.error ? (
        <NoData text={'No record found.'} />
      ) : attendanceError ? (
        <NoData text={attendanceError} />
      ) : (
        <NoData
          text={'Select above options and click Generate to view the report.'}
        />
      )}
    </form>
  );
};

export default UserAttendance;





// // @ts-nocheck comment
// import {
//   Box,
//   Select,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Text,
//   Tfoot,
//   Th,
//   Thead,
//   Tr,
//   useToast,
// } from '@chakra-ui/react';
// import { yupResolver } from '@hookform/resolvers/yup';
// import NoData from 'components/NoData';
// import SearchableDropdown from 'components/SearchableDropdown';
// import CustomButton from 'components/Shared/FormControls/CustomButton';
// import dayjs from 'dayjs';
// import {
//   errorPrettier,
//   FormatedTime,
//   getAllUsersList,
//   getAttendance,
//   YearHelper,
// } from 'helper/lib';
// import { useEffect, useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { attendanceGenerateAdminSchema } from 'Schema';
// import { AttendanceGenerateAdminInputs } from 'Types';

// const AdminAttendance = () => {
//   const headerTitles = [
//     'Checkin',
//     'Checkout',
//     'BreakIn',
//     'BreakOut',
//     'Time Utilized',
//     'Time Required',
//   ];

//   type AttendanceDataType = {
//     date?: string;
//     checkin?: string;
//     checkout?: string;
//     checkedIn?: string;
//     checkedOut?: string;
//     breaks?: any;
//     error?: string;
//     difference?: number | any;
//   };
//   type ErrorType = {
//     error: string;
//   };
//   const [attendanceData, setAttendanceData] = useState<
//     AttendanceDataType[] | ErrorType
//   >([]);
//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     control,
//     formState: { errors },
//   } = useForm<AttendanceGenerateAdminInputs>({
//     resolver: yupResolver(attendanceGenerateAdminSchema),
//   });
//   const watchAllFields = watch(); // react hook form watch all fields

//   const [CTAName, setCTAName] = useState('');
//   const [generateLoading, setGenerateLoading] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const [attendanceError, setAttendanceError] = useState('');
//   const toast = useToast();
//   const onSubmit = async (e: any) => {
//     try {
//       if (CTAName === 'Generate') {
//         setGenerateLoading(true);
//         const attendance = await getAttendance({
//           month: Number(e.month) - 1,
//           year: e.year,
//           uid: e.user.uid,
//         });
//         if (attendance.error) {
//           setGenerateLoading(false);
//           return setAttendanceData({ error: attendance.error.message });
//         } else if (!Object.keys(attendance?.data)?.length) {
//           setGenerateLoading(false);
//           setAttendanceError('No records found for selected result');
//         } else {
//           setGenerateLoading(false);
//           return setAttendanceData(attendance.data);
//         }
//       }
//     } catch (error) {
//       setGenerateLoading(false);
//       toast({
//         title: errorPrettier(error),
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//         position: 'top-right',
//       });
//     }
//   };

//   let temp: AttendanceDataType[] = [];
//   temp.breakedIn = [];
//   let totalTimeUtilized = 0;
//   !attendanceData.error &&
//     Object.entries(attendanceData).forEach((item, index) => {
//       if (item[1]['checkedOut'] && item[1]['checkedIn']) {
//         totalTimeUtilized += Number(
//           (item[1]['checkedOut'] - item[1]['checkedIn']) / 3.6e6,
//         );
//       }

//       temp.push({
//         checkin: item[1]['checkedIn']
//           ? dayjs(item[1]['checkedIn']).format('DD-MM-YYYY, hh:mm A')
//           : '-',
//         checkout: item[1]['checkedOut']
//           ? dayjs(item[1]['checkedOut']).format('DD-MM-YYYY, hh:mm A')
//           : '-',

//         difference:
//           item[1]['checkedOut'] && item[1]['checkedIn']
//             ? ((item[1]['checkedOut'] - item[1]['checkedIn']) / 3.6e6).toFixed(
//                 1,
//               ) + ' Hours'
//             : '-',
//         breakedIn: item[1]['breaks']
//           ? Object.entries(item[1]['breaks'])
//               .filter((val) => val[1] === 'BreakedIn')
//               .map((item) => FormatedTime(item[0]))
//           : ['-'],
//         breakedOut: item[1]['breaks']
//           ? Object.entries(item[1]['breaks'])
//               .filter((val) => val[1] === 'BreakedOut')
//               .map((item) => FormatedTime(item[0]))
//           : ['-'],
//       });
//     });

//   useEffect(() => {
//     setAttendanceData([]);
//     setAttendanceError('');
//   }, [watchAllFields.month, watchAllFields.year, watchAllFields.user]);
//   const [yearList, setYearList] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   useEffect(() => {
//     YearHelper(setYearList);
//     const month = new Date().getMonth() >= 12 ? 1 : new Date().getMonth() + 1;
//     reset({
//       month,
//       year: new Date().getFullYear(),
//     });
//     getAllUsersList((allUsers: any) =>
//       setAllUsers(
//         allUsers.filter(
//           (user: any) => user.isVerified && user.role === 'Authorized',
//         ),
//       ),
//     );
//   }, []);

//   useEffect(() => {
//     setFilteredUsers(
//       allUsers
//         .filter((user) => user.role !== 'Admin')
//         .map((item) => {
//           let fullName = `${item.firstName}  ${item.lastName}`;
//           return {
//             ...item,
//             label: item.fullName || fullName,
//             value: item.uid,
//           };
//         }),
//     );
//   }, [allUsers]);
//   const [selectedUser, setSelectedUser] = useState('');
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           marginBottom: 6,
//           flexWrap: 'wrap',
//         }}
//       >
//         <Box width={'200px'} mr={2}>
//           <SearchableDropdown
//             options={filteredUsers}
//             value={selectedUser}
//             onChange={setSelectedUser}
//             margin={'1px 0px 11px 0px'}
//             register={{ ...register('user') }}
//             Controller={Controller}
//             control={control}
//           />
//           <Text color={'red'}>{errors.user?.message}</Text>
//         </Box>

//         <Box mr={2}>
//           <Select
//             placeholder={watchAllFields.month ? '' : 'Month'}
//             maxWidth={150}
//             marginRight={5}
//             marginBottom={3}
//             {...register('month')}
//           >
//             <option value="1">January</option>
//             <option value="2">February</option>
//             <option value="3">March</option>
//             <option value="4">April</option>
//             <option value="5">May</option>
//             <option value="6">June</option>
//             <option value="7">July</option>
//             <option value="8">August</option>
//             <option value="9">September</option>
//             <option value="10">October</option>
//             <option value="11">November</option>
//             <option value="12">December</option>
//           </Select>
//           <Text color={'red'}>{errors.month?.message}</Text>
//         </Box>
//         <Box mr={2}>
//           <Select
//             placeholder={watchAllFields.year ? '' : 'Year'}
//             maxWidth={120}
//             marginRight={5}
//             marginBottom={3}
//             {...register('year')}
//           >
//             <option disabled hidden>
//               Year
//             </option>
//             {yearList.map((item) => (
//               <option value={item} key={item}>
//                 {item}
//               </option>
//             ))}
//           </Select>
//           <Text color={'red'}>{errors.year?.message}</Text>
//         </Box>
//         <Box marginRight={6}>
//           <CustomButton
//             text="Generate"
//             isLoading={generateLoading}
//             disabled={generateLoading}
//             buttonStyleProps={{ maxWidth: 200, marginRight: 8 }}
//             onClick={() => setCTAName('Generate')}
//           />
//         </Box>
//       </Box>
//       {!!temp.length ? (
//         <TableContainer sx={{ padding: 0, borderRadius: '6px' }}>
//           <Table variant="simple" colorScheme="cyan">
//             <Thead backgroundColor={'blackAlpha.800'}>
//               <Tr>
//                 {headerTitles?.map((headerTitle) => (
//                   <Th key={headerTitle} padding={15} color={'white'}>
//                     {headerTitle}
//                   </Th>
//                 ))}
//               </Tr>
//             </Thead>
//             <Tbody>
//               {temp?.map((item) => {
//                 return (
//                   <Tr key={item}>
//                     <Td>{item.checkin}</Td>
//                     <Td>{item.checkout}</Td>
//                     <Td>
//                       {!!item.breakedIn?.length
//                         ? item.breakedIn.map((val) => (
//                             <Text key={val}>{val}</Text>
//                           ))
//                         : '-'}
//                     </Td>
//                     <Td>
//                       {!!item.breakedOut.length
//                         ? item.breakedOut.map((val) => (
//                             <Text key={val}>{val}</Text>
//                           ))
//                         : '-'}
//                     </Td>
//                     <Td>{item.difference}</Td>
//                     <Td>{'9 Hours'}</Td>
//                   </Tr>
//                 );
//               })}
//             </Tbody>
//             <Tfoot backgroundColor={'blackAlpha.800'}>
//               <Tr>
//                 <Td colSpan={4} padding={15} color={'white'}>
//                   Total
//                 </Td>
//                 <Td padding={15} color={'white'}>
//                   {`${totalTimeUtilized.toFixed(1)} Hours`}
//                 </Td>
//                 <Td padding={15} color={'white'}>
//                   {'198 Hours'}
//                 </Td>
//               </Tr>
//             </Tfoot>
//           </Table>
//         </TableContainer>
//       ) : attendanceData.error ? (
//         <NoData text={'No record found.'} />
//       ) : attendanceError ? (
//         <NoData text={attendanceError} />
//       ) : (
//         <NoData
//           text={'Select above options and click Generate to view the report.'}
//         />
//       )}
//     </form>
//   );
// };

// export default AdminAttendance;





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
import SearchableDropdown from 'components/SearchableDropdown';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import dayjs from 'dayjs';
import {
  errorPrettier,
  FormatedTime,
  getAllUsersList,
  getAttendance,
  YearHelper,
} from 'helper/lib';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { attendanceGenerateAdminSchema } from 'Schema';
import { AttendanceGenerateAdminInputs } from 'Types';

const AdminAttendance = () => {
  const headerTitles = [
    'Day',
    'Checkin',
    'Checkout',
    'Late',
    'Half Day',
    'Early Checkout',
    'BreakIn',
    'BreakOut',
    'Time Utilized',
    'Time Required',
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
    day?: string;
    late?: boolean;
    halfDay?: boolean;
    earlyCheckout?: boolean;
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
    control,
    formState: { errors },
  } = useForm<AttendanceGenerateAdminInputs>({
    resolver: yupResolver(attendanceGenerateAdminSchema),
  });
  const watchAllFields = watch(); // react hook form watch all fields

  const [CTAName, setCTAName] = useState('');
  const [generateLoading, setGenerateLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [attendanceError, setAttendanceError] = useState('');
  const toast = useToast();

  const onSubmit = async (e: any) => {
    try {
      if (CTAName === 'Generate') {
        setGenerateLoading(true);
        const attendance = await getAttendance({
          month: Number(e.month) - 1,
          year: e.year,
          uid: e.user.uid,
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

  let totalTimeUtilized = 0;
  let totalLate = 0;
  let totalHalfDay = 0;
  let totalEarlyCheckout = 0;

  let temp: AttendanceDataType[] = [];

  !attendanceData.error &&
    Object.entries(attendanceData).forEach((item, index) => {
      const data = item[1];
      const checkedIn = data.checkedIn ? dayjs(data.checkedIn) : null;
      const checkedOut = data.checkedOut ? dayjs(data.checkedOut) : null;
      const timeUtilized =
        checkedIn && checkedOut ? checkedOut.diff(checkedIn, 'hours', true) : 0;

      // Day name
      const dayName = checkedIn ? checkedIn.format('dddd') : '-';

      // Late (after 9:00 AM)
      const late = checkedIn && checkedIn.hour() >= 9 ? true : false;
      if (late) totalLate++;

      // Half Day (<4 hours)
      const halfDay = timeUtilized > 0 && timeUtilized < 4 ? true : false;
      if (halfDay) totalHalfDay++;

      // Early Checkout (before 5:00 PM)
      const earlyCheckout = checkedOut && checkedOut.hour() < 17 ? true : false;
      if (earlyCheckout) totalEarlyCheckout++;

      totalTimeUtilized += timeUtilized;

      temp.push({
        day: dayName,
        checkin: checkedIn ? checkedIn.format('DD-MM-YYYY, hh:mm A') : '-',
        checkout: checkedOut ? checkedOut.format('DD-MM-YYYY, hh:mm A') : '-',
        late,
        halfDay,
        earlyCheckout,
        difference:
          checkedIn && checkedOut
            ? timeUtilized.toFixed(1) + ' Hours'
            : '-',
        breakedIn: data.breaks
          ? Object.entries(data.breaks)
              .filter((val) => val[1] === 'BreakedIn')
              .map((item) => FormatedTime(item[0]))
          : ['-'],
        breakedOut: data.breaks
          ? Object.entries(data.breaks)
              .filter((val) => val[1] === 'BreakedOut')
              .map((item) => FormatedTime(item[0]))
          : ['-'],
      });
    });

  useEffect(() => {
    setAttendanceData([]);
    setAttendanceError('');
  }, [watchAllFields.month, watchAllFields.year, watchAllFields.user]);

  const [yearList, setYearList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  useEffect(() => {
    YearHelper(setYearList);
    const month = new Date().getMonth() >= 12 ? 1 : new Date().getMonth() + 1;
    reset({
      month,
      year: new Date().getFullYear(),
    });
    getAllUsersList((allUsers: any) =>
      setAllUsers(
        allUsers.filter(
          (user: any) => user.isVerified && user.role === 'Authorized',
        ),
      ),
    );
  }, []);

  useEffect(() => {
    setFilteredUsers(
      allUsers
        .filter((user) => user.role !== 'Admin')
        .map((item) => {
          let fullName = `${item.firstName}  ${item.lastName}`;
          return {
            ...item,
            label: item.fullName || fullName,
            value: item.uid,
          };
        }),
    );
  }, [allUsers]);

  const [selectedUser, setSelectedUser] = useState('');

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
        <Box width={'200px'} mr={2}>
          <SearchableDropdown
            options={filteredUsers}
            value={selectedUser}
            onChange={setSelectedUser}
            margin={'1px 0px 11px 0px'}
            register={{ ...register('user') }}
            Controller={Controller}
            control={control}
          />
          <Text color={'red'}>{errors.user?.message}</Text>
        </Box>

        <Box mr={2}>
          <Select
            placeholder={watchAllFields.month ? '' : 'Month'}
            maxWidth={150}
            marginRight={5}
            marginBottom={3}
            {...register('month')}
          >
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
                {headerTitles?.map((headerTitle) => (
                  <Th key={headerTitle} padding={15} color={'white'}>
                    {headerTitle}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {temp?.map((item, index) => {
                return (
                  <Tr key={index}>
                    <Td>{item.day}</Td>
                    <Td>{item.checkin}</Td>
                    <Td>{item.checkout}</Td>
                    <Td>{item.late ? 'Yes' : '-'}</Td>
                    <Td>{item.halfDay ? 'Yes' : '-'}</Td>
                    <Td>{item.earlyCheckout ? 'Yes' : '-'}</Td>
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
                    <Td>{item.difference}</Td>
                    <Td>{'9 Hours'}</Td>
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot backgroundColor={'blackAlpha.800'}>
              <Tr>
                <Td colSpan={3} padding={15} color={'white'}>
                  Total
                </Td>
                <Td padding={15} color={'white'}>
                  {totalLate}
                </Td>
                <Td padding={15} color={'white'}>
                  {totalHalfDay}
                </Td>
                <Td padding={15} color={'white'}>
                  {totalEarlyCheckout}
                </Td>
                <Td colSpan={2}></Td>
                <Td padding={15} color={'white'}>
                  {`${totalTimeUtilized.toFixed(1)} Hours`}
                </Td>
                <Td padding={15} color={'white'}>
                  {'198 Hours'}
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

export default AdminAttendance;

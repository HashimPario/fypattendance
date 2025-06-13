// // @ts-nocheck
// import {
//   Box,
//   Flex,
//   Select,
//   Table,
//   TableContainer,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useDisclosure,
// } from '@chakra-ui/react';
// import { yupResolver } from '@hookform/resolvers/yup';
// import CustomButton from 'components/Shared/FormControls/CustomButton';
// import { getAttendance, GetBusinessDays, YearHelper } from 'helper/lib';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { UserPayslilpSchema } from 'Schema';
// import { UserPayslipInputs } from 'Types';
// import Loader from 'components/Shared/Loader';
// import { Months } from 'helper/constants';
// import NoData from 'components/NoData';

// const UserLeaves = () => {
//   const [yearList, setYearList] = useState([]);
//   const [generateLoading, setGenerateLoading] = useState(false);
//   const [showResult, setShowResult] = useState(false);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [remainingLeaves, setRemainingLeaves] = useState(0);
//   const [holidays, setHolidays] = useState([]);

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedMonthHolidays, setSelectedMonthHolidays] = useState([]);

//   const getGazettedHolidays = async (year: number) => {
//     const API_KEY = 'AHyYqn0a32KbdR3BwaN6PvesXdFmVdlS';
//     const country = 'PK';
//     const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data?.response?.holidays?.length) {
//         return data.response.holidays.filter((holiday) =>
//           holiday?.type?.includes('National holiday')
//         );
//       }
//       return [];
//     } catch (error) {
//       console.error('Failed to fetch gazetted holidays:', error);
//       return [];
//     }
//   };

//   const headerTitles = [
//     'Months',
//     'Total working days',
//     'Present',
//     'Absent',
//     'Gazetted Holidays',
//   ];

//   const {
//     register,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<UserPayslipInputs>({
//     resolver: yupResolver(UserPayslilpSchema),
//   });
//   const watchAllFields = watch();

//   const handleHolidaysClick = (month) => {
//     const filteredHolidays = holidays.filter((holiday) => {
//       const holidayDate = new Date(holiday.date.iso);
//       return holidayDate.getMonth() === Number(month);
//     });
//     setSelectedMonthHolidays(filteredHolidays);
//     onOpen();
//   };

//   const onSubmit = async (e: any) => {
//     setGenerateLoading(true);

//     let remainingLeave = 24;
//     const attendance = await getAttendance({ specificYear: e.year });

//     const fetchedHolidays = await getGazettedHolidays(e.year);
//     setHolidays(fetchedHolidays);

//     const temp = Object.entries(attendance.data)?.map((item) => {
//       const monthIndex = Number(item[0]);
//       const presentDays = Object.values(item[1]).filter(
//         (val) => val?.checkedIn
//       ).length;
//       const absentDays = Object.values(item[1]).filter(
//         (val) => val === 'Absent'
//       ).length;

//       const monthGazettedHolidays = fetchedHolidays.filter((holiday) => {
//         const date = new Date(holiday.date.iso);
//         return date.getMonth() === monthIndex;
//       });

//       const totalBusinessDays = GetBusinessDays(Object.keys(item[1])[0]);
//       const totalWorkingDays = totalBusinessDays - monthGazettedHolidays.length;

//       return {
//         month: item[0],
//         totalWorkingDays,
//         presentDays,
//         absentDays,
//         gazettedHolidays: monthGazettedHolidays.length,
//       };
//     });

//     setAttendanceData(temp);

//     const totalAbsent = Object.entries(attendance.data)
//       .map((item) =>
//         Object.values(item[1]).filter((val) => val === 'Absent').length
//       )
//       .reduce((a, b) => a + b, 0);

//     setRemainingLeaves(remainingLeave - totalAbsent);

//     setGenerateLoading(false);
//     setShowResult(true);
//   };

//   useEffect(() => {
//     YearHelper(setYearList);
//     const month = new Date().getMonth() >= 12 ? 1 : new Date().getMonth() + 1;
//     reset({
//       month,
//       year: new Date().getFullYear(),
//     });
//   }, []);

//   useEffect(() => {
//     setShowResult(false);
//   }, [watchAllFields.year]);

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <TableContainer sx={{ padding: 0, borderRadius: '6px' }}>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               marginBottom: 6,
//               flexWrap: 'wrap',
//             }}
//           >
//             <Box mr={2}>
//               <Select
//                 placeholder={watchAllFields.year ? '' : 'Year'}
//                 maxWidth={120}
//                 marginRight={5}
//                 marginBottom={3}
//                 {...register('year')}
//               >
//                 <option disabled hidden>
//                   Year
//                 </option>
//                 {yearList.map((item) => (
//                   <option value={item} key={item}>
//                     {item}
//                   </option>
//                 ))}
//               </Select>
//               <Text color={'red'}>{errors.year?.message}</Text>
//             </Box>
//             <Box marginRight={6}>
//               <CustomButton
//                 type="submit"
//                 text="Generate"
//                 isLoading={generateLoading}
//                 disabled={generateLoading}
//                 buttonStyleProps={{ maxWidth: 200, marginRight: 8 }}
//               />
//             </Box>
//           </Box>

//           {generateLoading ? (
//             <Flex
//               justifyContent={'center'}
//               alignItems={'center'}
//               color={'gray'}
//             >
//               <Loader />
//             </Flex>
//           ) : showResult && attendanceData?.length ? (
//             <>
//               <Box>
//                 <Text
//                   display={'flex'}
//                   justifyContent={'flex-end'}
//                   fontWeight={'bold'}
//                 >
//                   Remaining Leaves: {remainingLeaves}
//                 </Text>
//               </Box>
//               <Box width={'100%'} overflow={'auto'}>
//                 <Table variant="simple" colorScheme="cyan">
//                   <Thead backgroundColor={'blackAlpha.800'}>
//                     <Tr>
//                       {headerTitles?.map((headerTitle) => (
//                         <Th key={headerTitle} color={'white'}>
//                           {headerTitle}
//                         </Th>
//                       ))}
//                     </Tr>
//                   </Thead>
//                   <Tbody>
//                     {attendanceData?.map((item) => (
//                       <Tr key={item.month}>
//                         <Td>{Months[Number(item.month) + 1]}</Td>
//                         <Td>{item.totalWorkingDays}</Td>
//                         <Td>{item.presentDays}</Td>
//                         <Td>{item.absentDays}</Td>
//                         <Td>
//                           {item.gazettedHolidays > 0 ? (
//                             <Text
//                               color="blue.500"
//                               cursor="pointer"
//                               textDecoration="underline"
//                               onClick={() => handleHolidaysClick(item.month)}
//                             >
//                               {item.gazettedHolidays}
//                             </Text>
//                           ) : (
//                             0
//                           )}
//                         </Td>
//                       </Tr>
//                     ))}
//                   </Tbody>
//                 </Table>
//               </Box>
//             </>
//           ) : showResult && !attendanceData?.length ? (
//             <NoData text={'No record found.'} />
//           ) : (
//             <NoData
//               text={'Select above option and click Generate to view the report.'}
//             />
//           )}
//         </TableContainer>
//       </form>

//       {/* Modal for holiday descriptions */}
//       <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Gazetted Holidays Details</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {selectedMonthHolidays.length > 0 ? (
//               selectedMonthHolidays.map((holiday) => (
//                 <Box key={holiday.name} mb={4}>
//                   <Text fontWeight="bold">{holiday.name}</Text>
//                   <Text fontSize="sm" color="gray.600">
//                     {new Date(holiday.date.iso).toLocaleDateString()}
//                   </Text>
//                   <Text mt={2}>{holiday.description}</Text>
//                 </Box>
//               ))
//             ) : (
//               <Text>No holidays available for this month.</Text>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={onClose}>Close</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default UserLeaves;




// @ts-nocheck comment
import {
  Box,
  Flex,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { getAttendance, GetBusinessDays, YearHelper } from 'helper/lib';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPayslilpSchema } from 'Schema';
import { UserPayslipInputs } from 'Types';
import Loader from 'components/Shared/Loader';
import { Months } from 'helper/constants';
import NoData from 'components/NoData';

const UserLeaves = () => {
  const [yearList, setYearList] = useState([]);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [holidays, setHolidays] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMonthHolidays, setSelectedMonthHolidays] = useState([]);

  const getGazettedHolidays = async (year: number) => {
    const API_KEY = 'AHyYqn0a32KbdR3BwaN6PvesXdFmVdlS';
    const country = 'PK';
    const url = `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.response?.holidays?.length) {
        return data.response.holidays.filter((holiday) =>
          holiday?.type?.includes('National holiday')
        );
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch gazetted holidays:', error);
      return [];
    }
  };

  const headerTitles = [
    'Months',
    'Total working days',
    'Present',
    'Absent',
    'Gazetted Holidays',
  ];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserPayslipInputs>({
    resolver: yupResolver(UserPayslilpSchema),
  });
  const watchAllFields = watch();

  const handleHolidaysClick = (month) => {
    const filteredHolidays = holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date.iso);
      return holidayDate.getMonth() === Number(month);
    });
    setSelectedMonthHolidays(filteredHolidays);
    onOpen();
  };

  const onSubmit = async (e: any) => {
    setGenerateLoading(true);

    let remainingLeave = 24;
    const attendance = await getAttendance({ specificYear: e.year });

    const fetchedHolidays = await getGazettedHolidays(e.year);
    setHolidays(fetchedHolidays);

    const temp = Object.entries(attendance.data)?.map((item) => {
      const monthIndex = Number(item[0]);
      const dateKey = Object.keys(item[1])[0];
      const totalWorkingDays = GetBusinessDays(dateKey);
      const gazettedHolidaysCount = fetchedHolidays.filter((holiday) => {
        const date = new Date(holiday.date.iso);
        return date.getMonth() === monthIndex;
      }).length;

      const adjustedWorkingDays = totalWorkingDays - gazettedHolidaysCount;

      const presentDays = Object.values(item[1]).filter(
        (val) => val?.checkedIn
      ).length;

      const absentDays = adjustedWorkingDays - presentDays;

      return {
        month: item[0],
        totalWorkingDays: adjustedWorkingDays,
        presentDays,
        absentDays: absentDays >= 0 ? absentDays : 0,
        gazettedHolidays: gazettedHolidaysCount,
      };
    });

    setAttendanceData(temp);

    const totalAbsent = temp.reduce((sum, item) => sum + item.absentDays, 0);
    setRemainingLeaves(remainingLeave - totalAbsent);

    setGenerateLoading(false);
    setShowResult(true);
  };

  useEffect(() => {
    YearHelper(setYearList);
    const month = new Date().getMonth() >= 12 ? 1 : new Date().getMonth() + 1;
    reset({
      month,
      year: new Date().getFullYear(),
    });
  }, []);

  useEffect(() => {
    setShowResult(false);
  }, [watchAllFields.year]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TableContainer sx={{ padding: 0, borderRadius: '6px' }}>
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
                type="submit"
                text="Generate"
                isLoading={generateLoading}
                disabled={generateLoading}
                buttonStyleProps={{ maxWidth: 200, marginRight: 8 }}
              />
            </Box>
          </Box>

          {generateLoading ? (
            <Flex justifyContent={'center'} alignItems={'center'} color={'gray'}>
              <Loader />
            </Flex>
          ) : showResult && attendanceData?.length ? (
            <>
              <Box>
                <Text display={'flex'} justifyContent={'flex-end'} fontWeight={'bold'}>
                  Total Leaves: 24 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Remaining Leaves: {remainingLeaves}
                </Text>
              </Box>
              <Box width={'100%'} overflow={'auto'}>
                <Table variant="simple" colorScheme="cyan">
                  <Thead backgroundColor={'blackAlpha.800'}>
                    <Tr>
                      {headerTitles?.map((headerTitle) => (
                        <Th key={headerTitle} color={'white'}>
                          {headerTitle}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendanceData?.map((item) => (
                      <Tr key={item.month}>
                        <Td>{Months[Number(item.month) + 1]}</Td>
                        <Td>{item.totalWorkingDays}</Td>
                        <Td>{item.presentDays}</Td>
                        <Td>{item.absentDays}</Td>
                        <Td>
                          {item.gazettedHolidays > 0 ? (
                            <Text
                              color="blue.500"
                              cursor="pointer"
                              textDecoration="underline"
                              onClick={() => handleHolidaysClick(item.month)}
                            >
                              {item.gazettedHolidays}
                            </Text>
                          ) : (
                            0
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </>
          ) : showResult && !attendanceData?.length ? (
            <NoData text={'No record found.'} />
          ) : (
            <NoData text={'Select above option and click Generate to view the report.'} />
          )}
        </TableContainer>
      </form>

      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gazetted Holidays Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMonthHolidays.length > 0 ? (
              selectedMonthHolidays.map((holiday) => (
                <Box key={holiday.name} mb={4}>
                  <Text fontWeight="bold">{holiday.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(holiday.date.iso).toLocaleDateString()}
                  </Text>
                  <Text mt={2}>{holiday.description}</Text>
                </Box>
              ))
            ) : (
              <Text>No holidays available for this month.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserLeaves;


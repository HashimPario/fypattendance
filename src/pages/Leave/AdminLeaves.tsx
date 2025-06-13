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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import SearchableDropdown from 'components/SearchableDropdown';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import {
  getAllUsersList,
  getAttendance,
  GetBusinessDays,
  YearHelper,
} from 'helper/lib';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { adminPayslilpSchema } from 'Schema';
import { AdminPayslipInputs } from 'Types';
import Loader from 'components/Shared/Loader';
import { Months } from 'helper/constants';
import NoData from 'components/NoData';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Text as ChakraText,
} from '@chakra-ui/react';


const AdminLeaves = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState();



  const [showHolidayModal, setShowHolidayModal] = useState(false);
const [selectedHolidayDetails, setSelectedHolidayDetails] = useState([]);


  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<AdminPayslipInputs>({
    resolver: yupResolver(adminPayslilpSchema),
  });
  const watchAllFields = watch(); // react hook form watch all fields

const [gazettedHolidaysData, setGazettedHolidaysData] = useState({}); // key: monthIndex, value: array of holidays

const fetchGazettedHolidays = async (year) => {
  try {
    const response = await fetch(
      `https://calendarific.com/api/v2/holidays?&api_key=AHyYqn0a32KbdR3BwaN6PvesXdFmVdlS&country=PK&year=${year}`
    );
    const result = await response.json();
    const allHolidays = result?.response?.holidays || [];

    // Filter national holidays
    const nationalHolidays = allHolidays.filter(
      (holiday) => holiday?.type?.includes('National holiday')
    );

    // Group holidays by month index
    const monthlyHolidayMap = {};
    nationalHolidays.forEach((holiday) => {
      const monthIndex = new Date(holiday.date.iso).getMonth();
      if (!monthlyHolidayMap[monthIndex]) monthlyHolidayMap[monthIndex] = [];
      monthlyHolidayMap[monthIndex].push(holiday);
    });

    setGazettedHolidaysData(monthlyHolidayMap);
    return monthlyHolidayMap;
  } catch (error) {
    console.error('Failed to fetch holidays:', error);
    setGazettedHolidaysData({});
    return {};
  }
};

const onSubmit = async (e: any) => {
  setGenerateLoading(true);
  const attendance = await getAttendance({
    uid: e.user.uid,
    specificYear: e.year,
  });

  const monthlyHolidayMap = await fetchGazettedHolidays(e.year);

  const temp = Object.entries(attendance.data)?.map(([monthKey, monthData]) => {
    const totalEntries = Object.keys(monthData).length;
    const holidayList = monthlyHolidayMap[parseInt(monthKey)] || [];
    const holidayCount = holidayList.length;

    const workingDays = totalEntries - holidayCount;
    const presentDays = Object.values(monthData)?.filter((val: any) => val?.checkedIn)?.length;
    const absentDays = Math.max(workingDays - presentDays, 0);

    return {
      month: monthKey,
      totalWorkingDays: workingDays,
      presentDays,
      absentDays,
      gazettedHolidays: holidayCount,
      holidayDetails: holidayList,
    };
  });

  setAttendanceData(temp);
  setRemainingLeaves(
    24 - temp.reduce((acc, item) => acc + item.absentDays, 0)
  );
  setGenerateLoading(false);
  setShowResult(true);
};
const handleHolidayClick = (holidayDetails) => {
  setSelectedHolidayDetails(holidayDetails);
  setShowHolidayModal(true);
};


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
        .map((item) => ({
          ...item,
          label: item.fullName,
          value: item.uid,
        })),
    );
  }, [allUsers]);
  const headerTitles = ['Months', 'Total working days', 'Present', 'Absent', 'Gazetted Holidays'];


  useEffect(() => {
    setShowResult(false);
  }, [watchAllFields.user, watchAllFields.year]);

  return (
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
              <Text
                display={'flex'}
                justifyContent={'flex-end'}
                fontWeight={'bold'}
              >
                Remaining Leaves: {remainingLeaves}
              </Text>
            </Box>

            <Box width={'100%'} overflow={'auto'}>
              <Table variant="simple" colorScheme="cyan">
                <Thead backgroundColor={'blackAlpha.800'}>
                  <Tr>
                    {headerTitles?.map((headerTitle, index) => (
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
      <Td>{item?.totalWorkingDays}</Td>
      <Td>{item?.presentDays}</Td>
      <Td>{item?.absentDays}</Td>
      <Td>
        {item.gazettedHolidays > 0 ? (
          <Text
            as="button"
            color="blue.500"
            textDecoration="underline"
            cursor="pointer"
            onClick={() => handleHolidayClick(item.holidayDetails)}
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
          <NoData
            text={'Select above option and click Generate to view the report.'}
          />
        )}
      </TableContainer>

        <Modal isOpen={showHolidayModal} onClose={() => setShowHolidayModal(false)} isCentered size="md">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Gazetted Holiday Details</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {selectedHolidayDetails.length === 0 ? (
        <ChakraText>No holiday details available.</ChakraText>
      ) : (
        <List spacing={3}>
          {selectedHolidayDetails.map((holiday) => (
            <ListItem key={holiday.name}>
              <ChakraText fontWeight="bold">{holiday.name}</ChakraText>
              <ChakraText fontSize="sm" color="gray.600">
                {new Date(holiday.date.iso).toLocaleDateString()}
              </ChakraText>
              <ChakraText mt={1}>{holiday.description}</ChakraText>
            </ListItem>
          ))}
        </List>
      )}
    </ModalBody>
  </ModalContent>
</Modal>

    </form>
  );
};

export default AdminLeaves;







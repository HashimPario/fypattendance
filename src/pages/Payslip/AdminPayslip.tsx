// @ts-nocheck comment
import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Flex,
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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import SearchableDropdown from 'components/SearchableDropdown';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import CustomModal from 'components/Shared/Modal';
import {
  getAllUsersList,
  GetSelectedUserPayroll,
  NumberFormatter,
  YearHelper,
} from 'helper/lib';
import Payslip from 'pages/Payroll/Components/Payslip';
import { useForm, Controller } from 'react-hook-form';
import { adminPayslilpSchema } from 'Schema';
import { AdminPayslipInputs } from 'Types';
import ReactToPdf from 'react-to-pdf';
import { useReactToPrint } from 'react-to-print';
import Loader from 'components/Shared/Loader';
import NoData from 'components/NoData';

const AdminPayslip = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [payslipError, setPayslipError] = useState('');

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
  const [payslipData, setPayslipData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const onSubmit = async (e: any) => {
    setGenerateLoading(true);
    await GetSelectedUserPayroll(
      e.user.uid,
      e.year,
      setPayslipData,
      setGenerateLoading,
      setPayslipError,
    );
    // setGenerateLoading(false);
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
  const headerTitles = [
    'Date',
    'Net Payment',
    'View Payslip',
    'Download Payslip',
  ];
  const ref = React.createRef();
  const options = {
    orientation: 'landscape',
    unit: 'in',
    format: [11.7, 8.3],
  };
  const [showModal, setShowModal] = useState(false);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    setPayslipData([]);
    setPayslipError('');
  }, [watchAllFields.user, watchAllFields.year]);
  const [selectedPayroll, setSelectedPayroll] = useState();

  const NetPayment = useMemo(
    () =>
      payslipData.reduce((prev, curr) => {
        prev += curr?.payroll?.netSalary || 0;
        return prev;
      }, 0),
    [payslipData],
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TableContainer
        sx={{ padding: 0, borderRadius: '6px' }}
        // borderRadius={10} borderBottom={2} borderColor={"black"} borderWidth={1}
        position={'relative'}
      >
        <Box
          ref={ref}
          position={'absolute'}
          filter={'opacity(0)'}
          zIndex={-1}
          width={'100%'}
        >
          {selectedPayroll && (
            <Payslip
              payroll={selectedPayroll.payroll}
              userInfo={watchAllFields.user}
              date={selectedPayroll?.['Payment date']}
              payslipId={selectedPayroll?.['payslipId']}
            />
          )}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            filter: 'opacity(0)',
            zIndex: -1,
            '@media print': {
              filter: 'opacity(1)',
              position: 'absolute',
              // padding: 3,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
          ref={componentRef}
        >
          <Box width={'80%'} height={'80%'}>
            {selectedPayroll && (
              <Payslip
                payroll={selectedPayroll.payroll}
                userInfo={watchAllFields.user}
                date={selectedPayroll?.['Payment date']}
                payslipId={selectedPayroll?.['payslipId']}
              />
            )}
          </Box>
        </Box>
        {showModal && selectedPayroll && (
          <CustomModal
            modalWidth={'4xl'}
            openModal={showModal}
            handleOpenModal={setShowModal}
            modalHeading={<></>}
            modalBodyContent={
              <Payslip
                payroll={selectedPayroll.payroll}
                userInfo={watchAllFields.user}
                date={selectedPayroll?.['Payment date']}
                payslipId={selectedPayroll?.['payslipId']}
              />
            }
            modalFooterContent={<></>}
          />
        )}
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
        ) : payslipData?.length ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                {headerTitles?.map((headerTitle, index) => (
                  <Th key={headerTitle}>{headerTitle}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {payslipData?.map((item, index) => (
                <Tr key={item.paymentDate}>
                  <Td>{item?.['Payment date']}</Td>
                  <Td>{`Pkr. ${NumberFormatter(
                    item?.payroll?.netSalary,
                  )}/-`}</Td>
                  <Td>
                    <CustomButton
                      text="View"
                      buttonStyleProps={{ width: '80%' }}
                      onClick={() => {
                        setShowModal(true);
                        setSelectedPayroll(item);
                      }}
                    />
                  </Td>
                  <Td>
                    <ReactToPdf
                      targetRef={ref}
                      filename="Payslip.pdf"
                      options={options}
                      x={0.2}
                      y={0.2}
                      scale={0.8}
                    >
                      {({ toPdf }) => (
                        <CustomButton
                          text="Download"
                          buttonStyleProps={{ width: '80%' }}
                          onClick={() => {
                            setSelectedPayroll(item);
                            toPdf();
                          }}
                        />
                      )}
                    </ReactToPdf>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td padding={15}>Total</Td>
                <Td padding={15}>Pkr. {NumberFormatter(NetPayment)}/-</Td>
              </Tr>
            </Tfoot>
          </Table>
        ) : !payslipData?.length && !!payslipError?.length ? (
          <NoData text={payslipError} />
        ) : (
          <NoData
            text={'Select above option and click Generate to view the report.'}
          />
        )}
      </TableContainer>
    </form>
  );
};

export default AdminPayslip;

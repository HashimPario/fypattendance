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
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import CustomModal from 'components/Shared/Modal';
import {
  errorPrettier,
  GetSelectedUserPayroll,
  NumberFormatter,
  YearHelper,
} from 'helper/lib';
import Payslip from 'pages/Payroll/Components/Payslip';
import { useForm } from 'react-hook-form';
import { UserPayslilpSchema } from 'Schema';
import { UserPayslipInputs } from 'Types';
import ReactToPdf from 'react-to-pdf';
import Loader from 'components/Shared/Loader';
import { useAuth } from 'Context/authContext';
import NoData from 'components/NoData';

const UserPayslip = () => {
  const { authUser } = useAuth();

  const [yearList, setYearList] = useState([]);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [payslipData, setPayslipData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState();

  const headerTitles = [
    'Date',
    'Net Payment',
    'View Payslip',
    'Download Payslip',
  ];
  const options = {
    orientation: 'portrait',
    unit: 'in',
    format: [7.6, 7.5],
  };

  const ref = React.createRef();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserPayslipInputs>({
    resolver: yupResolver(UserPayslilpSchema),
  });
  const watchAllFields = watch(); // react hook form watch all fields
  const [pdfReset, setPdfReset] = useState(false);
  const onSubmit = async (e: any) => {
    try {
      setGenerateLoading(true);
      const result = await GetSelectedUserPayroll(
        authUser.uid,
        e.year,
        setPayslipData,
        setGenerateLoading,
        () => {}, // for error state
      );
      setShowResult(!generateLoading);
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

  const NetPayment = useMemo(
    () =>
      payslipData.reduce((prev, curr) => {
        prev += curr?.payroll?.netSalary || 0;
        return prev;
      }, 0),
    [payslipData],
  );

  return (
    <Box>
      <Box
        position={'relative'}
        sx={{ padding: 0, borderRadius: '6px' }}
        filter={'opacity(0)'}
      >
        <Box
          ref={ref}
          position={'absolute'}
          filter={'opacity(0)'}
          zIndex={-1}
          width={'100%'}
          maxWidth={'1300px'}
          minWidth={'1300px'}
        >
          {selectedPayroll && !!pdfReset && (
            <Payslip
              payroll={selectedPayroll.payroll}
              userInfo={authUser}
              date={selectedPayroll?.['Payment date']}
              payslipId={selectedPayroll?.['payslipId']}
            />
          )}
        </Box>
      </Box>
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
        <TableContainer sx={{ padding: 0, borderRadius: '6px' }}>
          {showModal && selectedPayroll && (
            <CustomModal
              modalWidth={'4xl'}
              openModal={showModal}
              handleOpenModal={setShowModal}
              modalHeading={<></>}
              modalBodyContent={
                <Payslip
                  payroll={selectedPayroll.payroll}
                  userInfo={authUser}
                  date={selectedPayroll?.['Payment date']}
                  payslipId={selectedPayroll?.['payslipId']}
                />
              }
              modalFooterContent={<></>}
            />
          )}
          {generateLoading ? (
            <Flex
              justifyContent={'center'}
              alignItems={'center'}
              color={'gray'}
            >
              <Loader />
            </Flex>
          ) : showResult && payslipData?.length ? (
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
                        filename={`Payslip.pdf`}
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
                              setPdfReset(true);
                              toPdf();
                              setTimeout(() => setPdfReset(false), 1000);
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
          ) : showResult && !payslipData?.length ? (
            <NoData text="No record found." />
          ) : (
            <NoData text="Select above option and click Generate to view the report." />
          )}
        </TableContainer>
      </form>
    </Box>
  );
};

export default UserPayslip;

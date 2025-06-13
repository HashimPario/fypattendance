// @ts-nocheck comment
import { Box, TableContainer, Text, useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import NoData from 'components/NoData';
import SearchableDropdown from 'components/SearchableDropdown';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import {
  errorPrettier,
  getAllUsersList,
  getCurrentUserData,
  UpdatePayrollData,
} from 'helper/lib';
import Payslip from 'pages/Payroll/Components/Payslip';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { editPayslipSchema } from 'Schema';
import { EditPayslipInputs } from 'Types';

import EditPayslipComponent from './EditPayroll';

const EditPayroll = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [edit, setEdit] = useState(false);

  const [generateLoading, setGenerateLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<EditPayslipInputs>({
    resolver: yupResolver(editPayslipSchema),
  });
  const watchAllFields = watch(); // react hook form watch all fields
  const [payslipData, setPayslipData] = useState(false);

  const onSubmit = async (e: any) => {
    if (edit) return;
    setGenerateLoading(true);
    setTimeout(() => {
      setSelectedUser(e?.user);
      setPayslipData(true);
      setGenerateLoading(false);
    }, 1000);
  };

  useEffect(() => {
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

  useEffect(() => {
    getCurrentUserData(
      setSelectedUser,
      {},
      () => {},
      () => {},
      selectedUser.uid,
    );
  }, [edit, payslipData]);

  useEffect(() => {}, [watchAllFields.user, watchAllFields.year]);
  const [earningsField, setEarningsField] = useState<any>(['']);

  const [deductionsField, setDeductionsField] = useState<any>(['']);

  useEffect(() => {
    if (selectedUser?.payroll?.earnings) {
      setEarningsField(Object.entries(selectedUser?.payroll?.earnings));
    }
    if (selectedUser?.payroll?.deductions) {
      setDeductionsField(Object.entries(selectedUser?.payroll?.deductions));
    }
  }, [selectedUser, edit]);

  const toast = useToast();

  const [saveDataLoading, setSaveDataLoading] = useState(false);
  const HandleSubmit = async () => {
    if (watchAllFields.user && !edit) setEdit((prev) => !prev);
    if (!edit) return;
    const isEarningFieldEmpty = earningsField.filter((item) => !item[0].trim());
    const isDeductionFieldEmpty = deductionsField.filter(
      (item) => !item[0].trim(),
    );

    if (!!isEarningFieldEmpty.length || !!isDeductionFieldEmpty.length) {
      return toast({
        title: 'Key must not be empty!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }

    try {
      setSaveDataLoading(true);
      let data = {
        earnings: Object.fromEntries(earningsField),
        deductions: Object.fromEntries(deductionsField),
        netSalary,
      };
      const { success, error } = await UpdatePayrollData(
        selectedUser.uid,
        data,
      );
      if (success) {
        toast({
          title: 'Data saved successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        // reset({
        //   user: '',
        // });
        setPayslipData(true);
        setEdit(false);
      }
      if (error) {
        toast({
          title: errorPrettier(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setSaveDataLoading(false);
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

  let totalEarning = 0;
  let totalDeduction = 0;
  earningsField.map((item: any) => (totalEarning += Number(item[1])));
  deductionsField.map((item: any) => (totalDeduction += Number(item[1])));
  let netSalary = totalEarning - totalDeduction;
  const [cachedData, setCachedData] = useState();
  useEffect(() => {
    setPayslipData(false);
    setEdit(false);
  }, [watchAllFields.user]);

  useEffect(() => {
    setCachedData({
      earningCached: JSON.stringify(earningsField),
      deductionCached: JSON.stringify(deductionsField),
    });
  }, [edit]);

  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    earningError: '',
    deductionError: '',
  });

  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    const deductionExceeded = deductionsField.filter(
      (item) => item[1] > 1000000,
    ).length;
    const earningExceeded = earningsField.filter(
      (item) => item[1] > 1000000,
    ).length;
    if (earningExceeded) {
      setDisabled(true);
      setErrorMessage((prev) => ({
        ...prev,
        earningError: 'Value must not be greater then 1,000,000',
      }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        earningError: '',
      }));
    }
    if (deductionExceeded) {
      setDisabled(true);
      setErrorMessage((prev) => ({
        ...prev,
        deductionError: 'Value must not be greater then 1,000,000',
      }));
    } else {
      setErrorMessage((prev) => ({
        ...prev,
        deductionError: '',
      }));
    }
    if (!earningExceeded && !deductionExceeded) {
      setDisabled(false);
    }

    const updatedEarningFields = JSON.stringify(earningsField);
    const updatedDeductionFields = JSON.stringify(deductionsField);
    if (
      updatedEarningFields === cachedData?.earningCached &&
      updatedDeductionFields === cachedData?.deductionCached &&
      !!edit
    ) {
      setIsDisabled(true);
    } else setIsDisabled(false);
  }, [earningsField, deductionsField]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TableContainer
        sx={{ padding: 0, borderRadius: '6px' }}
        position={'relative'}
      >
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
              margin={'1px 0px 11px 0px'}
              register={{ ...register('user') }}
              Controller={Controller}
              control={control}
            />
            <Text color={'red'}>{errors.user?.message}</Text>
          </Box>
          <Box marginRight={6}>
            <CustomButton
              type="submit"
              text="Generate"
              isLoading={generateLoading}
              disabled={generateLoading || payslipData}
              buttonStyleProps={{
                maxWidth: 200,
                marginRight: 8,
                marginBottom: 2,
              }}
            />
          </Box>
          <Box marginRight={6}>
            <CustomButton
              type="button"
              isLoading={saveDataLoading}
              disabled={!payslipData || !!disabled || !!isDisabled}
              text={edit ? 'Save' : 'Edit'}
              onClick={HandleSubmit}
              buttonStyleProps={{ maxWidth: 200, marginRight: 8 }}
            />
          </Box>
        </Box>
        {edit && payslipData ? (
          <EditPayslipComponent
            error={errorMessage}
            data={selectedUser}
            earningsField={earningsField}
            setEarningsField={setEarningsField}
            deductionsField={deductionsField}
            setDeductionsField={setDeductionsField}
            netSalary={netSalary}
          />
        ) : payslipData ? (
          <Box>
            <Payslip
              payroll={selectedUser.payroll}
              userInfo={selectedUser}
              payslipId={selectedUser?.['payslipId']}
            />
          </Box>
        ) : (
          <NoData
            text={'Select above option and click Generate to view the report.'}
          />
        )}
      </TableContainer>
    </form>
  );
};

export default EditPayroll;

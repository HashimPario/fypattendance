import { Box, Grid, Text } from '@chakra-ui/react';
import { NumberFormatter } from 'helper/lib';
import PayslipGridEditable from 'pages/Payroll/Components/PayslipGridEditable';

const EditPayslipComponent = (props: any) => {
  const {
    earningsField,
    setEarningsField,
    deductionsField,
    setDeductionsField,
    netSalary,
    error,
  } = props || {};

  const HandleEarningUpdate = (value: string, index: number, type: string) => {
    if (type === 'key') {
      let temp = [...earningsField];
      temp[index][0] = value;
      setEarningsField(temp);
    } else {
      let temp1 = [...earningsField];
      temp1[index][1] = value;
      setEarningsField(temp1);
    }
  };

  const HandleDeductionUpdate = (
    value: string,
    index: number,
    type: string,
  ) => {
    if (type === 'key') {
      let temp = [...deductionsField];
      temp[index][0] = value;
      setDeductionsField(temp);
    } else {
      let temp1 = [...deductionsField];
      temp1[index][1] = value;
      setDeductionsField(temp1);
    }
  };

  const HandleDeleteField = (index: number, type: string) => {
    if (type === 'earning') {
      const temp = [...earningsField];
      temp.splice(index, 1);
      setEarningsField(temp);
    } else {
      const temp1 = [...deductionsField];
      temp1.splice(index, 1);
      setDeductionsField(temp1);
    }
  };

  return (
    <>
      <Box
        sx={{ display: { sm: 'block', md: 'flex' } }}
        mt={5}
        mb={5}
        justifyContent={'space-between'}
      >
        <Grid sx={{ width: { sm: '100%', md: '45%' }, mb: 2 }}>
          <Text fontWeight={'bold'} fontSize={18}>
            Earnings
          </Text>
          <Box borderWidth={1} borderColor={'gray.200'} padding={1}>
            <PayslipGridEditable
              error={error.earningError || ''}
              data={earningsField}
              addNewFieldClickHandler={() =>
                setEarningsField(() => [...earningsField, ['', '']])
              }
              updateData={(value: string, index: number, type: string) =>
                HandleEarningUpdate(value, index, type)
              }
              deleteField={(index: number) =>
                HandleDeleteField(index, 'earning')
              }
            />
          </Box>
        </Grid>
        <Grid sx={{ width: { sm: '100%', md: '45%' }, mb: 2 }}>
          <Text fontWeight={'bold'} fontSize={18}>
            Deductions
          </Text>
          <Box borderWidth={1} borderColor={'gray.200'} padding={1}>
            <PayslipGridEditable
              error={error.deductionError || ''}
              data={deductionsField}
              addNewFieldClickHandler={() =>
                setDeductionsField([...deductionsField, ['', '']])
              }
              updateData={(value: string, index: number, type: string) =>
                HandleDeductionUpdate(value, index, type)
              }
              deleteField={(index: number) =>
                HandleDeleteField(index, 'deduction')
              }
            />
          </Box>
        </Grid>
      </Box>
      <Text color={'gray'}>
        Total Salary Payable = {NumberFormatter(netSalary)}/-
      </Text>
    </>
  );
};

export default EditPayslipComponent;

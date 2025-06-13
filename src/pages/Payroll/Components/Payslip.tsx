import { Box, Grid, Text } from '@chakra-ui/react';
import Logo from 'components/Shared/Logo';
import dayjs from 'dayjs';
import { NumberFormatter } from 'helper/lib';
import PayslipGrid from './PayslipGrid';
import { ToWords } from 'to-words';

const Payslip = ({ payroll, userInfo, date, payslipId }: any) => {
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: 'Rupee',
        plural: 'Rupees',
        symbol: 'Rs. ',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      },
    },
  });
  return (
    <Box
      sx={{ background: 'white', padding: 7, width: '100%', maxWidth: '850px' }}
    >
      <Text
        sx={{ fontSize: { sm: 12, md: 15, lg: 20 } }}
        // fontSize={20}
        display={'flex'}
        fontWeight={'bold'}
        justifyContent={'center'}
        textAlign={'center'}
        width={'800px'}
      >
        {date
          ? `PAYSLIP FOR THE MONTH OF  ${dayjs(date)
              .format('MMMM-YYYY')
              .toUpperCase()}`
          : 'PAYSLIP'}
      </Text>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Logo
          styleProps={{ mb: 5, mt: 3, ml: 2, justifyContent: 'flex-start' }}
        />
        <Box mt={7}>
          <Text fontSize={20} fontWeight={'bold'}>
            Payslip# {payslipId}
          </Text>
          <Text fontSize={15}>
            Salary Month of {dayjs(date).format('MMMM-YYYY')}
          </Text>
        </Box>
      </Box>
      <Text maxWidth={'230px'} mb={5}>
        Faiyaz Center, Office No: 08, Shahrah-e-Faisal Rd, SMCHS Block A ,
        Karachi, Pakistan
      </Text>
      <Text fontWeight={'bold'}>{userInfo?.fullName}</Text>
      <Text>{userInfo?.designation}</Text>
      <Text>Employee ID # {userInfo?.employeeId}</Text>

      <Box
        sx={{ display: 'flex' }}
        width={'800px'}
        maxWidth={'900px'}
        mt={5}
        mb={5}
        justifyContent={'flex-start'}
      >
        <Grid
          sx={{
            minWidth: '350px',
            maxWidth: '350px',
            width: '350px',
            mb: 2,
            marginRight: '50px',
          }}
        >
          <Text fontWeight={'bold'} fontSize={18}>
            Earnings
          </Text>
          <Box borderWidth={1} borderColor={'gray.200'} padding={1}>
            <PayslipGrid data={payroll?.earnings || ['']} />
          </Box>
        </Grid>

        <Grid
          sx={{ minWidth: '350px', maxWidth: '350px', width: '350px', mb: 2 }}
        >
          <Text fontWeight={'bold'} fontSize={18}>
            Deductions
          </Text>
          <Box borderWidth={1} borderColor={'gray.200'} padding={1}>
            <PayslipGrid data={payroll?.deductions || ['']} />
          </Box>
        </Grid>
      </Box>
      <Text fontWeight={'bold'} mb={3}>
        Net Salary : {NumberFormatter(payroll?.netSalary)}/- (
        {toWords.convert(payroll?.netSalary, { currency: true })})
      </Text>
      <Text
        fontSize={12}
        display={'flex'}
        justifyContent={'center'}
        width={'800px'}
      >
        Note: This is a system generated receipt and will only be valid with
        proper signed and stamped by KIET.
      </Text>

      {/* <Text>PAYSLIP # 001</Text>
      <Text>Salary Month of August 2022</Text> */}
    </Box>
  );
};

export default Payslip;

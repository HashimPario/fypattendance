import {
  Box,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import CustomButton from 'components/Shared/FormControls/CustomButton';

const Payroll = () => {
  const headerTitles = ['Month', 'View Payslip', 'Download Payslip'];
  const data = ['Jan', 'Feb', 'March', 'April'];
  return (
    <TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Select placeholder="Select Year" width={200}>
          <option disabled hidden>
            Select Year
          </option>
          <option value="2022">2022</option>
        </Select>
      </Box>
      <Table variant="simple" colorScheme="cyan">
        <Thead>
          <Tr>
            {headerTitles?.map((headerTitle) => (
              <Th key={headerTitle}>{headerTitle}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((item) => (
            <Tr key={item}>
              <Td>{item}</Td>
              <Td>
                <CustomButton text="View" buttonStyleProps={{ width: '80%' }} />
              </Td>
              <Td>
                <CustomButton
                  text="Download"
                  buttonStyleProps={{ width: '80%' }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Payroll;

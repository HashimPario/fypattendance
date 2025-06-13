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
import CustomModal from 'components/Shared/Modal';
import { YearHelper } from 'helper/lib';
import React, { useEffect, useState } from 'react';
import Payslip from './Components/Payslip';
import { useReactToPrint } from 'react-to-print';
import NoData from 'components/NoData';

const Payroll = () => {
  const headerTitles = ['Month', 'View Payslip', 'Download Payslip'];
  const data = ['Jan', 'Feb', 'March', 'April'];
  const ref = React.createRef();

  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    YearHelper(setYearList);
    setSelectedYear(new Date().getFullYear());
  }, []);

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <TableContainer position={'relative'}>
      <Box
        ref={ref}
        position={'absolute'}
        filter={'opacity(0)'}
        zIndex={-1}
        width={'100%'}
      >
        <Payslip />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          filter: 'opacity(0)',
          zIndex: -1,
          '@media print': {
            filter: 'opacity(1)',
            // position: 'absolute',
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
          <Payslip />
        </Box>
      </Box>
      {showModal && (
        <CustomModal
          modalWidth={'4xl'}
          openModal={showModal}
          handleOpenModal={setShowModal}
          modalHeading={<></>}
          modalBodyContent={<Payslip />}
          modalFooterContent={<></>}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          placeholder={selectedYear ? '' : 'Select Year'}
          width={200}
          onChange={(e) => setSelectedYear(e.target.value)}
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
      </Box>

      {selectedYear ? (
        <Table variant="simple" colorScheme="cyan">
          <Thead>
            <Tr>
              {headerTitles?.map((headerTitle, index) => (
                <Th key={headerTitle}>{headerTitle}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item, index) => (
              <Tr key={item}>
                <Td>{item}</Td>
                <Td>
                  <CustomButton
                    text="View"
                    buttonStyleProps={{ width: '80%' }}
                    onClick={() => setShowModal(true)}
                  />
                </Td>
                <Td>
                  <CustomButton
                    text="Print"
                    buttonStyleProps={{ width: '80%' }}
                    onClick={handlePrint}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <NoData text={'Select a Year to see payslips.'} />
      )}
    </TableContainer>
  );
};

export default Payroll;

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Avatar, Box, Image, Text, Tooltip, useToast } from '@chakra-ui/react';
import {
  FormatedDateTime,
  getAllUsersList,
  getRowHeight,
  NumberFormatter,
} from 'helper/lib';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import dayjs from 'dayjs';
import axios from 'axios';
import { baseURL } from 'helper/constants';

const AdminPayroll = () => {
  const gridRef: any = useRef();
  const [rowData, setRowData] = useState([]);
  const toast = useToast();

  const [columnDefs] = useState([
    {
      headerName: 'S. No',
      valueGetter: 'node.rowIndex + 1',
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 100,
    },
    {
      headerName: 'Emp Id',
      field: 'employeeId',
      filter: true,
      width: 100,
    },
    {
      headerName: 'Name',
      field: 'fullName',
      cellRendererFramework: ProfilePictureComponent,
      filter: true,
    },
    { headerName: 'Email', field: 'email' },
    {
      headerName: 'Join Date',
      field: 'accountCreatedOn',
      filter: false,
      cellRendererFramework: (params: any) =>
        FormatedDateTime(params.data.accountCreatedOn),
    },
    { headerName: 'Designation', field: 'role', width: 100 },
    {
      headerName: 'Net Salary',
      field: 'salary',
      width: 100,
      cellRendererFramework: (params: any) =>
        NumberFormatter(params.data?.payroll?.netSalary),
    },
    {
      headerName: 'Salary Status',
      field: 'payment',
      filter: false,
      cellRendererFramework: (params: any) => PaySalaryComponent(params, toast),
      width: 100,
      cellStyle: {
        justifyContent: 'center',
      },
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      suppressMenu: true,
      floatingFilter: true,
      autoSizePadding: true,
      width: 'auto',
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
    }),
    [],
  );

  const OnGridReady = () => {
    gridRef.current.rowHeight = 150;
    gridRef?.current?.api?.sizeColumnsToFit();
  };
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '600px' }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [selectedRowsApi, setSelectedRowsApi] = useState<any>();

  useEffect(() => {
    getAllUsersList((allUsers: any) =>
      setRowData(
        allUsers.filter(
          (user: any) => user.isVerified && user.role === 'Authorized',
        ),
      ),
    )
      .then(async () => {})
      .finally(async () => {
        return await gridRef?.current?.api?.sizeColumnsToFit();
      });
  }, []);

  const handleRowSelection = (node: any) => {
    const currentDate = `${dayjs().format('MM')}-${dayjs().format('YYYY')}`;

    if (node.data) {
      return (
        !!node.data?.payroll?.netSalary && currentDate !== node.data?.lastPaid
      );
    } else return false;
  };

  return (
    <Box sx={{ width: '100%', minHeight: 500 }} style={containerStyle}>
      <div className="ag-theme-alpine" style={gridStyle}>
        <Text
          as={'h2'}
          fontSize={25}
          width={'100%'}
          justifyContent={'center'}
          display={'flex'}
          marginBottom={5}
          color={'gray'}
        >
          Payroll for the month of {dayjs().format('MM')} -{' '}
          {dayjs().format('YYYY')}
        </Text>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Text>
            {!!selectedRowsApi &&
              selectedRowsApi.api.getSelectedRows()?.length > 1 && (
                <CustomButton
                  text="Pay selected"
                  buttonStyleProps={{ marginBottom: '10px' }}
                  onClick={() =>
                    HandlePay(
                      selectedRowsApi.api.getSelectedRows(),
                      true,
                      selectedRowsApi,
                      toast,
                    )
                  }
                />
              )}
          </Text>
        </Box>
        <AgGridReact
          ref={gridRef}
          enableCellChangeFlash={true}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={defaultColDef as any}
          floatingFiltersHeight={50}
          animateRows={true}
          rowSelection="multiple"
          rowHeight={170}
          onGridReady={OnGridReady}
          pagination={true}
          paginationPageSize={10}
          onSelectionChanged={(e) => setSelectedRowsApi(e)}
          getRowHeight={getRowHeight}
          //@ts-ignore
          isRowSelectable={handleRowSelection}
          suppressRowClickSelection={true}
        ></AgGridReact>
      </div>
    </Box>
  );
};

export default AdminPayroll;
const currentDate = `${dayjs().format('MM')}-${dayjs().format('YYYY')}`;

const HandlePay = async (
  data: any,
  isMultiple: boolean,
  api: any,
  toast: any,
) => {
  try {
    let filteredData = Array.isArray(data)
      ? data
          ?.filter(
            (val) => val?.lastPaid !== currentDate && !!val.payroll.netSalary,
          )
          .map((item) => ({
            ...item,
            uid: item.uid,
            email: item.email,
            payroll: item.payroll,
          }))
      : data?.lastPaid !== currentDate && !!data.payroll.netSalary
      ? [{ ...data,uid: data.uid, email: data.email, payroll: data.payroll }]
      : [];

    if (filteredData.length) {
      api?.api.showLoadingOverlay();
      await axios.post(`${baseURL}/pay`, {
        data: filteredData,
        isMultiple,
      });
      await api.api.deselectAll();
      toast({
        title: 'Success!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      api?.api.hideOverlay();
    }
  } catch (error) {
    toast({
      title: error instanceof Error ? error?.message : 'Unknown error occured',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
    api?.api.hideOverlay();
    throw error;
  }
};

const PaySalaryComponent = (params: any, toast: any) => {
  const isNetSalaryAvailable = !!params.data?.payroll?.netSalary;
  return (
    <Box padding={2}>
      {params?.data?.lastPaid && params?.data?.lastPaid === currentDate ? (
        <Text
          color={'green'}
          alignItems={'center'}
          textAlign={'center'}
          fontWeight={'bold'}
          display={'flex'}
          justifyContent={'center'}
        >
          Paid
        </Text>
      ) : (
        <Tooltip
          hasArrow
          isDisabled={isNetSalaryAvailable}
          label={`First add this user payroll from payroll section.`}
          bg="orange.400"
          borderRadius={10}
          placement="auto"
        >
          <Box>
            <CustomButton
              variant="outline"
              text="Pay"
              disabled={!isNetSalaryAvailable}
              buttonStyleProps={{
                height: 10,
                color: 'white',
                backgroundColor: !isNetSalaryAvailable ? 'gray' : '#2b6cb0',
                _hover: {
                  background: !isNetSalaryAvailable ? 'gray' : '#2b6cb0',
                },
              }}
              onClick={() => HandlePay(params.data, false, params, toast)}
            />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

const ProfilePictureComponent = (params: any) => {
  return (
    <Box
      padding={2}
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <Text>{params?.data?.fullName}</Text>
      {params?.data?.profilePicture ? (
        <Image
          mr={3}
          display={'flex'}
          alignItems={'center'}
          borderRadius={'50%'}
          boxShadow={'1px 2px 5px black'}
          objectFit={'cover'}
          src={params?.data?.profilePicture || ''}
          className="my-spinner"
          style={{ width: '50px', height: '50px' }}
        />
      ) : (
        <Avatar
          display={'flex'}
          boxShadow={'1px 2px 5px black'}
          sx={{ width: '50px', height: '50px' }}
          // width={'40px'}
          mr={3}
          textAlign={'center'}
          alignItems={'center'}
          // size={'md'}
          // name={params.data?.fullName}
          objectFit={'cover'}
        />
      )}
    </Box>
  );
};

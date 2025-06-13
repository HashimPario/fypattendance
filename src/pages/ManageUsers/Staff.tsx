import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { AgGridReact } from 'ag-grid-react';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import CustomModal from 'components/Shared/Modal';
import { useAuth } from 'Context/authContext';
import { getRowHeight } from 'helper/lib';
import UserProfile from 'pages/Profile/Components/UserProfile';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { spcialChar, VerifyUserSchema } from 'Schema';
import { VerifyUser } from 'Types';

const AllStaff = ({
  allUsers,
  tabIndex,
  HandleCTA,
  verifyLoading,
  blockedLoading,
  reFetchData,
}: any) => {
  const { authUser } = useAuth();
  const allUsersLocal =
    allUsers &&
    Object?.values(allUsers)?.filter(
      (user: any) => user && user?.role !== 'Admin',
    );

  const activeUsers =
    allUsers &&
    Object?.values(allUsers)?.filter(
      (user: any) => user && user?.role === 'Authorized' && user.isVerified,
    );

  const unVerifiedUsers =
    allUsers &&
    Object?.values(allUsers)?.filter(
      (user: any) => user && user?.role === 'Authorized' && !user.isVerified,
    );

  const blockedUsers =
    allUsers &&
    Object?.values(allUsers)?.filter(
      (user: any) => user && user?.role === 'Blocked',
    );

  const admins =
    allUsers &&
    Object?.values(allUsers)?.filter(
      (user: any) =>
        user && user?.role === 'Admin' && user.uid !== authUser.uid,
    );

  const users = [
    allUsersLocal,
    activeUsers,
    unVerifiedUsers,
    blockedUsers,
    admins,
  ];

  const [viewProfile, setViewProfile] = useState(false);
  const [activeIndex, setActiveIndex] = useState();

  const [showVerifyUserModal, setShowVerifyUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<VerifyUser>({
    defaultValues: {
      userId: String(
        Math.max(
          ...[
            ...allUsers
              .filter((val: any) => !!val.employeeId)
              .flatMap((item: any) => +item.employeeId ?? 1),
          ],
        ) + 1,
      ).padStart(5, '0'),
    },
    resolver: yupResolver(VerifyUserSchema),
  });

  useEffect(() => {
    reset({
      userId: String(
        Math.max(
          ...[
            ...allUsers
              .filter((val: any) => !!val.employeeId)
              .flatMap((item: any) => +item.employeeId),
          ],
        ) + 1,
      ).padStart(5, '0'),
    });
  }, [allUsersLocal.length]);

  const watchAllFields = watch(); // react hook form watch all fields

  const gridRef: any = useRef();
  const [rowData, setRowData] = useState([]);
  const toast = useToast();
  const onSubmit = async (e: any) => {
    setIsLoading(true);
    let lastEmployeeId = [
      ...allUsers
        .filter((val: any) => !!val.employeeId)
        .flatMap((item: any) => +item.employeeId),
    ];
    let newEmployeeId = parseFloat(e.userId);
    if (
      newEmployeeId <= lastEmployeeId[0] ||
      isNaN(newEmployeeId) ||
      lastEmployeeId.includes(newEmployeeId) ||
      spcialChar.includes(e)
    ) {
      setIsLoading(false);
      return toast({
        title: `Employee id ${newEmployeeId} is incorrect!, last employee id is ${lastEmployeeId?.[0]}`,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    }

    HandleCTA({
      key: 'verify',
      value: selectedUser?.isVerified,
      uid: selectedUser?.uid,
      cyUserId: e.userId,
      gridapi: gridRef,
      userData: selectedUser,
    });
    setActiveIndex(selectedUser?.uid);
    setIsLoading(false);
    setShowVerifyUserModal(false);
  };

  const ModalBodyContent = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} w={'full'} maxW={'100%'} rounded={'xl'}>
        <Text fontSize={{ base: 'sm', sm: 'md' }}>
          Assign Employee id to verify this employee.
        </Text>

        <CustomInput
          id={'userId'}
          placeholder=""
          type="text"
          labelPlaceholder="User id"
          register={{ ...register('userId') }}
          error={errors.userId?.message}
          disable={isLoading || verifyLoading}
        />
        {/* <FormControl>
          <FormLabel htmlFor="verifyuser">Employee id</FormLabel>
          <Input
            type="number"
            id={'verifyuser'}
            defaultValue={String(
              Math.max(
                ...[
                  ...allUsers
                    .filter((val: any) => !!val.employeeId)
                    .flatMap((item: any) => +item.employeeId),
                ],
              ) + 1,
            ).padStart(5, '0')}
          />
        </FormControl> */}

        <CustomButton text="Submit" isLoading={isLoading || verifyLoading} />
      </Stack>
    </form>
  );

  const [columnDefs] = useState([
    {
      headerName: 'S. No',
      valueGetter: 'node.rowIndex + 1',
      filter: true,
      minWidth: 70,
    },
    {
      headerName: 'Emp Id',
      field: 'employeeId',
      filter: true,
      minWidth: 70,
    },
    {
      headerName: 'Name',
      field: 'fullName',
      cellRendererFramework: ProfilePictureComponent,
      filter: true,
      minWidth: 250,
    },
    { headerName: 'Email', field: 'email', minWidth: 200 },
    { headerName: 'Gender', field: 'gender', minWidth: 50, filter: false },
    { headerName: 'Phone', field: 'phone', minWidth: 100 },
    {
      headerName: 'Is Email Verified',
      field: 'isEmailVerified',
      minWidth: 100,
    },
    {
      headerName: 'Action',
      filter: false,
      minWidth: 350,
      cellRendererFramework: (params: any) =>
        ActionComponent({
          params,
          verifyLoading,
          activeIndex,
          setShowVerifyUserModal,
          setActiveIndex,
          setSelectedUser,
          blockedLoading,
          HandleCTA,
          setViewProfile,
          reFetchData,
          gridRef,
        }),
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
    gridRef.current.rowHeight = 350;
    gridRef?.current?.api?.sizeColumnsToFit();
  };
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  useEffect(() => {
    setRowData(users[tabIndex || 0]);
    gridRef?.current?.api?.setDomLayout('autoHeight');
    gridRef?.current?.api?.sizeColumnsToFit();
  }, [tabIndex, allUsers]);
  return (
    <Box
      sx={{ width: '100%', height: '100%', padding: 0 }}
      style={containerStyle}
    >
      <div
        className="ag-theme-alpine"
        // style={{ width: '100%', maxHeight: 800 }}
        style={gridStyle}
      >
        <AgGridReact
          ref={gridRef}
          enableCellChangeFlash={true}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={defaultColDef as any}
          floatingFiltersHeight={50}
          animateRows={true}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          rowHeight={350}
          onGridReady={OnGridReady}
          getRowHeight={getRowHeight}
          suppressRowClickSelection={true}
        ></AgGridReact>
      </div>
      {!!viewProfile && (
        <CustomModal
          openModal={!!viewProfile}
          handleOpenModal={setViewProfile}
          modalHeading={'View Profile'}
          modalBodyContent={
            <UserProfile
              parentStyle={{ padding: 0 }}
              child1Style={{ width: '100%', padding: 0 }}
              selectedUser={viewProfile}
              adminModal={true}
              reFetchData={reFetchData}
              closeModal={setViewProfile}
            />
          }
          modalFooterContent={<></>}
        />
      )}
      {showVerifyUserModal && (
        <CustomModal
          openModal={!!showVerifyUserModal}
          handleOpenModal={setShowVerifyUserModal}
          modalHeading={'Verify User'}
          modalBodyContent={ModalBodyContent}
          modalFooterContent={<></>}
        />
      )}
    </Box>
  );
};

export default AllStaff;

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
      <Text display={'flex'} alignItems={'center'} justifyContent={'center'}>
        {params.data.fullName}
      </Text>
      {params?.data?.profilePicture ? (
        <Image
          mr={3}
          borderRadius={'50%'}
          boxShadow={'1px 2px 5px black'}
          objectFit={'cover'}
          display={'flex'}
          alignItems={'center'}
          src={params?.data?.profilePicture || ''}
          className="my-spinner"
          style={{ width: '50px', height: '50px' }}
        />
      ) : (
        <Avatar
          boxShadow={'1px 2px 5px black'}
          sx={{ width: '50px', height: '50px' }}
          display={'flex'}
          alignItems={'center'}
          // width={'40px'}
          mr={3}
          textAlign={'center'}
          // size={'md'}
          // name={params.data?.fullName}
          objectFit={'cover'}
        />
      )}
    </Box>
  );
};

const ActionComponent = ({
  params,
  verifyLoading,
  activeIndex,
  setShowVerifyUserModal,
  setActiveIndex,
  setSelectedUser,
  blockedLoading,
  HandleCTA,
  setViewProfile,
  gridRef,
}: any) => {
  const { data } = params || {};
  let isDisabledVerifyBtn = data?.isVerified || !data.isEmailVerified;
  return (
    <>
      <Tooltip
        hasArrow
        isDisabled={data.isEmailVerified}
        label={`Can not verify this user as ${
          data?.gender === 'Male' ? 'his' : 'her'
        } email is not verified.`}
        bg="orange.400"
        borderRadius={10}
        placement="auto"
      >
        <Box>
          <CustomButton
            colorScheme="blue"
            text={data?.isVerified ? 'Verified' : 'Verify'}
            disabled={isDisabledVerifyBtn}
            isLoading={verifyLoading && activeIndex === data?.uid}
            onClick={() => {
              setShowVerifyUserModal(true);
              setActiveIndex(params.data?.uid);
              setSelectedUser(params.data);
            }}
            buttonStyleProps={{
              width: '100px',
              backgroundColor: isDisabledVerifyBtn ? 'gray' : '#2b6cb0',
              _hover: {
                background: isDisabledVerifyBtn ? 'gray' : '#2b6cb0',
              },
              marginRight: 5,
            }}
          />
        </Box>
      </Tooltip>
      <Tooltip
        hasArrow
        isDisabled={data.isVerified}
        label={`Can not block un verified user.`}
        bg="orange.400"
        borderRadius={10}
        placement="auto"
      >
        <Button
          mr={3}
          isLoading={blockedLoading && activeIndex === data?.uid}
          isDisabled={
            (blockedLoading && activeIndex === data?.uid) || !data.isVerified
          }
          onClick={() => {
            HandleCTA({
              key: 'block',
              value: data?.role,
              uid: data?.uid,
              gridapi: gridRef,
              userData: data,
            });
            setActiveIndex(data?.uid);
          }}
        >
          {data?.role === 'Blocked' ? 'UnBlock' : 'Block'}
        </Button>
      </Tooltip>
      <Button onClick={() => setViewProfile(data)} cursor={'pointer'}>
        View Profile
      </Button>
    </>
  );
};

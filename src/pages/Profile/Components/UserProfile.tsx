// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputLeftAddon,
  Stack,
  Text,
  InputLeftElement,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import CustomRadio from 'components/Shared/FormControls/CustomRadio';
import CustomInput from 'components/Shared/FormControls/CustomInput';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UpdateProfileInputs } from 'Types';
import { UpdateProfileSchema } from 'Schema';
import {
  FormatedDateTime,
  SaveEvent,
  updateUserData,
  UpdateUserRole,
  uploadToStorage,
} from 'helper/lib';
import { useAuth } from 'Context/authContext';
import { BsPencilSquare } from 'react-icons/bs';

type Props = {
  parentStyle?: Object;
  child1Style?: Object;
  selectedUser?: Object;
  adminModal?: boolean;
  reFetchData?: () => void;
  closeModal?: (e) => void;
};
const UserProfile = (props: Props) => {
  const { authUser } = useAuth();
  const {
    parentStyle,
    child1Style,
    selectedUser,
    adminModal,
    reFetchData,
    closeModal,
  } = props || {};
  const [loading, setLoading] = useState(false);
  const [makeAdminLoading, setMakeAdminLoading] = useState(false);
  const toast = useToast();

  const user =
    authUser.role === 'Admin' && adminModal ? selectedUser : authUser; // admin will use selected user id else current authenticated user id will be used
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInputs>({
    resolver: yupResolver(UpdateProfileSchema),
  });

  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phone: String(user.phone),
      profilePicture: user.profilePicture,
      designation: user.designation || 'New User',
      salary: user?.payroll?.netSalary || '-',
      workingDays: user?.workingDays || 6,
      fromTime: user?.timing?.fromTime || '',
      toTime: user?.timing?.toTime || '',
    });
    setImage(user.profilePicture);
  }, [user.uid]);
  const onSubmit = async (data: UpdateProfileInputs) => {
    if (user.profilePicture === image && !isDirty && !loading) return;
    const UID = user.uid;
    SaveEvent(authUser.fullName, 'Updated profile', authUser.role === 'Admin');
    setLoading(true);
    const updates = {};
    let uploadedUrl = '';
    if (typeof image == 'object') {
      const uploadUrl = await uploadToStorage(image, UID);
      uploadUrl?.url && setImage(uploadUrl.url);
      uploadedUrl = uploadUrl?.url;
      updates[`Users/${UID}/profilePicture`] = uploadedUrl;
    }
    updates[`Users/${UID}/firstName`] = data.firstName;
    updates[`Users/${UID}/lastName`] = data.lastName;
    updates[`Users/${UID}/fullName`] = `${data.firstName} ${data.lastName}`;

    if (authUser.role === 'Admin' && adminModal) {
      updates[`Users/${UID}/designation`] = data.designation;
      updates[`Users/${UID}/workingDays`] = data.workingDays;
      updates[`Users/${UID}/timing`] = {
        fromTime: data.fromTime,
        toTime: data.toTime,
      };
    }

    updates[`Users/${UID}/phone`] = data.phone;
    const { success, error } = await updateUserData(updates);
    if (success) {
      if (authUser.role === 'Admin' && adminModal) {
        reFetchData((prev) => !prev);
      }

      toast({
        title: `Profile Saved Successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    } else {
      toast({
        title: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
  };
  const [image, setImage] = useState<File | Blob | string>(user.profilePicture);

  const adminModalCheck = authUser.role === 'Admin' && adminModal;
  const userRoles = ['Authorized', 'Admin'];
  const HandleMakeAdmin = async () => {
    const newRole = user.role === 'Authorized' ? 'Admin' : 'Authorized';
    setMakeAdminLoading(true);
    if (!userRoles.includes(user.role) || !user.isVerified) {
      toast({
        title: `Selected user role is ${user.role} with verification status ${user.isVerified}, which can not directly be an ${newRole} user.`,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      const response = await UpdateUserRole(user.uid, newRole);
      if (response.error) {
        toast({
          title: response.error,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        reFetchData((prev) => !prev);
        toast({
          title: 'Status updated successfully!',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top-right',
        });
        closeModal(false);
      }
    }
    setMakeAdminLoading(false);
  };

  const HandleFileChange = (event) => {
    if (!event.target.files) return;
    if (new RegExp('image/*').test(event.target.files[0].type)) {
      setImage(event.target.files?.[0] as File);
    } else {
      toast({
        title: 'Error: Invalid file format!',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const genderPronoun = user.gender === 'Male' ? 'him' : 'her';
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        padding={5}
        backgroundColor={'white'}
        borderRadius={12}
        justifyContent={'center'}
        display={'flex'}
        {...parentStyle}
      >
        <Box
          justifyContent={'center'}
          width={{ sm: '100%', md: '80%', lg: '80%', xl: '70%' }}
          {...child1Style}
        >
          <FormControl marginBottom={5}>
            <FormLabel htmlFor="empId" fontWeight={'normal'}>
              Employee Id
            </FormLabel>
            <Input
              id="empId"
              type="text"
              disabled
              value={user.employeeId ?? 'Not assigned'}
            />
          </FormControl>
          <Flex display={{ sm: 'block', md: 'flex' }}>
            <FormControl mr="5%" marginBottom={5}>
              <FormLabel htmlFor="firstName" fontWeight={'normal'}>
                First name
              </FormLabel>
              <Input
                id="firstName"
                placeholder="First name"
                {...register('firstName')}
              />
              <Text color="red">{errors?.firstName?.message}</Text>
            </FormControl>

            <FormControl marginBottom={5}>
              <FormLabel htmlFor="lastName" fontWeight={'normal'}>
                Last name
              </FormLabel>
              <Input
                id="lastName"
                placeholder="First name"
                {...register('lastName')}
              />
              <Text color="red">{errors?.lastName?.message}</Text>
            </FormControl>
          </Flex>
          <FormControl marginBottom={5}>
            <FormLabel htmlFor="email" fontWeight={'normal'}>
              Email address
            </FormLabel>
            <Input id="email" type="email" disabled value={user.email} />
          </FormControl>
          <Stack spacing={3} marginBottom={5}>
            <CustomRadio
              label={'Gender'}
              values={['Male', 'Female', 'Other']}
              defaultValue={user.gender}
              disabled={!!user.gender}
            />
          </Stack>
          <Stack spacing={3} marginBottom={5}>
            <CustomInput
              id={'phone'}
              type="tel"
              labelPlaceholder={'Phone Number'}
              placeholder={'3243289444'}
              register={{ ...register('phone') }}
              error={errors.phone?.message}
              restInputProps={{
                max: 10,
                maxLength: 10,
                pattern: '[0-9]{0,10}',
              }}
              leftSideElement={
                <InputLeftElement top={'24px'} zIndex={0}>
                  <InputLeftAddon
                    children="+92"
                    position={'absolute'}
                    left={0}
                  />
                </InputLeftElement>
              }
            />
          </Stack>
          <FormControl marginBottom={5}>
            <FormLabel htmlFor="designation" fontWeight={'normal'}>
              Designation
            </FormLabel>
            <Input
              id="designation"
              disabled={!adminModalCheck}
              placeholder="Designation"
              // value={user.designation}
              {...register('designation')}
            />
            <Text color="red">{errors?.designation?.message}</Text>
          </FormControl>

          <FormControl marginBottom={5}>
            <FormLabel fontWeight={'normal'}>Office Hour</FormLabel>
            <Flex justifyContent={'space-between'}>
              <Box width={'45%'}>
                <FormLabel width={'42px'} htmlFor="fromTime">
                  From:
                </FormLabel>
                <Input
                  disabled={!adminModalCheck}
                  {...register('fromTime')}
                  id="fromTime"
                  placeholder="Select Date and Time"
                  size="md"
                  type="time"
                />
              </Box>
              <Box width={'45%'}>
                <FormLabel width={'22px'} htmlFor="toTime">
                  To:
                </FormLabel>
                <Input
                  disabled={!adminModalCheck}
                  {...register('toTime')}
                  id="toTime"
                  placeholder="Select Date and Time"
                  size="md"
                  type="time"
                />
              </Box>
            </Flex>
          </FormControl>
          {adminModalCheck && (
            <>
              <FormControl marginBottom={5}>
                <FormLabel htmlFor="salary" fontWeight={'normal'}>
                  Net Salary
                </FormLabel>
                <Input
                  disabled={true}
                  id="salary"
                  // value={user.designation}
                  {...register('salary')}
                />
              </FormControl>
              <FormControl marginBottom={5}>
                <FormLabel htmlFor="workingDays" fontWeight={'normal'}>
                  Working Days
                </FormLabel>
                <Input
                  id="workingDays"
                  // value={user.designation}
                  {...register('workingDays')}
                />
              </FormControl>

              <Text color={'gray'} mb={5}>
                Role: {user.role}
              </Text>
              <Text color={'gray'}>
                Account Created on: {FormatedDateTime(user.accountCreatedOn)}
              </Text>
              <CustomButton
                colorScheme="red"
                text={
                  user.role === 'Authorized'
                    ? `Make ${genderPronoun} admin`
                    : `Remove ${genderPronoun} Admin`
                }
                type="button"
                onClick={HandleMakeAdmin}
                isLoading={makeAdminLoading}
                disabled={loading || makeAdminLoading}
                buttonStyleProps={{ marginTop: 5 }}
              />
            </>
          )}

          <Flex
            justifyContent={adminModalCheck ? 'space-between' : 'center'}
            alignItems={'center'}
            marginTop={25}
          >
            <CustomButton
              disabled={
                !adminModalCheck &&
                user.profilePicture === image &&
                !isDirty &&
                !loading
              }
              text="Save"
              isLoading={loading}
              buttonStyleProps={{ width: '45%' }}
            />
            {adminModalCheck && (
              <CustomButton
                type="button"
                text="Cancel"
                disabled={loading}
                onClick={() => closeModal(false)}
                buttonStyleProps={{ width: '45%' }}
              />
            )}
          </Flex>
        </Box>
      </Box>
    </form>
  );
};

export default UserProfile;

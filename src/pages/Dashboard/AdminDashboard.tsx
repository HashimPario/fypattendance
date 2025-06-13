// @ts-nocheck
import { Box } from '@chakra-ui/react';
import Quote from 'components/Quote';
import { useAuth } from 'Context/authContext';
import { getAllUsersList } from 'helper/lib';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Activity from './Components/Activity';
import UserGrid from './Components/UsersGrid';

const AdminDashboard = () => {
  const todayDate = new Date().getDate();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [allUsersError, setAllUsersError] = useState('');
  const navigate = useNavigate();
  const { authUser } = useAuth();
  useEffect(() => {
    getAllUsersList(setAllUsers,setAllUsersError);
  }, []);

  useEffect(() => {
    if (allUsers.length) {
      setFilteredUsers({
        allActiveUsers: allUsers.filter(
          (item) => item.role === 'Authorized' && item.isVerified,
        ),
        presentUsers: allUsers.filter(
          (item) =>
            item.role === 'Authorized' &&
            item.isVerified &&
            new Date(item.lastCheckedIn).getDate() === todayDate,
        ),
      });
    }
  }, [allUsers]);
  const validRoles = ['Authorized', 'Admin'];

  useEffect(() => {
    if (
      validRoles.includes(authUser.role) &&
      authUser.isEmailVerified &&
      authUser.role !== 'Blocked'
    ) {
      navigate('/dashboard');
    }
  }, []);


  return (
    <>
      <UserGrid data={filteredUsers} />
      <Box display={{ md: 'block', lg: 'flex' }} padding={10}>
        <Box width={{ xs: '100%', sm: '100%', md: '100%', lg: '75%' }}>
          <Quote />
        </Box>
        <Box width={{ xs: '100%', sm: '100%', md: '100%', lg: '25%' }}>
          <Activity />
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;

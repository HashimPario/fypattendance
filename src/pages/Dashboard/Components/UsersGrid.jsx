// @ts-nocheck
import React from 'react';
import { Box, SimpleGrid, Text, Tooltip } from '@chakra-ui/react';
import { IoIosPeople } from 'react-icons/io';
import { BsFillPersonFill } from 'react-icons/bs';
import { FcLeave } from 'react-icons/fc';
import { FaUsersSlash } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { getUniqueArray } from 'helper/lib';

const UserGrid = ({ data }) => {
  const sharedTextStyle = { textAlign: 'center', fontWeight: 'bold' };
  const { allActiveUsers, presentUsers } = data;
  const staffData = [
    {
      title: 'Total Active Employees',
      count: allActiveUsers?.length || 0,
      icon: (
        <Icon
          as={IoIosPeople}
          color={'blue.300'}
          fontSize={{ xs: 60, sm: 60, md: 60, lg: 70 }}
        />
      ),
      users: allActiveUsers,
    },
    {
      title: 'Present Today',
      count: presentUsers?.length || 0,
      icon: (
        <Icon
          as={BsFillPersonFill}
          color={'blue.300'}
          fontSize={{ xs: 60, sm: 60, md: 60, lg: 70 }}
        />
      ),
      users: presentUsers,
    },
    {
      title: 'Absent Today',
      count: allActiveUsers?.length - presentUsers?.length || 0,
      icon: (
        <Icon
          as={FaUsersSlash}
          color={'blue.300'}
          fontSize={{ xs: 60, sm: 60, md: 60, lg: 70 }}
        />
      ),
      users: getUniqueArray(allActiveUsers, presentUsers),
    },
    {
      title: 'On Leave',
      count: 0,
      icon: (
        <Icon
          as={FcLeave}
          color={'blue.300'}
          fontSize={{ xs: 60, sm: 60, md: 60, lg: 70 }}
        />
      ),
    },
  ];
  return (
    <SimpleGrid
      columns={{ sm: 2, md: 2, lg: 4 }}
      spacingX="20px"
      spacingY="20px"
      padding={10}
    >
      {staffData.map((item) => (
        <Tooltip
          key={item}
          hasArrow
          label={item?.users?.map((val) => val?.fullName).join(` | `)}
          bg="#7cb6ec"
          borderRadius={10}
          placement="auto"
        >
          <Box
            padding={5}
            bg="white"
            height="150px"
            key={item.title}
            borderRadius={5}
            display={'flex'}
            flexDir={'column'}
            justifyContent={'space-between'}
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Text {...sharedTextStyle} fontSize={35}>
                {item.count}
              </Text>
              <Text {...sharedTextStyle}>{item.icon}</Text>
            </Box>
            <Text {...sharedTextStyle}>{item.title}</Text>
          </Box>
        </Tooltip>
      ))}
    </SimpleGrid>
  );
};

export default UserGrid;

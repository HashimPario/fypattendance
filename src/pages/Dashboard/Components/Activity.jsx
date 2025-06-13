import { Box, Text } from '@chakra-ui/react';
import { getUserActivities } from 'helper/lib';
import React, { useEffect, useState } from 'react';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [cancelSubscription, setCancelSubscription] = useState();
  useEffect(() => {
    getUserActivities(setActivities, () => {}, setCancelSubscription);
    return () => {
      cancelSubscription?.cancel();
    };
  }, []);
  return (
    <Box
      background={'white'}
      height={300}
      maxH={250}
      padding={4}
      borderRadius={10}
      overflow={'auto'}
      mb={0}
    >
      <Text
        fontWeight={'bold'}
        color={'blue.300'}
        fontSize={22}
        mb={2}
        textAlign={'center'}
      >
        Activity log
      </Text>
      {Object.entries(activities)
        .sort((a, b) => b[0] - a[0])
        ?.map((item) => (
          <Text key={item[0]} borderBottom={'1px solid #e7e2e2'} mb={3}>
            {item[1]}
          </Text>
        ))}
    </Box>
  );
};

export default Activity;

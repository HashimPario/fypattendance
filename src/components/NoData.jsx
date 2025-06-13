import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const NoData = ({ text }) => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      flexWrap={'wrap'}
      overflow={'hidden'}
    >
      <Text
        display={'flex'}
        justifyContent={'center'}
        color={'gray.400'}
        sx={{ fontSize: { xs: 15, sm: 25, md: 30, lg: 35 } }}
        height={'65vh'}
        alignItems={'center'}
        textAlign={'center'}
        textOverflow={'ellipsis'}
        whiteSpace={'break-spaces'}
      >
        {text || 'No Data!'}
      </Text>
    </Box>
  );
};

export default NoData;

import React from 'react';
import { Box } from '@chakra-ui/react';
import Loader from './Loader';

function FullPageLoader() {
  return (
    <Box
      style={{
        width: '100vw',
        height: '80vh',
        display:"flex",
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader />
    </Box>
  );
}

export default FullPageLoader;

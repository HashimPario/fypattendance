import { Grid, Text } from '@chakra-ui/react';
import { NumberFormatter } from 'helper/lib';
import React from 'react';

const PayslipGrid = (props) => {
  const { data } = props;
  const basicStyle = {
    fontSize: '15px',
    fontWeight: 'bold',
  };
  const basicStyleRight = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
      {Object.entries(data).map(([name, value]) => {
        return (
          <>
            <Text {...basicStyle}>{name}</Text>

            <Text {...basicStyle} {...basicStyleRight}>
              {NumberFormatter(value)}
            </Text>
          </>
        );
      })}
    </Grid>
  );
};

export default PayslipGrid;

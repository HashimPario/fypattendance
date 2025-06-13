import { Input } from '@chakra-ui/react';
import React, { useState } from 'react';

const CustomInput = ({ value }) => {
  const [state, setState] = useState(value);
  return (
    <Input defaultValue={state} onChange={(e) => setState(e.target.value)} />
  );
};

export default CustomInput;

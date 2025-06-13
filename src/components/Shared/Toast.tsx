import React from 'react';
import { AlertStatus, useToast } from '@chakra-ui/react';

type Props = {
  type: AlertStatus;
  message: string;
};
const CustomToastHook = ({ type, message }: Props) => {
  const toast = useToast();
  const customToast = toast({
    title: message,
    status: type,
    duration: 9000,
    isClosable: true,
    position: 'top-right',
  });
  return [customToast];
};

export default CustomToastHook;

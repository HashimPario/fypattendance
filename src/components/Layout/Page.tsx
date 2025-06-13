import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './Theme';

type Props = {
  children: React.ReactNode;
};

const Page = ({ children }: Props) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default Page;

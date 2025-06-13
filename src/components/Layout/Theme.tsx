import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
  breakpoints: {
    xxs: '12em',
    xs: '15em',
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
});

export default theme;

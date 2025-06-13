import { Link } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  text: string;
  route?: string;
  sx?: any;
};
const CustomLink = (props: Props) => {
  let navigate = useNavigate();

  const { text, route, sx } = props;
  return (
    <Link
      sx={sx}
      color="#f8941e"
      onClick={() => (route ? navigate(route) : null)}
    >
      {text}
    </Link>
  );
};

export default CustomLink;

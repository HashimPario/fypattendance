import { Button } from '@chakra-ui/react';
import { useCallback } from 'react';
import Loader from '../Loader';

type Props = {
  text: string;
  rightIcon?: any;
  isLoading?: boolean;
  buttonStyleProps?: Object;
  disabled?: boolean;
  onClick?: (e?: any) => void;
  type?: ButtonType;
  colorScheme?: string;
  variant?: string;
  rightComponent?: any;
};

type ButtonType = 'submit' | 'reset' | 'button' | undefined;

const CustomButton = (props: Props) => {
  const {
    rightIcon,
    text,
    isLoading,
    buttonStyleProps,
    disabled,
    onClick,
    type,
    colorScheme,
    variant,
    rightComponent,
  } = props;

  // const onClickFunc = useCallback(() => {
  //   if (isLoading || disabled) {
  //     return;
  //   }
  //   onClick?.();
  // }, []);
  return (
    <Button
      variant={variant || 'solid'}
      type={type || 'submit'}
      colorScheme={colorScheme || 'blue'}
      width={'100%'}
      backgroundColor={isLoading || disabled ? 'gray' : ''}
      cursor={isLoading || disabled ? 'not-allowed' : 'pointer'}
      _hover={{ background: isLoading || (disabled && 'gray') }}
      rightIcon={!isLoading && rightIcon}
      disabled={isLoading || disabled}
      onClick={disabled ? () => {} : onClick}
      {...buttonStyleProps}
    >
      {isLoading ? <Loader /> : text}
      &nbsp; {rightComponent}
    </Button>
  );
};

export default CustomButton;

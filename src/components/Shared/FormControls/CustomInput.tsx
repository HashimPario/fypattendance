import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
} from '@chakra-ui/react';

type Props = {
  id: string;
  placeholder: string;
  register?: any;
  error: string | undefined;
  rightSideElement?: any;
  leftSideElement?: any;
  type?: string;
  labelPlaceholder?: string;
  disable?: boolean;
  autoFocus?: boolean;
  restInputProps?: any;
  defaultValue?: any;
  trigger?: any;
};
const CustomInput = (props: Props) => {
  const {
    id,
    placeholder,
    register,
    error,
    rightSideElement,
    leftSideElement,
    type = 'text',
    labelPlaceholder,
    disable,
    autoFocus,
    trigger,
    defaultValue,
    restInputProps,
  } = props;

  return (
    <InputGroup>
      <FormControl>
        <FormLabel htmlFor={id} mb={0}>
          {labelPlaceholder || placeholder}
        </FormLabel>
        <Input
          defaultValue={defaultValue}
          disabled={disable}
          id={id}
          placeholder={placeholder}
          autoFocus={autoFocus}
          {...register}
          type={type}
          pr={rightSideElement ? '4.5rem' : 'auto'}
          pl={leftSideElement ? '4.5rem' : 'auto'}
          {...restInputProps}
          onBlur={() => {
            trigger?.(id);
          }}
          onKeyUp={() => {
            trigger?.(id);
          }}
        />
        {leftSideElement && leftSideElement}
        {rightSideElement && rightSideElement}
        <Text color="red">{error}</Text>
      </FormControl>
    </InputGroup>
  );
};

export default CustomInput;

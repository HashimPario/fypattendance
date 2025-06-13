import React from 'react';
import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Text,
} from '@chakra-ui/react';

type Props = {
  label: string;
  values: string[];
  register?: any;
  error?: string | undefined | any;
  defaultValue?: string;
  disabled?:boolean
};

const CustomRadio = (props: Props) => {
  const { label, values, error, register, defaultValue,disabled } = props;
  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">{label}</FormLabel>
      <RadioGroup name="gender" id="gender" value={defaultValue} isDisabled={disabled}>
        <HStack spacing="24px">
          {values?.map((item, index) => (
            <Radio id={item} value={item} key={item} {...register}>
              {item}
            </Radio>
          ))}{' '}
        </HStack>
      </RadioGroup>
      <Text color="red">{error}</Text>
    </FormControl>
  );
};

export default CustomRadio;

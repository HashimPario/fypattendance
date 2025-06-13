import { Flex, Grid, Input, Icon, Text } from '@chakra-ui/react';
import CustomButton from 'components/Shared/FormControls/CustomButton';
import { TbTrash } from 'react-icons/tb';

const PayslipGridEditable = (props) => {
  const { data, addNewFieldClickHandler, updateData, deleteField, error } =
    props;
  const basicStyle = {
    fontSize: '15px',
    fontWeight: 'bold',
  };
  const basicStyleRight = {
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const ChangeHandler = (value, index, key) => {
    updateData(value, index, key);
  };

  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {data?.map(([name, value], index) => {
          return (
            <>
              <Input
                {...basicStyle}
                {...basicStyleRight}
                placeholder="New Item"
                value={name}
                onChange={(e) => ChangeHandler(e.target.value, index, 'key')}
              />
              <Flex alignItems={'center'} justifyContent={'center'}>
                <Input
                  type={'number'}
                  {...basicStyle}
                  {...basicStyleRight}
                  value={value}
                  placeholder="0"
                  onChange={(e) =>
                    ChangeHandler(e.target.value, index, 'value')
                  }
                />

                {index > 0 && (
                  <Icon
                    as={TbTrash}
                    ml={2}
                    mr={1}
                    _hover={{ color: 'red' }}
                    cursor={'pointer'}
                    onClick={() => deleteField(index)}
                  />
                )}
              </Flex>
            </>
          );
        })}

        <CustomButton
          text="Add new field"
          type="text"
          onClick={addNewFieldClickHandler}
        />
      </Grid>
      <Grid templateColumns="repeat(1, 1fr)" gap={1} mt={2}>
        <Text color="red" textAlign={'center'}>
          {error}
        </Text>
      </Grid>
    </>
  );
};

export default PayslipGridEditable;

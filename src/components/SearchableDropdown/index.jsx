import ReactSelect from 'react-select';

function SearchableDropdown({
  options,
  margin,
  register,
  Controller,
  control,
}) {
  return (
    <Controller
      name="ReactSelect"
      control={control}
      {...register}
      render={({ field }) => (
        <ReactSelect
          isClearable
          {...field}
          options={options}
          placeholder="Select User"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: '#e2e8f0',
              background: '#edf2f7',
              margin: margin,
            }),
          }}
        />
      )}
    />
  );
}

export default SearchableDropdown;

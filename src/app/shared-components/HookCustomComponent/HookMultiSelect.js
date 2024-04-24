import { Autocomplete, TextField } from "@mui/material";
import { get } from "lodash";
import { Controller } from "react-hook-form";

const HookMultiSelect = ({
  defaultValue = [],
  label,
  control,
  name,
  errors,
  options,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          multiple
          disablePortal
          {...rest}
          getOptionLabel={(option) => option.label}
          options={options}
          onBlur={field.onBlur}
          onChange={(ev, val) => field.onChange(val || [])}
          value={field.value}
          renderInput={(params) => (
            <TextField
              {...params}
              error={Boolean(get(errors, name))}
              helperText={get(errors, name)?.message}
              fullWidth
              name={name}
              label={label}
            />
          )}
        />
      )}
    />
  );
};

export default HookMultiSelect;

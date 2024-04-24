import { Autocomplete, TextField } from "@mui/material";
import { find, get } from "lodash";
import { Controller } from "react-hook-form";
// import { useTranslation } from "react-i18next";

const HookSelect = ({
  pageName = "",
  label,
  control,
  name,
  errors,
  options = [],
  defaultValue = null,
  readOnly,
  disabled,
  ...rest
}) => {
  //   const { t } = useTranslation(pageName);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Autocomplete
          {...rest}
          disablePortal
          multiple={false}
          getOptionLabel={(option) => option.label}
          options={options}
          onBlur={field.onBlur}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(ev, val) => field.onChange(val?.value || "")}
          value={find(options, { value: field.value }) ?? null}
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

export default HookSelect;

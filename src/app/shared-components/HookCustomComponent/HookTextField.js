import { TextField } from "@mui/material";
import { get } from "lodash";
import { Controller } from "react-hook-form";
// import { useTranslation } from "react-i18next";

const HookTextField = ({
  pageName = "",
  control,
  label,
  name,
  errors,
  defaultValue = "",
  type,
  ...rest
}) => {
  //   const { t } = useTranslation(pageName);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          multiline={false}
          label={label}
          name={name}
          type={type}
          error={Boolean(get(errors, name))}
          helperText={get(errors, name)?.message}
        />
      )}
    />
  );
};

export default HookTextField;

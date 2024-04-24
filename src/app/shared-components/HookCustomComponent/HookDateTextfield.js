import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IconButton, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { get } from "lodash";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";

const HookDateTextfield = ({
  pageName = "",
  control,
  label,
  name,
  errors,
  defaultValue = null,
  clearable = true,
  ...rest
}) => {
  // const { t } = useTranslation(pageName);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            PopperProps={{
              style: { zIndex: 200000000 },
            }}
            {...field}
            label={label}
            renderInput={(params) => {
              const ClearableIcon = () => {
                return (
                  <>
                    {field.value && (
                      <IconButton
                        onClick={() => field.onChange(null)}
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                );
              };

              return (
                <TextField
                  {...params}
                  {...rest}
                  name={name}
                  fullWidth
                  {...(clearable
                    ? { InputProps: { endAdornment: <ClearableIcon /> } }
                    : {})}
                  error={Boolean(get(errors, name))}
                  helperText={get(errors, name)?.message}
                  InputLabelProps={{ shrink: true }}
                />
              );
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default HookDateTextfield;

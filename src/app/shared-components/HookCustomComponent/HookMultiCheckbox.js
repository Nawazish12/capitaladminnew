import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller } from "react-hook-form";
import { get } from "lodash";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const HookMultiCheckbox = ({
  defaultValue = [],
  label,
  name,
  control,
  option,
  placeholder,
  errors,
}) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={option || []}
            disableCloseOnSelect
            onBlur={field.onBlur}
            onChange={(ev, value) => field.onChange(value || [])}
            value={field.value}
            getOptionLabel={(option) => option?.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </li>
            )}
            style={{ width: 560 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={Boolean(get(errors, name))}
                helperText={get(errors, name)?.message}
                fullWidth
              />
            )}
          />
        )}
      />
    </div>
  );
};

export default HookMultiCheckbox;

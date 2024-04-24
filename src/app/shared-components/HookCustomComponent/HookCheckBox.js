import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller } from "react-hook-form";
// import { useTranslation } from "react-i18next";

export default function HookCheckBox({
  pageName = "",
  name,
  label,
  control,
  defaultValue = false,
}) {
  //   const { t } = useTranslation(pageName);
  return (
    <div className="mb-19">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={field.onChange}
                name="checkedB"
                color="primary"
              />
            }
            label={label}
          />
        )}
      />
    </div>
  );
}

import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { DialogActions, DialogContent, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { object, string, bool } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import CustomLoader from "app/shared-components/CustomLoader";
import HookTextField from "app/shared-components/HookCustomComponent/HookTextField";
import { useEffect } from "react";
import HookCheckBox from "app/shared-components/HookCustomComponent/HookCheckBox";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = object().shape({
  name: string().required("NAME REQUIRED").default(""),
  username: string().required("USER NAME REQUIRED").default(""),
  email: yup
    .string()
    .email("NOT A PROPER EMAIL")
    .required("EMAIL REQUIRED")
    .default(""),
  password: string().required("PASSWORD REQUIRED").default(""),
  active: bool().default(false),
  reports: bool().default(false),
  configurations: bool().default(false),
});

export default function UserDialog({
  open,
  handleOpen,
  handleClose,
  type,
  dataForEdit,
  locId,
}) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: type === "edit" && dataForEdit,
    mode: "onChange",
  });

  useEffect(() => {
    if (type === "add" && open) {
      reset(dataForEdit);
    }
  }, [type]);
  console.log(dataForEdit);

  const { data: areasData = [] } = useQuery(
    ["areaDataSportsClub"],
    () => {
      return axios.get("/location");
    },
    {
      select: (res) =>
        res?.data?.data?.map((checkVal) => {
          return {
            value: checkVal?.id,
            label: checkVal?.name,
          };
        }),
    }
  );

  const { mutate: addLocation, isLoading: addLoading } = useMutation(
    (body) => axios.post("/user", body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }
        reset(schema);
        queryClient.invalidateQueries(["user_data_list"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editLocation, isLoading: editLoading } = useMutation(
    (body) => axios.put(`/user/${dataForEdit.id}`, body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }
        queryClient.invalidateQueries(["user_data_list"]);
        handleClose();
        // window.location.reload();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const onSubmit = (model) => {
    const body = {
      ...model,
      locationId: Boolean(model.locationId) ? model.locationId : null,
      parent_Id: locId,
    };

    if (type === "add") {
      addLocation(body);
    } else {
      editLocation(body);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="md"
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <CustomLoader isLoading={[addLoading, editLoading].includes(true)} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item md={6} sm={6} xs={12}>
                <HookTextField
                  control={control}
                  name="name"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="NAME "
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookTextField
                  control={control}
                  name="email"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="EMAIL"
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookSelect
                  control={control}
                  errors={errors}
                  options={areasData}
                  name="locationId"
                  label="Select location"
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <HookTextField
                  control={control}
                  name="username"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="USER NAME"
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookTextField
                  control={control}
                  name="password"
                  fullWidth
                  errors={errors}
                  type="password"
                  // pageName="mylink"
                  label="PASSWORD"
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookCheckBox
                  control={control}
                  name="active"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="Active"
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookCheckBox
                  control={control}
                  name="configurations"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="Configuration"
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <HookCheckBox
                  control={control}
                  name="reports"
                  fullWidth
                  errors={errors}
                  // pageName="mylink"
                  label="Report"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              // onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

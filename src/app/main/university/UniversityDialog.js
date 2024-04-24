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
import { object, string, number } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import CustomLoader from "app/shared-components/CustomLoader";
import HookTextField from "app/shared-components/HookCustomComponent/HookTextField";
import { useEffect } from "react";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import HookCheckBox from "app/shared-components/HookCustomComponent/HookCheckBox";
import { useQuery } from "@tanstack/react-query";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = object().shape({
  nameEn: string().required("NAME(ENGLISH) REQUIRED").default(""),
  nameAr: string().required("NAME(ARABIC) REQUIRED").default(""),
  address: string().required("ADDRESS REQURIED").default(""),
  city: string().required("ADDRESS REQURIED").default(""),
  zip: string().required("ZIP REQURIED").default(""),
  //   latitude: string().required("LATITUDE REQURIED").default(""),
  //   longitude: string().required("LONGITUDE REQURIED").default(""),
  governorate_Id: number().required("LONGITUDE REQURIED").default(""),
});

export default function UniverstiyDialog({
  open,
  handleOpen,
  handleClose,
  type,
  dataForEdit,
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

  const { mutate: addUniversity, isLoading: addLoading } = useMutation(
    (body) => axios.post("/university", body),
    {
      onSuccess: () => {
        enqueueSnackbar("University Add Sucessfully", {
          variant: "success",
        });
        reset(schema);

        queryClient.invalidateQueries(["getuniversityData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editUniversity, isLoading: editLoading } = useMutation(
    (body) => axios.put(`/university/${dataForEdit.id}`, body),
    {
      onSuccess: () => {
        enqueueSnackbar("University Update Sucessfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getuniversityData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { data: governorateData = [] } = useQuery(
    ["getGovernateData"],
    () => axios.get("/governorate", {}),
    {
      select: (res) =>
        res?.data?.data?.map((val) => {
          return {
            value: val.id,
            label: val.nameEn,
          };
        }),
      //   enabled: !!sectorId,
    }
  );

  const onSubmit = (model) => {
    const body = {
      ...model,
      specializations: [],
      longitude: "",
      latitude: "",
    };
    if (type === "add") {
      addUniversity(body);
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
                name="nameAr"
                fullWidth
                errors={errors}
                pageName="mylink"
                label="NAME ENGLISH"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                control={control}
                name="nameEn"
                fullWidth
                errors={errors}
                pageName="mylink"
                label="NAME ARABIC"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                control={control}
                name="address"
                fullWidth
                errors={errors}
                label="ADDRESS"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                control={control}
                name="city"
                fullWidth
                errors={errors}
                label="CITY"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                control={control}
                name="zip"
                fullWidth
                errors={errors}
                label="Zip"
              />
            </Grid>
            {/* <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                // valeue={dataForEdit?.nameAr}
                control={control}
                name="latitude"
                fullWidth
                errors={errors}
                label="LATITUDE"
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <HookTextField
                // valeue={dataForEdit?.nameAr}
                control={control}
                name="longitude"
                fullWidth
                errors={errors}
                label="LONGITUDE"
              />
            </Grid> */}
            <Grid item md={6} xs={12}>
              <HookSelect
                control={control}
                errors={errors}
                label="GOVERNORATE"
                name="governorate_Id"
                fullWidth
                options={governorateData}
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
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

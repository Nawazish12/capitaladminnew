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
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import CustomLoader from "app/shared-components/CustomLoader";
import HookTextField from "app/shared-components/HookCustomComponent/HookTextField";
import { useEffect } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const schema = object().shape({
  nameEn: string().required("NAME(ENGLISH) REQUIRED").default(""),
  nameAr: string().required("NAME(ARABIC) REQUIRED").default(""),
});

export default function GovernateDialog({
  open,
  handleOpen,
  handleClose,
  type,
  dataForEdit,
}) {
  //   const {
  //     dialogState: { open, dataForEdit, type },
  //     closeDialog,
  //   } = useMyLinkState();
  //   const defaultValues = schema.noUnknown().cast();

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

  //   useUpdateEffect(() => {
  //     if (type === "Edit" && open) {
  //       reset(schema.noUnknown().cast(dataForEdit));
  //     }
  //   }, [type, open]);

  useEffect(() => {
    if (type === "add" && open) {
      reset(dataForEdit);
    }
  }, [type]);

  const { mutate: addGovernate, isLoading: addLoading } = useMutation(
    (body) => axios.post("/governorate", body),
    {
      onSuccess: () => {
        enqueueSnackbar("Governorate Add Sucessfully", {
          variant: "success",
        });
        reset(schema);

        queryClient.invalidateQueries(["getGovernateData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editGovernorate, isLoading: editLoading } = useMutation(
    (body) => axios.put(`/governorate/${dataForEdit.id}`, body),
    {
      onSuccess: () => {
        enqueueSnackbar("Governorate Add Sucessfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getGovernateData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const onSubmit = (model) => {
    if (type === "add") {
      addGovernate(model);
    } else {
      editGovernorate(model);
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
                // valeue={dataForEdit?.nameAr}
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

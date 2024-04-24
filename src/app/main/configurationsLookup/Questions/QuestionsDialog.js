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
import _ from "@lodash";



const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuestionsDialog({
  open,
  handleOpen,
  handleClose,
  type,
  dataForEdit,
}) {
  const schema = object().shape({
    text: string().required("NAME(ENGLISH) REQUIRED").default(""),
    textAr: string().required("NAME(ARABIC) REQUIRED").default(""),
    textUr: string().required("NAME(URDU) REQUIRED").default(""),
  
  });

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
  console.log(errors, "erros");

  useEffect(() => {
    if (open) {
      reset(dataForEdit);
    }
  }, [type]);

  const { mutate: addBus, isLoading: addLoading } = useMutation(
    (body) => axios.post("/bus_stop", body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }

        reset(schema);
        queryClient.invalidateQueries(["get_questions_data"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editQuestion, isLoading: editLoading } = useMutation(
    (body) => axios.post(`/question/${dataForEdit.id}`, body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }
        queryClient.invalidateQueries(["get_questions_data"]);
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
    const body = {
      text:model.text,
      textAr:model.textAr,
      textUr:model.textUr
    };
    editQuestion(body);
    
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
          
              <>
                <Grid container spacing={2}>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="text"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME ENGLISH"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="textAr"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME ARABIC"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="textUr"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME URDU"
                    />
                  </Grid>
                
                </Grid>
                
              </>
           
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


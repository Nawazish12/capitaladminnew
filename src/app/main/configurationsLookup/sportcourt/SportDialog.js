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
import styled from "styled-components";
import { useState } from "react";
import _ from "@lodash";
import { toBase64 } from "@fuse/utils/toBase64";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HookCheckBox from "app/shared-components/HookCustomComponent/HookCheckBox";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SportDialog({
  open,
  handleOpen,
  handleClose,
  type,
  dataForEdit,
}) {
  const schema = object().shape({
    name: string().required("NAME(ENGLISH) REQUIRED").default(""),
    nameAr: string().required("NAME(ARABIC) REQUIRED").default(""),
    nameUr: string().required("NAME(URDU) REQUIRED").default(""),
    orderIndex:
      type === "add"
        ? number().required("ORDER INDEX REQUIRED").default("")
        : "",
    imageName:
      type === "add"
        ? string().required("IMAGE NAME REQUIRED").default("")
        : "",
    sportCourtType:
      type === "add" ? number().required("TYPE REQUIRED").default("") : "",
  });
  const queryClient = useQueryClient();
  const [file, setFile] = useState(dataForEdit?.image || {});

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

  const { mutate: addSportCourt, isLoading: addLoading } = useMutation(
    (body) => axios.post("/sport_court", body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }

        reset(schema);
        queryClient.invalidateQueries(["getsportcourtData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editSportCourt, isLoading: editLoading } = useMutation(
    (body) => axios.post(`/sport_court/${dataForEdit.id}`, body),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }
        queryClient.invalidateQueries(["getsportcourtData"]);
        handleClose();
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const uploadFile = async (ev) => {
    const file = ev.target.files[0];

    if (!file) {
      return;
    }

    const name = file?.name;
    const size = String(file?.size);
    const fileExtension = file?.name.split(".").pop();
    const fileContent = await toBase64(file);
    setFile({
      file_name: name,
      file_path: "",
      file_size: size,
      file_type: 2,
      file_content: fileContent,
      file_extension: fileExtension,
    });
  };

  const onSubmit = (model) => {
    const body = {
      ...model,
      image: file,
    };
    const editPayload = {
      name: model.name,
      nameAr: model.nameAr,
      nameUr: model.nameUr,
    };
    if (type === "add") {
      addSportCourt(body);
    } else {
      editSportCourt(editPayload);
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
            {type === "add" ? (
              <>
                <Grid container spacing={2}>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="name"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME ENGLISH"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="nameAr"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME ARABIC"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="nameUr"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="NAME URDU"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="orderIndex"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="ORDER INDEX"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="imageName"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="IMAGE NAME"
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <HookTextField
                      control={control}
                      name="sportCourtType"
                      fullWidth
                      errors={errors}
                      // pageName="mylink"
                      label="SPORTS COURT TYPE"
                    />
                  </Grid>

                  {/* for image  */}
                </Grid>
                <div className="mt-[2em] ">
                  <label htmlFor="upload-file">
                    <div
                      className="flex flex-col items-center justify-center w-full max-h-56 rounded py-44 border-2 border-grey-200 border-dashed"
                      role="button"
                    >
                      {_.isEmpty(file) ? (
                        <div className="flex flex-col justify-center items-center">
                          <AddCircleOutlineIcon />
                        </div>
                      ) : (
                        <StyledText
                          fontSize={16}
                          fontWeight={400}
                          lineHeight={24}
                          color="#596579"
                        >
                          <img
                            src={
                              file?.file_path ||
                              `data:image/${file?.file_extension};base64,${file?.file_content}`
                            }
                            alt="img"
                            style={{ width: "100%", height: "80px" }}
                          />
                        </StyledText>
                      )}
                    </div>
                    {/* </div> */}

                    <input
                      className="hidden"
                      name="image"
                      accept=".jpg, .jpeg, .png"
                      id="upload-file"
                      type="file"
                      onChange={uploadFile}
                    />
                    {/* {!_.isEmpty(file) && <button onClick={removePic}>remove pic</button>} */}
                  </label>
                </div>
              </>
            ) : (
              <Grid container spacing={2}>
                <Grid item md={6} sm={6} xs={12}>
                  <HookTextField
                    control={control}
                    name="name"
                    fullWidth
                    errors={errors}
                    // pageName="mylink"
                    label="NAME ENGLISH"
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <HookTextField
                    control={control}
                    name="nameAr"
                    fullWidth
                    errors={errors}
                    // pageName="mylink"
                    label="NAME ARABIC"
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <HookTextField
                    control={control}
                    name="nameUr"
                    fullWidth
                    errors={errors}
                    // pageName="mylink"
                    label="NAME URDU"
                  />
                </Grid>
              </Grid>
            )}
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

const StyledText = styled.p`
  font-size: ${(props) => props.fontSize || 14}px;
  line-height: ${(props) => props.lineHeight || 20}px;
  font-weight: ${(props) => props.fontWeight || 500};
  color: ${(props) => props.color || "black"};
  margin-bottom: ${(props) => props.mb || 0}px;
`;

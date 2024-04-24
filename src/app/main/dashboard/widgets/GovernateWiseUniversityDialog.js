import React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import { AppBar, Toolbar } from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function GovernateWiseUniversityDialog({
  open,
  handleOpen,
  handleClose,
  widgetData,
  dataSend,
}) {
  const dataToDisplay = widgetData?.find((displayData) => {
    if (displayData?.governoratesEn === dataSend?.x) {
      return displayData;
    }
  });

  return (
    <div>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
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
          <React.Fragment>
            <h1 className="p-10 font-semibold">
              Universities in {dataToDisplay.governoratesEn}
            </h1>
            {dataToDisplay?.universities?.map((universityData, i) => {
              return (
                <div key={i}>
                  {/* <h1>{dataToDisplay?.governoratesEn}</h1> */}
                  <div className="flex justify-between px-6">
                    <h3 className="p-8 font-semibold">
                      <span>({i + 1})</span>
                      &nbsp; &nbsp; {universityData.universityEn}
                    </h3>
                    <h3 className="p-8 font-semibold">
                      {universityData?.staffCount}
                    </h3>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button variant="contained" color="primary">
            Submit
          </Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

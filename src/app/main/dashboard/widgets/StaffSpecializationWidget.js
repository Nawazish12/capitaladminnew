/* eslint-disable no-nested-ternary */
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import LinearProgress from "@mui/material/LinearProgress";

function StaffSpecializationWidget({ widgetData = [] }) {
  console.log(widgetData, "widgetData");
  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden ">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
            Specialization Wise Staff
          </Typography>
        </div>
      </div>

      <div className="my-32 space-y-32 max-h-360 overflow-y-auto">
        <div className="flex flex-col">
          {widgetData?.map((val) => (
            <div
              key={val.specializationEn}
              className="flex items-center space-x-16 mb-9"
            >
              <div className="flex-auto leading-none">
                <div className="flex justify-between items-end">
                  <div>
                    <Typography
                      className="text-12 font-medium"
                      color="text.secondary"
                    >
                      {val.specializationEn ?? ""}
                    </Typography>
                    <Typography className="font-medium text-20">
                      {val?.staffCount?.toLocaleString("en-US")}
                    </Typography>
                  </div>
                  <div>
                    <Typography
                      className="font-medium text-20"
                      color="text.secondary"
                    >
                      {val.staffPercentage ?? ""}%
                    </Typography>
                  </div>
                </div>

                <LinearProgress
                  variant="determinate"
                  className="mt-4"
                  color={
                    val.staffCount % 3 === 0
                      ? "success"
                      : val.staffCount % 2 === 0
                      ? "info"
                      : "primary"
                  }
                  val={val.staffCount}
                  value={val.staffPercentage || 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}

export default memo(StaffSpecializationWidget);

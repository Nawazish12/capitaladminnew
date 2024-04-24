import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

function StatBox({ label, amount }) {
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden min-h-136">
      <div className="flex items-start justify-between m-24 mb-0">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate text-grey-700">
          {label}
        </Typography>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center mx-24 mt-12">
        <Typography className="text-7xl font-bold tracking-tighter leading-tight">
          {amount}
        </Typography>
      </div>
    </Paper>
  );
}

export default React.memo(StatBox);

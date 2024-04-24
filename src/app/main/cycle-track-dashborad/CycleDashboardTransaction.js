import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import { useForm } from "react-hook-form";
import moment from "moment";
import { isEmpty } from "lodash";

const CycleDashboardTransaction = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchStartDate = watch("start");
  const startIsoFormat = moment(watchStartDate)
    .utc()
    .format("YYYY-MM-DD HH:mm");
  const watchEndDate = watch("end");
  const endIsoFormat = moment(watchEndDate).utc().format("YYYY-MM-DD HH:mm");

  const { data, refetch } = useQuery(
    ["get_export_all_details"],
    () => {
      return axios.get(`/export?start=${startIsoFormat}&end=${endIsoFormat}`);
    },
    {
      enabled: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          window.open(res?.data?.data, "_blank");
        }
      },
    }
  );

  return (
    <div>
      <div className="flex space-x-6 items-center">
        <div>
          <HookDateTextfield
            name="start"
            control={control}
            label="Start Date"
          />
        </div>
        <div>
          <HookDateTextfield name="end" control={control} label="End Date" />
        </div>
        <Button
          variant="contained"
          className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
          onClick={refetch}
          disabled={!(watchStartDate && watchEndDate)}
        >
          Export All Details
        </Button>
      </div>
    </div>
  );
};

export default CycleDashboardTransaction;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import { useForm } from "react-hook-form";
import moment from "moment";
import { isEmpty } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";

const TransactionView = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const StartDate = watch("start");
  const endDate = watch("end");
  const isADResident = watch("isADResident");

  const { data, refetch, isLoading, isFetching } = useQuery(
    ["get_export_all_details"],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get(`/export`, {
        params: {
          ...newParams,
          isADResident,
        },
      });
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
    <div className="mt-[2rem] ml-[1rem]">
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
        <div className="w-[250px]">
          <HookSelect
            label="Abudhabi Resident"
            name="isADResident"
            control={control}
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
          />
        </div>
        <Button
          variant="contained"
          className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
          onClick={refetch}
          // loading={isLoading && <CircularProgress />}

          disabled={!(StartDate && endDate)}
        >
          Export All Details &nbsp;{" "}
          {isFetching && <CircularProgress sx={{ width: 20, height: 20 }} />}
        </Button>
      </div>
    </div>
  );
};

export default TransactionView;

import { Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import EnhancedTable from "app/shared-components/enhancedTable";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React from "react";

const CommunityFacilityLeftTab = ({
  StartDate,
  endDate,
  sendId,
  isADResident,
  locationId,
  singleSelect,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { data: toptenData = [], isLoading } = useQuery(
    [
      "topTen_community_facility",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      singleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("community_facility_dashboard/stats_table", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { data, refetch } = useQuery(
    ["communityFacility_excel_data"],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("community_facility_dashboard/export", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
        },
      });
    },
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          window.open(res?.data?.data, "_blank");
          enqueueSnackbar("Data Successfully Export to Excel", {
            variant: "success",
          });
        }
      },
      onError: (error) => {
        enqueueSnackbar(error?.message, {
          variant: "error",
        });
      },
      enabled: false,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Count",
        accessor: "count",
      },
      {
        Header: "Percentage",
        accessor: "percentage",
        Cell: ({ row }) => (
          <div>
            <Typography>{Math.round(row?.original?.percentage)}</Typography>
          </div>
        ),
      },
    ],
    [toptenData]
  );
  return (
    <div>
      <div className="pl-[1rem] flex space-x-20 items-center ">
        {" "}
        <Button
          variant="contained"
          className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
          onClick={() => {
            refetch();
          }}>
          Export to Excel
        </Button>
      </div>
      <div className="mt-[5rem] mx-[1px]">
        <EnhancedTable
          columns={columns}
          data={toptenData ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CommunityFacilityLeftTab;

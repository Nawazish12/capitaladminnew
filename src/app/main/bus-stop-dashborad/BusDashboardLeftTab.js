import { Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import EnhancedTable from "app/shared-components/enhancedTable";
import axios from "axios";
import moment from "moment";
import React from "react";

const BusDashboardLeftTab = ({
  StartDate,
  endDate,
  sendId,
  isADResident,
  locationId,
  wactchSingleSelect,
}) => {
  const { data: statsData = [], isLoading } = useQuery(
    [
      "statsBusStop",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      wactchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("bus_stop_dashboard/stats_table", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || wactchSingleSelect,
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
  const exportExcel = async () => {
    try {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      const resData = await axios.get("bus_stop_dashboard/export", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || wactchSingleSelect,
        },
      });
      if (resData?.data?.success) {
        window.open(resData?.data?.data, "_blank");
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

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
    [statsData]
  );
  return (
    <div>
      <div className="pl-[1rem] flex space-x-20 items-center ">
        {" "}
        <Button
          variant="contained"
          className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
          onClick={exportExcel}
        >
          Export to Excel
        </Button>
      </div>

      <div className="mt-[5rem] mx-[1px]">
        <EnhancedTable
          columns={columns}
          data={statsData ?? []}
          // hasPagination
          // setPageIndex={setPageIndex}
          // setPageSize={setPageSize}
          // totalPages={busStopData?.total_pages || 0}
          // pageIndex={pageIndex}
          // pageSize={pageSize}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BusDashboardLeftTab;

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EnhancedTable from "app/shared-components/enhancedTable";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import moment from "moment";

const BusDashboardRightTab = ({
  StartDate,
  endDate,
  sendId,
  isADResident,
  locationId,
  wactchSingleSelect,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const { data: statsData = [], isLoading } = useQuery(
    [
      "statsBusStopAnswers",
      pageSize,
      pageIndex,
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
      return axios.get("bus_stop_dashboard/get_answers", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          pageSize: pageSize,
          pageIndex: pageIndex,
          isADResident,
          locationId: locationId || wactchSingleSelect,
        },
      });
    },
    {
      select: (res) => {
        return res?.data;
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
      const resData = await axios.get("/bus_stop_dashboard/export_answer", {
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
        Header: "QUESTION",
        accessor: "question",
      },
      {
        Header: "ANSWER",
        accessor: "answer",
      },
    ],
    [statsData]
  );
  return (
    <div>
      <div className="pl-[1rem] flex flex-row space-x-24 items-center">
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
          data={statsData?.data ?? []}
          hasPagination
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalPages={statsData?.total_pages}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BusDashboardRightTab;

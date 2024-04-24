import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";

const CycleDashboradRight = ({
  endDate,
  StartDate,
  sendId,
  isADResident,
  locationId,
  singleSelect,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();


  const { data: toptenData = [], isLoading } = useQuery(
    [
      "cycle_answers",
      pageSize,
      pageIndex,
      sendId,
      endDate,
      StartDate,
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
      return axios.get("cycle_track_dashboard/get_answers", {
        params: {
          ...newParams,
          pageSize: pageSize,
          pageIndex: pageIndex,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data;
      },
    }
  );

  const { data, refetch } = useQuery(
    ["cycleTrack_excel_data_answers"],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("cycle_track_dashboard/export_answer", {
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
      onSuccess: (res) => {
        if (res?.data?.success) {
          window.open(res?.data?.data, "_blank");
          enqueueSnackbar("Data Successfully Export to Excel", {
            variant: "success",
          });
        }
        history.push;
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
        Header: "QUESTION",
        accessor: "question",
      },
      {
        Header: "ANSWER",
        accessor: "answer",
      },
    ],
    [toptenData]
  );
  return (
    <div>
      <div className="pl-[1rem]">
        {" "}
        <Button
          variant="contained"
          className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
          onClick={() => {
            refetch();
          }}
        >
          Export to Excel
        </Button>
      </div>
      <div className="mt-[5rem] mx-[1px]">
        <EnhancedTable
          columns={columns}
          data={toptenData?.data ?? []}
          hasPagination
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalPages={toptenData?.total_pages || 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CycleDashboradRight;

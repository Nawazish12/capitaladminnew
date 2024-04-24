import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@mui/material";
import EnhancedTable from "app/shared-components/enhancedTable";
import moment from "moment";
import { useSnackbar } from "notistack";

const NeighbourhoodRight = ({
  StartDate,
  endDate,
  sendId,
  isADResident,
  locationId,
  singleSlectVal,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const { data: answersData, isLoading } = useQuery(
    [
      "answers_neighbourhood",
      pageSize,
      pageIndex,
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      singleSlectVal,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("park_dashboard/get_answers", {
        params: {
          ...newParams,
          pageSize: pageSize,
          pageIndex: pageIndex,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSlectVal,
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
    ["neighbourhood_export_anwers"],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("park_dashboard/export_answer", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
        },
      });
    },
    {
      onSuccess: (res) => {
        console.log(res);
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
        Header: "QUESTION",
        accessor: "question",
      },
      {
        Header: "ANSWER",
        accessor: "answer",
      },
    ],
    [answersData]
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
          }}>
          Export to Excel
        </Button>
      </div>
      <div className="mt-[5rem] mx-[1px]">
        <EnhancedTable
          columns={columns}
          data={answersData?.data ?? []}
          hasPagination
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
          totalPages={answersData?.total_pages || 0}
          pageIndex={pageIndex}
          pageSize={pageSize}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NeighbourhoodRight;

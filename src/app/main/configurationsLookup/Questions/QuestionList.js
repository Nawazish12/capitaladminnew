import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import QuestionsDialog from "./QuestionsDialog";
// import BusDialog from "./BusDialog";

const QuestionList = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: questionsData = [], isLoading } = useQuery(
    ["get_questions_data", pageIndex, pageSize],
    () =>
      axios.get("/question", {
        params: {
          page_size: pageSize,
          page_index: pageIndex,
        },
      }),
    {
      select: (res) => res?.data,
    }
  );

  const queryClient = useQueryClient();

  const { mutate: governateDel } = useMutation(
    (id) => axios.delete(`/governorate/${id}`),
    {
      onSuccess: () => {
        enqueueSnackbar("Governorate Deleted Successfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getBusData"]);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const service = [
    {
      name: "None",
      type: 0,
    },
    {
      name: "Neighbourhood ",
      type: 1,
    },
    {
      name: "SportsCourt ",
      type: 2,
    },
    {
      name: "CycleTrack ",
      type: 3,
    },
    {
      name: "BusStop ",
      type: 4,
    },
    {
      name: "CommunityFacility  ",
      type: 5,
    },
  ];

  const handleClose = () => {
    // setType("add");
    // if (type === "edit") {
    //   setdataForEdit("");
    // }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name English",
        accessor: "text", // accessor is the "key" in the data
      },
      {
        Header: "Name Arabic",
        accessor: "textAr",
      },
      {
        Header: "Name Urdu",
        accessor: "textUr",
      },

      {
        Header: "Type",
        accessor: "type",
        Cell: (cell) => {
          const serviceName = service.find((item) => {
            return item?.type == cell?.row?.original?.type;
          });

          return (
            <div>
              <h4>{serviceName?.name}</h4>
            </div>
          );
        },
      },
      {
        Header: "Edit",
        accessor: "edit",
        Cell: ({ row }) => (
          <>
            <AutoFixHighIcon
              onClick={() => {
                setdataForEdit(row?.original);
                handleOpen();
                //   setType("edit");
              }}
            />
          </>
        ),
      },
      //   {
      //     Header: "Delete",
      //     accessor: "delete",
      //     Cell: ({ row }) => (
      //       <>
      //         <DeleteIcon
      //           onClick={() => {
      //             governateDel(row?.original?.id);
      //           }}
      //         />
      //       </>
      //     ),
      //   },
    ],
    [questionsData?.data?.data]
  );
  return (
    <div className="mt-10">
      <div className="flex justify-between px-8 mb-10">
        <div>
          {" "}
          <h1>Questions</h1>
        </div>
        <div>
          {" "}
          {/* <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Bus
          </Button> */}
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={questionsData?.data ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={questionsData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <QuestionsDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          //   type={type}
          dataForEdit={dataForEdit}
        />
      )}
    </div>
  );
};

export default QuestionList;

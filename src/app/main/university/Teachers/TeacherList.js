import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
// import GovernateDialog from "./GovrenateDialog";
// import UniverstiyDialog from "./UniversityDialog";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import History from "@history";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TeacherList = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: universityData = [], isLoading } = useQuery(
    ["getuniversityData", pageIndex, pageSize],
    () =>
      axios.get("/university", {
        params: {
          page_size: pageSize,
          page_index: pageIndex,
        },
      }),
    {
      select: (res) => res?.data?.data,
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
        // setDataDelete("");
        // setOpenDelete(false);
        queryClient.invalidateQueries(["getGovernateData"]);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const handleClose = () => {
    setType("add");
    if (type === "edit") {
      setdataForEdit("");
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name English",
        accessor: "nameEn",
      },
      //   {
      //     Header: "Name Arabic",
      //     accessor: "nameAr",
      //   },
      //   {
      //     Header: "Governorate En",
      //     accessor: "governorateNameEn",
      //   },
      {
        Header: "City",
        accessor: "city",
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
                setType("edit");
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
    []
  );
  return (
    <div className="mt-10">
      <div className="flex justify-between px-8 mb-10">
        <div className="flex items-center">
          <div className="cursor-pointer">
            <ArrowBackIcon
              onClick={() => {
                History.back();
              }}
            />
          </div>
          <div>
            <h1 className="pl-10"> Teacher</h1>
          </div>
        </div>
        <div>
          {" "}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Teacher
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={universityData ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={universityData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {/* {open && (
        <UniverstiyDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          type={type}
          dataForEdit={dataForEdit}
        />
      )} */}
    </div>
  );
};

export default TeacherList;

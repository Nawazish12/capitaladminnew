import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import GovernateDialog from "./GovrenateDialog";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

const GovernateList = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: governorateData = [], isLoading } = useQuery(
    ["getGovernateData", pageIndex, pageSize],
    () =>
      axios.get("/governorate", {
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
        accessor: "nameEn", // accessor is the "key" in the data
      },
      {
        Header: "Name Arabic",
        accessor: "nameAr",
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
      {
        Header: "Delete",
        accessor: "delete",
        Cell: ({ row }) => (
          <>
            <DeleteIcon
              onClick={() => {
                governateDel(row?.original?.id);
              }}
            />
          </>
        ),
      },
    ],
    []
  );
  return (
    <div className="mt-10">
      <div className="flex justify-between px-8 mb-10">
        <div>
          {" "}
          <h1>Governorate</h1>
        </div>
        <div>
          {" "}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Governorate
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={governorateData ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={governorateData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <GovernateDialog
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          type={type}
          dataForEdit={dataForEdit}
        />
      )}
    </div>
  );
};

export default GovernateList;

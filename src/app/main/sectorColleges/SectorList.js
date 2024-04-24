import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
// import SpecializationDialog from "./SpecializationDialog";
import SectorDialog from "./SectorDialog";

const SectorList = ({ idsend }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: detailData = [], isLoading } = useQuery(
    ["getCollegeDetail", idsend],
    () =>
      axios.get(`/college?parent_id=${idsend}`, {
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

  const { mutate: specializationDel } = useMutation(
    (id) => axios.delete(`/college/${id}`),
    {
      onSuccess: () => {
        enqueueSnackbar("College Deleted Successfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getCollegeDetail"]);
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
        Header: "University English",
        accessor: "universityEn",
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
                specializationDel(row?.original?.id);
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
          <h1> Colleges </h1>
        </div>
        <div>
          {" "}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add College
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={detailData ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={detailData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <SectorDialog
          idsend={idsend}
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

export default SectorList;

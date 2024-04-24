import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button, Typography } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import AreaDialog from "./AreaDialog";

const AreaList = ({ locId }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: areaDataGet = [], isLoading } = useQuery(
    ["getAreaDetails", locId, pageSize, pageIndex],
    () =>
      axios.get(`/area?parent_id=${locId}`, {
        params: {
          pageSize: pageSize,
          pageIndex: pageIndex,
        },
      }),
    {
      select: (res) => res?.data,
    }
  );

  const queryClient = useQueryClient();
  const { mutate: areaDel } = useMutation((id) => axios.delete(`/area/${id}`), {
    onSuccess: () => {
      enqueueSnackbar("Area Deleted Successfully", {
        variant: "success",
      });
      queryClient.invalidateQueries(["getAreaDetails"]);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
    },
  });

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
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Name Arabic",
        accessor: "nameAr",
      },
      {
        Header: "Name Urdu",
        accessor: "nameUr",
      },
      {
        Header: "Image",
        accessor: "flag",
        Cell: ({ row }) => (
          <div>
            {row?.original?.flag?.file_path ? (
              <>
                <div className="">
                  <img
                    src={row?.original?.flag?.file_path}
                    alt="img"
                    className="w-[100px] h-[60px] rounded-md"
                  />
                </div>
              </>
            ) : (
              <>
                <Typography>Not Found Image</Typography>
              </>
            )}
          </div>
        ),
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
                areaDel(row?.original?.id);
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
          <h1>Nationality</h1>
        </div>
        <div>
          {" "}
          <Button
            variant="contained"
            className="bg-[#1B2A3F] text-white hover:text-[#1B2A3F]"
            onClick={handleOpen}
          >
            Add Nationality
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={areaDataGet?.data ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={areaDataGet?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <AreaDialog
          locId={locId}
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

export default AreaList;

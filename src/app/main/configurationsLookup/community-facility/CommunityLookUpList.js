import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import CommunityLookUpDialog from "./CommunityLookUpDialog";

const CommunityLookUpList = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const { data: cycleTrackData = [], isLoading } = useQuery(
    ["getcommunity", pageIndex, pageSize],
    () =>
      axios.get("/community_facility", {
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
        enqueueSnackbar(" Deleted Successfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getcycleTrackData"]);
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
      //   {
      //     Header: "Image Name",
      //     accessor: "imageName",
      //   },
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }) => (
          <div>
            <div className="">
              <img
                src={row?.original?.image?.file_path}
                alt="img"
                className="w-[100px] h-[50px] rounded-md"
              />
            </div>
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
    [cycleTrackData]
  );
  return (
    <div className="mt-10">
      <div className="flex justify-between px-8 mb-10">
        <div>
          {" "}
          <h1>Community Facility</h1>
        </div>
        <div>
          {" "}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Community Facility
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={cycleTrackData?.data ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={cycleTrackData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <CommunityLookUpDialog
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

export default CommunityLookUpList;

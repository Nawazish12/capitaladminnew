import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import LocationDialog from "./LocationDialog";
import { toBase64 } from "@fuse/utils/toBase64";

const LocationList = ({ locId }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();
  const [file, setFile] = useState();
  const { enqueueSnackbar } = useSnackbar();

  console.log(file, "file");

  const { data: locationParentData = [], isLoading } = useQuery(
    ["getLocationDetatils", locId, pageSize, pageIndex],
    () =>
      axios.get(`/location?parent_id=${locId}`, {
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
  const { mutate: LocationDel } = useMutation(
    (id) => axios.delete(`/location/${id}`),
    {
      onSuccess: () => {
        enqueueSnackbar("Location Deleted Successfully", {
          variant: "success",
        });
        queryClient.invalidateQueries(["getLocationDetatils"]);
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

  const uploadFile = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const name = file?.name;
    const size = String(file?.size);
    const fileExtension = file?.name.split(".").pop();
    const fileContent = await toBase64(file);
    const fileSend = {
      file_name: name,
      file_path: "",
      file_content: fileContent,
      file_extension: fileExtension,
    };

    try {
      const res = await axios.post("import/location", fileSend);
      if (res?.data?.success) {
        enqueueSnackbar(res?.data?.message, {
          variant: "success",
        });
      }
      console.log(res, "ress");
    } catch (error) {
      enqueueSnackbar(error?.response?.data?.message, {
        variant: "error",
      });
      console.log(error, "errror");
    }
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
                LocationDel(row?.original?.id);
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
          <h1> Location</h1>
        </div>
        <div>
          <Button id="file-excel-select" component="label">
            Import Excel
            <input
              className="hidden"
              type="file"
              name="fileUpload"
              onChange={uploadFile}
            />
          </Button>

          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add Location
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={locationParentData.data ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={locationParentData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading}
      />
      {open && (
        <LocationDialog
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

export default LocationList;

import React, { useState } from "react";
import EnhancedTable from "app/shared-components/enhancedTable";
import { Button } from "@mui/material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import UserDialog from "./UserDialog";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useSelector } from "react-redux";




const UserList = () => {




  const [open, setOpen] = useState(false);
  const [type, setType] = useState("add");
  const { enqueueSnackbar } = useSnackbar();

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [dataDelete, setDataDelete] = useState("");
  const [dataForEdit, setdataForEdit] = useState();

  const {
    data: userData = [],
    isLoading,
    refetch,
  } = useQuery(
    ["user_data_list", pageIndex, pageSize],
    () =>
      axios.get("/user", {
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
    (id) => axios.delete(`/user/delete/${id}`),
    {
      onSuccess: () => {
        enqueueSnackbar(" Deleted Successfully", {
          variant: "success",
        });
        refetch();

        queryClient.invalidateQueries(["user_data_list"]);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  const { mutate: editStatus, isLoading: statusLoading } = useMutation(
    ({ id, status }) => {
      axios.put(`/user/edit_status/${id}?status=${status}`);
    },
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
        }
        refetch();
        queryClient.invalidateQueries(["user_data_list"]);
      },
      onError: (error) => {
        enqueueSnackbar(error?.response?.data?.message, {
          variant: "error",
        });
      },
    }
  );

  console.log(statusLoading,"statusLoading")

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
        Header: "Name ",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Email",
        accessor: "email",
      },
      // {
      //   Header: "Group Name",
      //   accessor: "groupName",
      // },
      {
        Header: "Password",
        accessor: "password",
        Cell: ({ row }) => (
          <div>{row?.original?.password ? <RemoveRedEyeIcon /> : null}</div>
        ),
      },

      {
        Header: "Active",
        accessor: "active",
        Cell: ({ row }) => {
          const id = row?.original?.id;
          const status = !row?.original?.active;
          return (
            <div
              onClick={() => {
                editStatus({
                  id,
                  status,
                });
              }}
            >
              {row?.original?.active ? (
                <TaskAltIcon className="text-green-700" />
              ) : (
                <CancelIcon className="text-red-700" />
              )}
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
    [userData]
  );
  return (
    <div className="mt-10">
      <div className="flex justify-between px-8 mb-10">
        <div>
          {" "}
          <h1>Users</h1>
        </div>
        <div>
          {" "}
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add User
          </Button>
        </div>
      </div>

      <EnhancedTable
        columns={columns}
        data={userData ?? []}
        hasPagination
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        totalPages={userData?.total_pages || 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        isLoading={isLoading || statusLoading}
      />
      {open && (
        <UserDialog
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

export default UserList;

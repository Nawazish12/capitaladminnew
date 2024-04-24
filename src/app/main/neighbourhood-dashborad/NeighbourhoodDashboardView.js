import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Chart from "react-apexcharts";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import { useForm } from "react-hook-form";
import { values } from "lodash";
import { keys, map } from "lodash";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import { Checkbox, Paper, Typography, Box } from "@mui/material";
import _ from "@lodash";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import HookMultiCheckbox from "app/shared-components/HookCustomComponent/HookMultiCheckbox";
import { useSnackbar } from "notistack";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import NeighbourhoodLeft from "./NeighbourhoodLeft";
import NeighbourhoodRight from "./NeighbourhoodRight";
import NeighbourhoodTranscation from "./NeighbourhoodTranscation";
import moment from "moment";
import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";

const NeighbourhoodDashboardView = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ mode: "onSubmit" });

  const [selected, setSelected] = useState([]);
  const [value, setValueNew] = useState("1");
  const StartDate = watch("start");
  const endDate = watch("end");
  const [allData, setAllData] = useState([]);
  const watchMulti = watch("check");
  const sendId = map(watchMulti, "value");
  const singleSlectVal = watch("select_val");
  const isADResident = watch("isADResident");
  const user = useSelector(selectUser);
  const locationId = user?.data?.locationId;

  const { enqueueSnackbar } = useSnackbar();

  const { data: ageWiseData } = useQuery(
    [
      "ageWiseNeighbourhood",
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
      return axios.get("park_dashboard/age_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSlectVal,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );
  const { data: genderWiseData } = useQuery(
    [
      "genderWiseNeighbourhood",
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
      return axios.get("park_dashboard/gender_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          locationId: locationId || singleSlectVal,
          isADResident,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  const { data: areasData = [] } = useQuery(
    ["areaDataNeighbourhood"],
    () => {
      return axios.get("/location");
    },
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data.map((checkVal) => {
          return {
            label: checkVal?.name,
            value: checkVal?.id,
          };
        }),
    }
  );

  const { data: percentageWiseData = [] } = useQuery(
    [
      "neighbourhoodPercentage",
      endDate,
      StartDate,
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
      return axios.get("park_dashboard/percentages", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSlectVal,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      select: (res) => {
        return res?.data?.data;
      },
    }
  );

  useEffect(() => {
    if (locationId) {
      setValue("select_val", locationId);
    }
  }, [locationId]);

  const { data: listData = [] } = useQuery(
    ["childListNeighbourhood", singleSlectVal, locationId],
    () => {
      return axios.get("location/child", {
        params: {
          parents: singleSlectVal ? singleSlectVal : locationId,
        },
      });
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        if (res?.data?.success) {
          const { data } = res?.data;
          const getData = data.map((val) => {
            return {
              label: val.name,
              value: val.id,
            };
          });
          setAllData(getData);
        }
      },
    }
  );

  const handleChange = (event, newValue) => {
    setValueNew(newValue);
  };
  return (
    <div className="mt-10 mb-[5rem]">
      <div>
        {" "}
        <h1 className="pl-[2rem]">Neighbourhood Dashboard</h1>
      </div>
      <div className="pl-[2rem] my-[3rem]">
        <div className="flex space-x-8">
          <div className="w-[20rem]">
            <HookDateTextfield
              control={control}
              errors={errors}
              name="start"
              label="Start Date"
            />
          </div>
          <div className="w-[20rem]">
            <HookDateTextfield
              control={control}
              errors={errors}
              name="end"
              label="End Date"
            />
          </div>
          <div className="w-[25rem]">
            <HookSelect
              label="Abudhabi Resident"
              name="isADResident"
              control={control}
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
          </div>
          <div className="w-[20rem]">
            <HookSelect
              control={control}
              errors={errors}
              name="select_val"
              label="Select"
              disabled={locationId}
              options={areasData}
            />
          </div>
          <div className="">
            <HookMultiCheckbox
              name="check"
              control={control}
              option={allData}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full space-x-[1rem] px-[2rem] my-[4rem]">
        <div className="w-1/2 ">
          <Paper>
            <h1 className="pl-[2rem] pt-[1rem]">Age Wise</h1>
            <Chart
              type="pie"
              width={600}
              height={400}
              series={values(ageWiseData)}
              options={{
                labels: keys(ageWiseData),
              }}
            ></Chart>
          </Paper>
        </div>
        <div className="w-1/2">
          <Paper>
            <h1 className="pl-[2rem] pt-[1rem]"> Gender Wise</h1>
            <Chart
              type="pie"
              width={600}
              height={400}
              series={map(genderWiseData, "total")}
              options={{
                labels: map(genderWiseData, "gender"),
              }}
            ></Chart>
          </Paper>
        </div>
      </div>
      <Box className="!mx-[20px]">
        <Paper className=" w-full">
          <Typography className="pt-[10px] pl-[10px] text-[20px]">
            Statistical information
          </Typography>
          <div className="my-[7rem] py-[4rem]  flex flex-wrap items-center justify-center">
            {percentageWiseData.map((val, index) => (
              <div key={index} className="w-1/5 py-[1rem]">
                <Box className="flex flex-col items-center justify-center ">
                  <div style={{ width: 150, height: 150, fontSize: "12px" }}>
                    <CircularProgressbar
                      value={Math.round(val?.percentage)}
                      text={`${Math.round(val?.percentage)}%`}
                      styles={buildStyles({
                        textSize: "16px",
                      })}
                    />
                  </div>
                  <div>
                    <Typography className="pt-[1rem]">{val?.name}</Typography>
                  </div>
                </Box>
              </div>
            ))}
          </div>
        </Paper>
      </Box>

      {/* tabs */}
      <div>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                {/* <Tab label="Transactions" value="1" /> */}

                <Tab label="Statistics" value="1" />
                <Tab label="Answers" value="2" />
              </TabList>
            </Box>
            {/* <TabPanel value="1">
              <NeighbourhoodTranscation />
            </TabPanel> */}
            <TabPanel value="1">
              <NeighbourhoodLeft
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                locationId={locationId}
                singleSlectVal={singleSlectVal}
                isADResident={isADResident}
              />
            </TabPanel>
            <TabPanel value="2">
              <NeighbourhoodRight
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                isADResident={isADResident}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default NeighbourhoodDashboardView;

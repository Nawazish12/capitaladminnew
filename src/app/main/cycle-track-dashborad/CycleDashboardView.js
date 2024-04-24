import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";
import Chart from "react-apexcharts";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import { useForm } from "react-hook-form";
import { values } from "lodash";
import { keys, map } from "lodash";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import _ from "@lodash";
import { Paper, Typography, Box } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import HookMultiCheckbox from "app/shared-components/HookCustomComponent/HookMultiCheckbox";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import CycleDashboradLeftTab from "./CycleDashboradLeftTab";
import CycleDashboradRight from "./CycleDashboradRight";
import moment from "moment";
import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";

const CycleDashboardView = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const [allData, setAllData] = useState([]);
  const [value, setValue] = useState("1");

  const StartDate = watch("start");
  const endDate = watch("end");
  const watchMulti = watch("check");
  const sendId = map(watchMulti, "value");
  const singleSelect = watch("select_val");
  const isADResident = watch("isADResident");
  const user = useSelector(selectUser);
  const locationId = user?.data?.locationId;

  const { data: ageWiseData } = useQuery(
    [
      "cycleTrackAgeWiseGet",
      { StartDate, endDate, sendId, isADResident, locationId, singleSelect },
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }

      return axios.get("cycle_track_dashboard/age_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
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
      "genderWiseCycleTrack",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      singleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }

      return axios.get("cycle_track_dashboard/gender_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
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
    ["areaDataCycle"],
    () => {
      return axios.get("/location");
    },
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data.map((checkVal) => {
          return {
            value: checkVal?.id,
            label: checkVal?.name,
          };
        }),
    }
  );

  const { data: percentageWiseData = [] } = useQuery(
    [
      "cyclePercentage",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      singleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("cycle_track_dashboard/percentages", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || singleSelect,
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
    setValue("select_val", locationId);
  }, [locationId]);

  const { data: listData = [] } = useQuery(
    ["childListCylce", singleSelect, locationId],
    () => {
      return axios.get("location/child", {
        params: {
          parents: singleSelect ? singleSelect : locationId,
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
    setValue(newValue);
  };
  return (
    <div className="mt-10 mb-[5rem] ">
      <div className=" pl-[3rem] mb-7">
        {" "}
        <h1>Cycle Track Dashboard</h1>
      </div>
      <div className="pl-[3rem] my-[2rem]">
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

      <div className="flex justify-between space-x-[1rem] px-[2rem] w-full my-[4rem]">
        <div className="w-1/2">
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
              <CycleDashboardTransaction />
            </TabPanel> */}
            <TabPanel value="1">
              <CycleDashboradLeftTab
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                isADResident={isADResident}
                locationId={locationId}
                singleSelect={singleSelect}
              />
            </TabPanel>
            <TabPanel value="2">
              <CycleDashboradRight
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                isADResident={isADResident}
                locationId={locationId}
                singleSelect={singleSelect}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default CycleDashboardView;

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Paper, Tab, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import HookMultiCheckbox from "app/shared-components/HookCustomComponent/HookMultiCheckbox";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import { selectUser } from "app/store/userSlice";
import axios from "axios";
import { keys, map, values } from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import BusDashboardLeftTab from "./BusDashboardLeftTab";
import BusDashboardRightTab from "./BusDashboardRightTab";

const BusStopDashboradView = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const { enqueueSnackbar } = useSnackbar();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [value, setValueNew] = useState("1");
  const StartDate = watch("start");
  const endDate = watch("end");
  const [allData, setAllData] = useState([]);
  const user = useSelector(selectUser);
  const locationId = user?.data?.locationId;

  const watchMulti = watch("check");
  const sendId = map(watchMulti, "value");
  const wactchSingleSelect = watch("select_val");
  const isADResident = watch("isADResident");

  const { data: ageWiseData } = useQuery(
    [
      "busStopAgeWiseGet",
      StartDate,
      endDate,
      sendId,
      isADResident,
      wactchSingleSelect,
      locationId,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("bus_stop_dashboard/age_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || wactchSingleSelect,
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
      "genderWiseBusStop",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      wactchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("bus_stop_dashboard/gender_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || wactchSingleSelect,
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
    ["areaDataaBus"],
    () => {
      return axios.get("/location");
    },
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data.map((checkVal) => {
          return {
            value: checkVal?.id,
            label: checkVal.name,
          };
        }),
    }
  );

  const { data: percentageWiseData = [] } = useQuery(
    [
      "busPercentage",
      endDate,
      StartDate,
      sendId,
      isADResident,
      locationId,
      wactchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("bus_stop_dashboard/percentages", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || wactchSingleSelect,
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

  const { data: listData = [] } = useQuery(
    ["childListBusStop", wactchSingleSelect, locationId],
    () => {
      return axios.get("location/child", {
        params: {
          parents: wactchSingleSelect ? wactchSingleSelect : locationId,
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

  useEffect(() => {
    setValue("select_val", locationId);
  }, [locationId]);

  const handleChange = (event, newValue) => {
    setValueNew(newValue);
  };

  return (
    <div className="mt-10 mb-[5rem]">
      <div>
        <h1 className="pl-[2rem]">Bus Stop Dashboard</h1>
      </div>
      <div className="">
        <div className="flex space-x-8 my-[4rem] items-center pl-[2rem]">
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
                // noData: { text: "No Data Found" },
              }}
            />
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
                // noData: { text: "No Data Found" },
              }}
            ></Chart>
          </Paper>
        </div>
      </div>
      {/* progress bar */}
      <Box className="!mx-[20px]">
        <Paper className=" w-full">
          <Typography className="pt-[10px] pl-[10px] text-[20px]">
            Statistical information
          </Typography>
          <div className="my-[7rem] py-[4rem]  flex flex-wrap items-center justify-center">
            {percentageWiseData?.map((val, index) => (
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

      {/* tabs  */}
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

            <TabPanel value="1">
              <BusDashboardLeftTab
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                locationId={locationId}
                wactchSingleSelect={wactchSingleSelect}
                isADResident={isADResident}
              />
            </TabPanel>
            <TabPanel value="2">
              <BusDashboardRightTab
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                locationId={locationId}
                wactchSingleSelect={wactchSingleSelect}
                isADResident={isADResident}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default BusStopDashboradView;

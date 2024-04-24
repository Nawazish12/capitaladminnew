import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Chart from "react-apexcharts";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import { useForm } from "react-hook-form";
import { values } from "lodash";
import { keys, map } from "lodash";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import _ from "@lodash";
import { Checkbox, Paper, Typography, Box } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import HookMultiCheckbox from "app/shared-components/HookCustomComponent/HookMultiCheckbox";
import { useSnackbar } from "notistack";
import SportsLeftTab from "./SportsLeftTab";
import SportsRightTab from "./SportsRightTab";
import { TabList, TabContext, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import SportTransaction from "./SportTransaction";
import moment from "moment";
import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";

const SportsClubDashboardView = () => {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({ mode: "onSubmit" });

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [allData, setAllData] = useState([]);
  const [value, setValueNew] = useState("1");

  const StartDate = watch("start");
  const endDate = watch("end");
  const watchMulti = watch("check");
  const sendId = map(watchMulti, "value");
  const watchSingleSelect = watch("select_val");
  const isADResident = watch("isADResident");

  const user = useSelector(selectUser);
  const locationId = user?.data?.locationId;

  const { enqueueSnackbar } = useSnackbar();

  const { data: ageWiseData } = useQuery(
    [
      "ageWiseSportsCourt",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      watchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("sport_court_dashboard/age_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || watchSingleSelect,
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
      "genderWiseSportsCourt",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      watchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("sport_court_dashboard/gender_wise", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || watchSingleSelect,
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
    ["areaDataSportsClub"],
    () => {
      return axios.get("/location");
    },
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data?.map((checkVal) => {
          return {
            value: checkVal?.id,
            label: checkVal?.name,
          };
        }),
    }
  );

  const { data: percentageWiseData = [] } = useQuery(
    [
      "sportsPercentage",
      StartDate,
      endDate,
      sendId,
      isADResident,
      locationId,
      watchSingleSelect,
    ],
    () => {
      const newParams = {};
      if (!!StartDate) {
        newParams["start"] = moment(StartDate).format("L");
      }
      if (!!endDate) {
        newParams["end"] = moment(endDate).format("L");
      }
      return axios.get("sport_court_dashboard/percentages", {
        params: {
          ...newParams,
          areas: sendId.toString(),
          isADResident,
          locationId: locationId || watchSingleSelect,
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
    ["childsportListGet", watchSingleSelect, locationId],
    () => {
      return axios.get("location/child", {
        params: {
          parents: watchSingleSelect ? watchSingleSelect : locationId,
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
      <div className="pl-[3rem]">
        {" "}
        <h1>Sports Court Dashboard</h1>
      </div>
      <div className="my-[3rem] ml-[3rem]">
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
              options={areasData}
              name="select_val"
              label="Select"
              disabled={locationId}
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
      {/* <div className="flex flex-wrap items-center justify-end w-full"> */}
      {/* {areasData?.map((val) => (
          <div key={val.id} className="flex items-center mr-5">
            <Checkbox
              // checked={_.includes(selected, val.id)}
              onChange={() => {
                if (_.includes(selected, val.id)) {
                  const valSett = _.reject(selected, (r) => r === val.id);
                  setSelected(valSett);
                } else {
                  setSelected([...selected, val.id]);
                }
              }}
            />
            <Typography variant="subtitle2" className="ml-2">
              {val.name}
            </Typography>
          </div>
        ))} */}
      {/* <div className="flex items-center">
          <Checkbox
            checked={selected?.length > 0}
            // onChange={() => {
            //   if (selected?.length > 0) {
            //     setSelected([]);
            //   }
            // }}
          />
          <Typography variant="subtitle2" className="ml-2">
            All
          </Typography>
        </div> */}
      {/* </div> */}

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

      {/* tabss */}
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
              <SportTransaction />
            </TabPanel> */}
            <TabPanel value="1">
              <SportsLeftTab
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                isADResident={isADResident}
                locationId={locationId}
                watchSingleSelect={watchSingleSelect}
              />
            </TabPanel>
            <TabPanel value="2">
              <SportsRightTab
                StartDate={StartDate}
                endDate={endDate}
                sendId={sendId}
                isADResident={isADResident}
                locationId={locationId}
                watchSingleSelect={watchSingleSelect}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default SportsClubDashboardView;

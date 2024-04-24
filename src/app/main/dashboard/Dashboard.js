/* eslint-disable react-hooks/exhaustive-deps */
import _ from "@lodash";
import { Paper } from "@mui/material";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import axios from "axios";
import styled from "@emotion/styled";
import DashboardHeader from "./DashboardHeader";
import StatBox from "./widgets/StatBox";
import { useQuery } from "@tanstack/react-query";
import Chart from "react-apexcharts";
import { map } from "lodash";
import { values } from "lodash";
import { keys, isEmpty } from "lodash";
import { Checkbox, Typography, Box } from "@mui/material";
import HookDateTextfield from "app/shared-components/HookCustomComponent/HookDateTextfield";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import HookMultiCheckbox from "app/shared-components/HookCustomComponent/HookMultiCheckbox";
import HookSelect from "app/shared-components/HookCustomComponent/HookSelect";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-content": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 100%",
    height: "100%",
  },
}));

const container = {
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function DashboardApp() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const [allData, setAllData] = useState([]);

  const user = useSelector(selectUser);
  const locationId = user?.data?.locationId;

  const StartDate = watch("start");
  const isADResident = watch("isADResident");
  const endDate = watch("end");
  const watchMulti = watch("check");
  const sendId = map(watchMulti, "value");
  const watchSingleSelect = watch("select_val");

  // console.log(watchSingleSelect);

  const { data: sumbitData } = useQuery(
    [
      "total_submitted_data",
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
      return axios.get("dashboard/total_submitted", {
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

  const { data: agePieChart } = useQuery(
    [
      "age_data",
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
      return axios.get("dashboard/age_wise", {
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

  const { data: genderbarChart } = useQuery(
    [
      "bar_chart_gender",
      StartDate,
      endDate,
      sendId,
      isADResident,
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
      return axios.get("dashboard/survey_gender_wise", {
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
    ["areaDataMainDahboard"],
    () => {
      return axios.get("/location");
    },
    {
      refetchOnWindowFocus: false,
      select: (res) =>
        res?.data?.data.map((res) => {
          return {
            value: res?.id,
            label: res?.name,
          };
        }),
    }
  );

  useEffect(() => {
    // const list=
    if (locationId) {
      setValue("select_val", locationId);
    }
  }, [locationId]);

  const { data: listData = [] } = useQuery(
    ["childList", watchSingleSelect, locationId],
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

  return (
    <Root
      header={<DashboardHeader />}
      content={
        <>
          <motion.div
            className="flex flex-col w-full p-24 md:p-32"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className=" my-[4rem]">
              <div> {/* <h1>Cycle Track Dashboard</h1> */}</div>
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
                    name="select_val"
                    control={control}
                    options={areasData}
                    // readOnly={locationId}
                    disabled={locationId}
                  />
                </div>
                <div className="w-[20rem]">
                  <HookMultiCheckbox
                    name="check"
                    control={control}
                    option={allData}
                  />
                </div>
              </div>
            </div>

            <div className="mt-16 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 w-full">
              <motion.div variants={item} className="">
                <StatBox
                  label="Bus Stop"
                  amount={sumbitData?.busStopTotal || 0}
                />
              </motion.div>
              <motion.div variants={item} className="">
                <StatBox
                  label="Cycle Track"
                  amount={sumbitData?.cycleTrackTotal || 0}
                />
              </motion.div>
              <motion.div variants={item} className="">
                <StatBox
                  label="Neighbourhood Park"
                  amount={sumbitData?.neighbourhoodTotal || 0}
                />
              </motion.div>
              <motion.div variants={item} className="">
                <StatBox
                  label="Sports Court"
                  amount={sumbitData?.sportCourtTotal || 0}
                />
              </motion.div>
              <motion.div variants={item} className="">
                <StatBox
                  label="Community Facilities"
                  amount={sumbitData?.communityTotal || 0}
                />
              </motion.div>
              <motion.div variants={item} className="">
                <StatBox
                  label="People of determination"
                  amount={sumbitData?.podCount || 0}
                />
              </motion.div>
            </div>
            {/* for pie charts */}
            <div className="w-full mt-[3rem] flex justify-between space-x-10">
              <div className="w-1/2">
                <Paper>
                  <h1 className="pl-[3rem] pt-[1rem]">Gender</h1>
                  <div className="mt-24">
                    <Chart
                      type="bar"
                      width={550}
                      height={400}
                      series={genderbarChart?.series || []}
                      options={{
                        labels: genderbarChart?.labels,
                      }}
                    ></Chart>
                  </div>
                </Paper>
              </div>
              <div className="w-1/2">
                <Paper>
                  <h1 className="pl-[3rem] pt-[1rem]">Ages</h1>
                  <div className="mt-24">
                    <Chart
                      type="pie"
                      width={600}
                      height={400}
                      series={values(agePieChart)}
                      options={{
                        labels: keys(agePieChart),
                      }}
                    ></Chart>
                  </div>
                </Paper>
              </div>
            </div>
            {/* chart for months */}
            {/* <div className="mt-[10em] w-full">
              <div className="">
                <Chart
                  type="area"
                  width="100%"
                  height={400}
                  series={[
                    {
                      name: "month",
                      data: map(monthChart, "total"),
                    },
                  ]}
                  options={{
                    title: {
                      text: "Months",
                    },
                    stroke: { width: 1, curve: "smooth" },
                    xaxis: {
                      title: "",
                      categories: map(monthChart, "month"),
                    },
                  }}
                ></Chart>
              </div>
            </div> */}
          </motion.div>
        </>
      }
    />
  );
}

export default DashboardApp;

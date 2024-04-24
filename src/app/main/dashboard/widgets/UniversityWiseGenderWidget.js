/* eslint-disable no-plusplus */
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { isEmpty, map, range } from "lodash";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function getDarkColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}

function UniversityWiseGenderWidget(props) {
  const { widgetData, name } = props;
  const theme = useTheme();
  const [awaitRender, setAwaitRender] = useState(true);

  console.log("widgetData =>", widgetData);

  const chartOptions = {
    chart: {
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "bar",
      stacked: true,
      stackType: "normal",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#1b76b7", "#DD3DA0"],
    labels: widgetData?.universityEn,
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        horizontal: false,
        borderRadius: 0,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.75,
        },
      },
    },
    tooltip: {
      followCursor: true,
      theme: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      categories: widgetData?.universityEn,
      axisTicks: {
        color: theme.palette.divider,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: -16,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender || isEmpty(widgetData)) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {name ? name : "University Wise Gender"}
        </Typography>
      </div>
      <div className="w-full mt-32 sm:mt-16">
        <div className="flex flex-col flex-auto">
          <div className="flex flex-col flex-auto">
            <ReactApexChart
              className="flex-auto w-full"
              options={chartOptions}
              series={widgetData.series.map((val) => {
                return {
                  name: val.gender,
                  data: val.count,
                };
              })}
              type={chartOptions.chart.type}
              height={400}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default memo(UniversityWiseGenderWidget);

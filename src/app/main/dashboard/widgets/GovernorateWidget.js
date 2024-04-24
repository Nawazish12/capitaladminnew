/* eslint-disable no-plusplus */
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { map } from "lodash";
import GovernateWiseUniversityDialog from "./GovernateWiseUniversityDialog";

const ranges = [
  {
    from: -6,
    to: 0,
    color: "#231929",
  },
  {
    from: 0.001,
    to: 5,
    color: "#114A8A",
  },
  {
    from: 5.001,
    to: 10,
    color: "#077640",
  },
  {
    from: 10.001,
    to: 15,
    color: "#751576",
  },
  {
    from: 15.001,
    to: 20,
    color: "#1b76b7",
  },
];

function GovernorateWidget(props) {
  const { widgetData } = props;
  const [awaitRender, setAwaitRender] = useState(true);
  const [open, setOpen] = useState(false);
  const [dataSend, setdataSend] = useState();

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const theme = useTheme();

  const chartOptions = {
    chart: {
      events: {
        click: function (event, chartContext, config) {
          handleOpen();
          setdataSend(
            config.config.series[config.seriesIndex]?.data[
              config?.dataPointIndex
            ]
          );
        },
      },
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "treemap",
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: true,
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        colorScale: {
          ranges,
        },
      },
    },
  };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          Governorate Wise Universities
        </Typography>
      </div>

      <div className="flex flex-col flex-auto mt-24 h-288">
        <ReactApexChart
          onClick={handleOpen}
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={[
            {
              data: map(widgetData, (val) => {
                return {
                  x: val.governoratesEn,
                  y: val.universitiesCount,
                };
              }),
            },
          ]}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
      {open && (
        <GovernateWiseUniversityDialog
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          widgetData={widgetData}
          dataSend={dataSend}
        />
      )}
    </Paper>
  );
}

export default memo(GovernorateWidget);

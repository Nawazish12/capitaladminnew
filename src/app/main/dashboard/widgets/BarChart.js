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

function BarChart(props) {
  const { widgetData, label, seriesLabel, labelKey, dataKey } = props;
  const theme = useTheme();
  const [awaitRender, setAwaitRender] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!isEmpty(widgetData)) {
      const newData = map(widgetData, (val) => {
        return {
          label: val[labelKey],
          count: val[dataKey],
        };
      });

      setData(newData);
    } else {
      setData([]);
    }
  }, [dataKey, labelKey, widgetData]);

  const chartOptions = {
    chart: {
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "bar",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: map(range(100), () => getDarkColor()),
    labels: map(data, "label"),
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: "70%",
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
      categories: map(data, "label"),
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

  if (awaitRender || !data.length) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {label ?? ""}
        </Typography>
      </div>
      <div className="w-full mt-32 sm:mt-16">
        <div className="flex flex-col flex-auto">
          <div className="flex flex-col flex-auto">
            <ReactApexChart
              className="flex-auto w-full"
              options={chartOptions}
              series={[
                {
                  name: seriesLabel,
                  data: map(data, "count"),
                },
              ]}
              type={chartOptions.chart.type}
              height={320}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default memo(BarChart);

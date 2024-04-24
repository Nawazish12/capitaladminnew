import BusStopDashboradView from "./BusStopDashboradView";

const BusStopDashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      exact: true,
      path: "bus-stop-dashboard",
      element: <BusStopDashboradView />,
    },
  ],
};

export default BusStopDashboardConfig;

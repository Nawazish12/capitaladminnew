import Dashboard from "./Dashboard";

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;

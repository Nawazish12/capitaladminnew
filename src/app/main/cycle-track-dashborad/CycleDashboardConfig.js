import CycleDashboardView from "./CycleDashboardView";

const CycleDashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "cycle-track-dashboard",
      element: <CycleDashboardView />,
    },
  ],
};

export default CycleDashboardConfig;

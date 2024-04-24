import NeighbourhoodDashboardView from "./NeighbourhoodDashboardView";

const NeighbourhoodDashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "neighbourhood-dashboard",
      element: <NeighbourhoodDashboardView />,
    },
  ],
};

export default NeighbourhoodDashboardConfig;

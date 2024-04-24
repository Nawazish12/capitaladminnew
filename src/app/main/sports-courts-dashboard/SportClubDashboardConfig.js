import SportsClubDashboardView from "./SportsClubDashboardView";
const SportClubDashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "sports-courts-dashboard",
      element: <SportsClubDashboardView />,
    },
  ],
};

export default SportClubDashboardConfig;

import CycletrackList from "./CycletrackList";

const CycletrackConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/configurations/cycle-track",
      element: <CycletrackList />,
    },
  ],
};

export default CycletrackConfig;

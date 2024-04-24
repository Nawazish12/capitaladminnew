import BusList from "./BusList";

const BusConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "configurations/bus-stop",
      element: <BusList />,
    },
  ],
};

export default BusConfig;

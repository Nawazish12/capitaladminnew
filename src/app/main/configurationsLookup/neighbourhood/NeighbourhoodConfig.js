import NeighbourhoodList from "./NeighbourhoodList";

const NeighbourhoodConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "configurations/neighbourhood",
      element: <NeighbourhoodList />,
    },
  ],
};

export default NeighbourhoodConfig;

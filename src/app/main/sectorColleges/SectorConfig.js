// import SpecializationApp from "./SpecializationApp";
import SectorApp from "./SectorApp";
const SectorConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "sector-colleges",
      element: <SectorApp />,
    },
  ],
};

export default SectorConfig;

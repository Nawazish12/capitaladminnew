import LocationApp from "./LocationApp";

const LocationConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "configurations/locations",
      element: <LocationApp />,
    },
  ],
};

export default LocationConfig;

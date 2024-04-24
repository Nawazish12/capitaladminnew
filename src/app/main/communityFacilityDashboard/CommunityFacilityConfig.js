import CommunityFacilityView from "./CommunityFacilityView";

const CommunityFacilityConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "community-facility-dashboard",
      element: <CommunityFacilityView />,
    },
  ],
};

export default CommunityFacilityConfig;

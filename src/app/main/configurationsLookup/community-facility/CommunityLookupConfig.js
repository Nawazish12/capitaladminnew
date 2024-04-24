import CommunityLookUpList from "./CommunityLookUpList";

const CommunityLookupConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/configurations/community-facility",
      element: <CommunityLookUpList />,
    },
  ],
};

export default CommunityLookupConfig;

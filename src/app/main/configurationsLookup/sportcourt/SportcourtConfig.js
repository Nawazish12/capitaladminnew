import SportList from "./SportList";

const SportcourtConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "configurations/sports-court",
      element: <SportList />,
    },
  ],
};

export default SportcourtConfig;

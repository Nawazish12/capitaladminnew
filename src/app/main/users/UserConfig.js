import UserList from "./UserList";

const UserConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "users",
      element: <UserList />,
    },
  ],
};

export default UserConfig;

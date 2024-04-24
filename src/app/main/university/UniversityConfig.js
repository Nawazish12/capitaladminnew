// import GovernateList from "./GovernateList";
import UniversityList from "./UniversityList";
import TeacherList from "./Teachers/TeacherList";

const UniversityConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "university",
      element: <UniversityList />,
    },
    {
      path: "university/teacher/:id",
      element: <TeacherList />,
    },
  ],
};

export default UniversityConfig;

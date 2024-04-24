import QuestionList from "./QuestionList";

const QuestionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "configurations/questions",
      element: <QuestionList />,
    },
  ],
};

export default QuestionConfig;

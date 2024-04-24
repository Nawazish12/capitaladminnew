import TransactionView from "./TransactionView";

const TransactionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "transactions",
      element: <TransactionView />,
    },
  ],
};

export default TransactionConfig;

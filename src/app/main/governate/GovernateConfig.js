import GovernateList from "./GovernateList";

const GovernateConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "governate",
      element: <GovernateList />,
    },
  ],
};

export default GovernateConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const Example = lazy(() => import('./Example'));

const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'example',
      element: <Example />,
    },
  ],
};

export default ExampleConfig;
*/

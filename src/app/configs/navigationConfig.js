export const everyUserConfig = [
  {
    id: "dashboard-component",
    title: "Dashboard",
    type: "item",
    icon: "heroicons-outline:chart-bar",
    url: "dashboard",
  }
]

export const reportsConfig = [
  {
    id: "dashboard-component",
    title: "Dashboard",
    type: "item",
    icon: "heroicons-outline:chart-bar",
    url: "dashboard",
  },
  {
    id: "transactions-component",
    title: "Transactions",
    type: "item",
    icon: "heroicons-outline:chart-bar",
    url: "transactions",
  },

  {
    id: "bus-component",
    title: "Bus Stop",
    type: "item",
    icon: "material-outline:directions_bus",
    url: "bus-stop-dashboard",
  },
  {
    id: "cycletrack-component",
    title: "Cycle Track",
    type: "item",
    icon: "material-outline:directions_bike",
    url: "cycle-track-dashboard",
  },
  {
    id: "neighbourhood-component",
    title: "Neighbourhood Park",
    type: "item",
    icon: "material-outline:account_balance",
    url: "neighbourhood-dashboard",
  },
  {
    id: "community-facility-component",
    title: "Community Facilities",
    type: "item",
    icon: "material-outline:cabin",
    url: "community-facility-dashboard",
  },

  {
    id: "sportcourts-component",
    title: "Sport Courts",
    type: "item",
    icon: "material-outline:sports_esports",
    url: "sports-courts-dashboard",
  }
]

export const configurationConfig = [
  {
    id: "dashboard-component",
    title: "Dashboard",
    type: "item",
    icon: "heroicons-outline:chart-bar",
    url: "dashboard",
  },
  {
    id: "configurations",
    title: "Configurations",
    type: "collapse",
    icon: "material-outline:timeline",
    // url: "configurations",
    children: [
      {
        id: "users-component",
        title: "Users",
        type: "item",
        icon: "heroicons-solid:user-group",
        url: "users",
      },
      {
        id: "configurations.locations",
        title: "Locations",
        type: "item",
        icon: "material-outline:location_on",
        url: "configurations/locations",
      },
      {
        id: "configurations.Nationality",
        title: "Nationality",
        type: "item",
        icon: "material-outline:area_chart",
        url: "configurations/area",
      },
      {
        id: "configurations.busstop",
        title: "Bus Stop",
        type: "item",
        icon: "material-outline:directions_bus_filled",
        url: "configurations/bus-stop",
      },
      {
        id: "configurations.neighbourhood",
        title: "Neighbourhood",
        type: "item",
        icon: "material-outline:account_balance",
        url: "configurations/neighbourhood",
      },
      {
        id: "configurations.cycle-track",
        title: "Cycle Track",
        type: "item",
        icon: "material-outline:directions_bike",
        url: "/configurations/cycle-track",
      },
      {
        id: "configurations.sports-court",
        title: "Sports Court",
        type: "item",
        icon: "material-outline:sports_esports",
        url: "/configurations/sports-court",
      },
      {
        id: "configurations.community-facility",
        title: "Community Facility",
        type: "item",
        icon: "material-outline:sports_esports",
        url: "/configurations/community-facility",
      },
      {
        id: "configurations.questions",
        title: "Questions",
        type: "item",
        icon: "material-outline:sports_esports",
        url: "/configurations/questions",
      },
    ],
  }
];

const navigationConfig = [
  ...everyUserConfig,
  ...reportsConfig,
  ...configurationConfig,
]

export default navigationConfig;
import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import DashboardConfig from "../main/dashboard/DashboardConfig";
import UserConfig from "../main/users/UserConfig";
import ConfigurationConfig from "../main/configurationsLookup/ConfigurationConfig";
import BusStopDashboardConfig from "../main/bus-stop-dashborad/BusStopDashboardConfig";
import CycleDashboardConfig from "../main/cycle-track-dashborad/CycleDashboardConfig";
import NeighbourhoodDashboardConfig from "../main/neighbourhood-dashborad/NeighbourhoodDashboardConfig";
import SportClubDashboardConfig from "../main/sports-courts-dashboard/SportClubDashboardConfig";
import CommunityFacilityConfig from "../main/communityFacilityDashboard/CommunityFacilityConfig";
import TransactionConfig from "../main/transactionLookup/TransactionConfig";
const routeConfigs = [
  DashboardConfig,
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  CommunityFacilityConfig,
  BusStopDashboardConfig,
  CycleDashboardConfig,
  // UserConfig,
  NeighbourhoodDashboardConfig,
  SportClubDashboardConfig,
  TransactionConfig,
  ...ConfigurationConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
    auth: settingsConfig.defaultAuth,
  },
  // {
  //   path: "/",
  //   element: <Navigate to="/dashboard" />,
  //   auth: settingsConfig.defaultAuth,
  // },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;

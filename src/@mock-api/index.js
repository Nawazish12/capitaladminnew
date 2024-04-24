import "./api/auth-api";
import "./api/notifications-api";
import history from "@history";
import mock from "./mock";

mock.onAny().passThrough();

if (module?.hot?.status() === "apply") {
  const { pathname } = history.location;
  history.push("/reports/loading");
  history.push({ pathname: `/reports/${pathname}` });
}

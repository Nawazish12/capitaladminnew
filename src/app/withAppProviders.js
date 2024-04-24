// import createGenerateClassName from '@mui/styles/createGenerateClassName';
// import jssPreset from '@mui/styles/jssPreset';
// import { create } from 'jss';
// import jssExtend from 'jss-plugin-extend';
// import rtl from 'jss-rtl';
import Provider from "react-redux/es/components/Provider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import routes from "app/configs/routesConfig";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import store from "./store";
import AppContext from "./AppContext";

const queryClient = new QueryClient();
const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          routes,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Provider store={store}>
            <StyledEngineProvider injectFirst>
              <Component {...props} />
            </StyledEngineProvider>
          </Provider>
        </LocalizationProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );

  return WrapperComponent;
};

export default withAppProviders;

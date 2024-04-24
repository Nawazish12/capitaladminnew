import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function DashboardHeader(props) {
  return (
    <>
      {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Settings
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>
            }
          >
            Export
          </Button>
        </div> */}

      <div className="flex justify-between items-center px-32">
        <div className="flex flex-col">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            Analytics dashboard
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Monitor metrics, check reports and review performance
          </Typography>
        </div>
        <div>
          <div className="w-[200px] h-76 mt-[40px] ">
            {" "}
            <img
              className="logo-icon rounded-md"
              src="reports/assets/images/logo/site-logo.png"
              alt="logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;

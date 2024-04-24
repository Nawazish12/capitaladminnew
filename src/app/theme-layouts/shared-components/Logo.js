import { styled } from "@mui/material/styles";

// const Root = styled("div")(({ theme }) => ({
//   "& > .logo-icon": {
//     transition: theme.transitions.create(["width", "height"], {
//       duration: theme.transitions.duration.shortest,
//       easing: theme.transitions.easing.easeInOut,
//     }),
//   },
//   "& > .badge": {
//     transition: theme.transitions.create("opacity", {
//       duration: theme.transitions.duration.shortest,
//       easing: theme.transitions.easing.easeInOut,
//     }),
//   },
// }));

function Logo() {
  return (
    <div className="flex items-center">
      <div className="w-[200px] h-76 mt-[40px] rounded-md">
        {" "}
        <img
          className="logo-icon rounded-md"
          src="reports/assets/images/logo/site-logo.png"
          alt="logo"
        />
      </div>
    </div>
  );
}

export default Logo;

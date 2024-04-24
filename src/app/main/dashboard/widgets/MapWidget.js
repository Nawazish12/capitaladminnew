import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Tooltip } from "@mui/material";
import GoogleMap from "google-map-react";

function Marker({ text }) {
  return (
    <Tooltip title={text} placement="top">
      <FuseSvgIcon className="text-red">
        heroicons-outline:location-marker
      </FuseSvgIcon>
    </Tooltip>
  );
}

const MapWidget = ({ widgetData }) => {
  return (
    <div className="w-full">
      <div className="w-full h-512">
        <GoogleMap
          bootstrapURLKeys={{
            key: process.env.REACT_APP_MAP_KEY,
          }}
          defaultZoom={6}
          defaultCenter={[31.976515, 74.222015]}
        >
          {widgetData.map((val, idx) => (
            <Marker
              key={idx}
              text={`${val.universityEn}(${val.staffCount})`}
              lat={val.latitude}
              lng={val.longitude}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapWidget;

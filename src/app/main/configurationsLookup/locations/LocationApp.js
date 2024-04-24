import React from "react";
import { useQuery } from "@tanstack/react-query";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import axios from "axios";
import LocationList from "./LocationList";

const LocationApp = () => {
  const [locId, setLocId] = useState("");
  const { data: locationsData = [] } = useQuery(
    ["locationData"],
    () => axios.get("/location"),
    {
      select: (res) => res?.data?.data,
    }
  );

  return (
    <>
      <div className="flex w-full">
        <div className="w-[400px] mt-10">
          {locationsData.map((singleVal, i) => {
            return (
              <div key={i} className="flex justify-between px-12 items-center ">
                <div className="pt-10 pl-4">{singleVal.name}</div>
                <div
                  onClick={() => {
                    setLocId(singleVal?.id);
                  }}
                >
                  {" "}
                  <ArrowForwardIosIcon
                    style={{ fontSize: "15px", cursor: "pointer" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full">
          <LocationList locId={locId} />
        </div>
      </div>
    </>
  );
};

export default LocationApp;

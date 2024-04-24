import React from "react";
// import SpecializationList from "./SpecializationList";
import { useQuery } from "@tanstack/react-query";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import axios from "axios";
import SectorList from "./SectorList";

const SectorApp = () => {
  //   const [pageSize, setPageSize] = useState(10);
  //   const [pageIndex, setPageIndex] = useState(0);
  const [idsend, setIdsend] = useState("");
  const { data: sectorData = [] } = useQuery(
    ["getsectorData"],
    () => axios.get("/sector"),
    {
      select: (res) => res?.data?.data,
    }
  );

  return (
    <>
      <div className="flex w-full">
        <div className="w-[400px] mt-10">
          {sectorData?.map((singleVal, i) => {
            return (
              <div key={i} className="flex justify-between px-12 items-center ">
                <div className="pt-10 pl-4">{singleVal.nameEn}</div>
                <div
                  className=" cursor-pointer"
                  onClick={() => {
                    setIdsend(singleVal?.id);
                  }}
                >
                  {" "}
                  <ArrowForwardIosIcon style={{ fontSize: "15px" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full">
          <SectorList idsend={idsend} />
        </div>
      </div>
    </>
  );
};

export default SectorApp;

import { Typography } from "antd";
import React from "react";

export const MainFooter: React.FC<{}> = ({}): React.ReactElement => {
  return (
    <>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography style={{ color: "grey" }}>{`D-Namecard-Lawyers | version 1.0.1`}</Typography>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography style={{ color: "grey" }}>{`Copyright ©2023 OSD`}</Typography>
      </div>
    </>
  );
};

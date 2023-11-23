import { Typography } from "antd";
import React from "react";

export const MainFooter: React.FC<{}> = ({}): React.ReactElement => {
  return (
    <div
      style={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography style={{ color: "grey" }}>E-Namecard | version 1.0.1 </Typography>
    </div>
  );
};

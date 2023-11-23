import React from "react";
import { Layout } from "antd";
import { MainHeader } from "./MainHeader";
import { Outlet } from "react-router-dom";
import { useId24 } from "../../drivers/id24/Id24Provider";
import { MainFooter } from "./MainFooter";

const { Content, Footer } = Layout;
export const MainLayout: React.FC = () => {
  const auth = useId24();
  const groupRoules: string[] = [];
  if (auth) {
    auth.tokenAccess?.userAccess.map((groupId) => {
      groupId.roles.forEach(function (value, i) {
        groupRoules.push(value);
      });
    });
  }
  return (
    <>
      <Layout>
        <MainHeader />
        <Content
          style={{
            marginTop: "109px",
            paddingBottom: 24,
            border: "none",
            minHeight: "45rem",
          }}
        >
          <Outlet />
        </Content>
        <Footer>
          <MainFooter />
        </Footer>
      </Layout>
    </>
  );
};

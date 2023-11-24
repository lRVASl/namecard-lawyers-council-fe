import React from "react";
import { Layout } from "antd";
import { MainHeader } from "./MainHeader";
import { Outlet } from "react-router-dom";
import { useId24 } from "../../drivers/id24/Id24Provider";
import { MainFooter } from "./MainFooter";
import { Header } from "antd/lib/layout/layout";

const { Content, Footer, Sider } = Layout;
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
      <Layout hasSider>
        <Sider
          trigger={null}
          collapsible
          style={{
            backgroundColor: "white",
            overflowX: "hidden",
            overflowY: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <MainHeader />
        </Sider>
        <Layout className="site-layout" style={{ paddingLeft: 200 }}>
          <Header
            className="header"
            style={{
              backgroundColor: "white",
              padding: 2,
              textAlign: "left",
              minHeight: "80px",
              height: "auto",
            }}
          ></Header>
          <Content
            className="site-layout-background"
            style={{
              padding: "24px",
              margin: "0px 16px",
              minHeight: "80vh",
              overflow: "initial",
            }}
          >
            <Outlet />
          </Content>
          <Footer>
            <MainFooter />
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

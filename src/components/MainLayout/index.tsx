import React, { useState } from "react";
import { Button, Layout, Menu, Result } from "antd";
import { MainMenu } from "./MainManu";
import { Outlet } from "react-router-dom";
import { useId24 } from "../../drivers/id24/Id24Provider";
import { MainFooter } from "./MainFooter";
import { Header } from "antd/lib/layout/layout";

const { Content, Footer, Sider } = Layout;
export const MainLayout: React.FC = () => {
  const { authenticated, login, logout, id24Axios } = useId24();
  const challengeKey = "challenge";
  const challenge = localStorage.getItem(challengeKey);
  const auth = useId24();
  const groupRoules: string[] = [];
  if (auth) {
    auth.tokenAccess?.userAccess.map((groupId) => {
      groupId.roles.forEach(function (value, i) {
        groupRoules.push(value);
      });
    });
  }

  return !authenticated || !challenge ? (
    <>{login(window.location.href, false)}</>
  ) : (
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
          <MainMenu />
        </Sider>
        <Layout className="site-layout" style={{ paddingLeft: 200 }}>
          <Header
            className="header"
            style={{
              backgroundColor: "white",
              padding: 2,
              textAlign: "right",
              minHeight: "80px",
              height: "auto",
              paddingRight: "20px",
            }}
          >
            <Button onClick={() => logout().then(() => login(window.location.href, false))}> {`Logout`}</Button>
          </Header>
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

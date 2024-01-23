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
  if (!authenticated || !challenge) {
    // login(window.location.href, false);
    return (
      <>
        <Result
          status="403"
          title="403"
          subTitle="ท่านยังไม่มีสิทธิ์ในการเข้าถึงระบบ กรุณาตรวจสอบสิทธิ์ในการเข้าถึงกับผู้ดูแลระบบ."
          extra={
            <Button type="primary" onClick={() => login(window.location.href, false)}>
              Click to Login
            </Button>
          }
        />
      </>
    );
  } else {
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
              textAlign: "center",
            }}
          >
            <MainMenu />
            <Button
              type="primary"
              style={{ width: "190px", border: "none", position: "fixed", bottom: "10px", marginLeft: "-96px" }}
              onClick={() => logout().then(() => login(window.location.href, false))}
              danger
            >
              {`ออกจากระบบ`}
            </Button>
          </Sider>
          <Layout className="site-layout" style={{ paddingLeft: 200 }}>
            <Header
              className="header"
              style={{
                backgroundColor: "white",
                padding: 2,
                textAlign: "right",
                // minHeight: "30px",
                height: "auto",
                paddingRight: "20px",
              }}
            ></Header>
            <Content
              className="site-layout-background"
              style={{
                padding: "24px",
                margin: "0px 16px",
                minHeight: "86vh",
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
  }
};

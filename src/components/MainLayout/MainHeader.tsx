import { Col, Layout, Menu, Row } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { intersection } from "lodash";
import { menuItems, MenuItem } from "../../configs/menus";
import { Logo } from "./Logo";
import { useId24 } from "../../drivers/id24/Id24Provider";

export const MainHeader: React.FC<{}> = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const auth = useId24();

  const groupRoules: string[] = [];
  if (auth) {
    auth.tokenAccess?.userAccess.map((groupId) => {
      groupId.roles.forEach(function (value, i) {
        groupRoules.push(value);
      });
    });
  }
  const uniqueNames = groupRoules.filter((val: any, id: any, array: any) => {
    return array.indexOf(val) == id;
  });
  const items = useMemo(() => {
    const rolePredicate = (x: MenuItem) => (x.roles ? intersection(uniqueNames, x.roles).length : true);

    const itemMapper = (x: MenuItem): MenuItem & { onClick: () => void } => {
      return {
        ...x,
        onClick: () => {
          if (x.children) {
            return;
          }
          navigate(x.path);
        },
        ...(x.children?.length && {
          children: x.children.filter(rolePredicate).map((c: any) =>
            itemMapper({
              ...c,
              path: `${x.path}/${c.path}`,
            }),
          ),
        }),
      };
    };
    return menuItems.filter(rolePredicate).map(itemMapper);
  }, [uniqueNames]);

  const ks = pathname.slice(1).split("/");
  return (
    <>
      <Layout.Header
        style={{
          padding: 5,
          background: "white",
          height: "auto",
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          border: "none",
        }}
      >
        <Row
          style={{
            justifyContent: "left",
            display: "flex",
            padding: "0 30px 0 30px",
          }}
        >
          <Col span={2}>
            <Logo />
          </Col>
          <Col span={18}>
            <Menu
              selectedKeys={ks.slice(-1)}
              defaultOpenKeys={ks.length > 1 ? ks.slice(0, 1) : []}
              items={items}
              mode="horizontal"
              style={{
                background: "white",
                border: "none",
                color: "black",
                alignItems: "center",
                display: "flex",
                justifyContent: "left",
                fontSize: "18px",
                marginTop: "18px",
              }}
            />
          </Col>
          <Col
            span={4}
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "right",
            }}
          ></Col>
        </Row>
      </Layout.Header>
    </>
  );
};

import { Col, Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { intersection } from "lodash";
import { menuItems, MenuItem } from "../../configs/menus";
import { useAuth } from "../../utils/auth";
import { Logo } from "./Logo";
import styles from "./MainLayout.module.scss";
import { useId24 } from "../../drivers/id24/Id24Provider";

export const MainMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tokenAccess, login, logout, id24Axios } = useId24();
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
    const rolePredicate = (x: MenuItem) =>
      x.roles ? intersection(uniqueNames, x.roles).length : true;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueNames]);

  const ks = pathname.slice(1).split("/");

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          paddingTop: "10px",
          paddingBottom: "10px",
          width: "auto",
        }}
      >
        <Logo />
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={ks.slice(-1)}
        defaultOpenKeys={ks.length > 1 ? ks.slice(0, 1) : []}
        items={items}
        inlineIndent={6}
        style={{
          height: "100%",
          borderRight: 0,
        }}
      />
    </>
  );
};

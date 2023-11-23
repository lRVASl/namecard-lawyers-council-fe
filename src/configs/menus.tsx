import { pipe, replace, toLower } from "lodash/fp";
import { Roules } from "../utils/auth";
import { Route } from "react-router-dom";
import { MaingenerateQrcode } from "../pages/QRcodepage/maingenerateQrcode";
type MenuConfig = {
  key: string;
  icon?: JSX.Element;
  label: string;
  component: JSX.Element;
  roles?: Roules[];
  path?: string;
  children?: MenuConfig[];
};

const menuConfigs: MenuConfig[] = [
  {
    key: "1",
    label: "QR-CODE",
    path: "qrcode",
    component: (
      <>
        <Route index element={<MaingenerateQrcode />} />
      </>
    ),
  },
];

export type MenuItem = MenuConfig & {
  path: string;
  key: string;
  children?: MenuItem[];
};

const menuItemMapper = (x: any): MenuItem => {
  const path = pipe(toLower, replace(" ", "-"))(x.path || x.label);
  return {
    ...x,
    key: path,
    path,
    ...(x.children?.length && {
      children: x.children.map(menuItemMapper),
    }),
  };
};

export const menuItems = menuConfigs.map(menuItemMapper);
const [firstMenu] = menuItems;
export const defaultPath = `${firstMenu.path}${
  firstMenu.children ? `/${firstMenu.children[0].path}` : ""
}`;

import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { menuItems } from "./configs/menus";
import { NameCard } from "./pages/E-Namecard/nameCard";
const App = () => {
  // const id24Config = {
  //   refreshTokenIntervalInSeconds: 60,
  //   resourceApiBaseUrl: "http://localhost:4000",
  // };
  return (
    <>
      <BrowserRouter basename="/namecard">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to={menuItems[0].path} replace />} />
            {menuItems.map((x) => (
              <Route key={x.key} path={x.path} element={<Outlet />}>
                {x.component}
              </Route>
            ))}
          </Route>
          <Route path="/idcard" element={<NameCard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

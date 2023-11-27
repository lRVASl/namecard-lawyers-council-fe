import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { menuItems } from "./configs/menus";
import { NameCard } from "./pages/e_namecard/nameCard";
import { MainLogin } from "./pages/login/MainLogin";
const App = () => {
  // const id24Config = {
  //   refreshTokenIntervalInSeconds: 60,
  //   resourceApiBaseUrl: "http://localhost:4000",
  // };
  return (
    <>
      <BrowserRouter basename="/">
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
          <Route path="/login" element={<MainLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

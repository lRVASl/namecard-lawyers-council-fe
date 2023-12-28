import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { menuItems } from "./configs/menus";
import { NameCard } from "./pages/e_namecard/nameCard";
import { AuthProvider } from "./utils/auth";
import { Id24Provider } from "./drivers/id24/Id24Provider";

const App = () => {
  const id24Config = {
    refreshTokenIntervalInSeconds: 60,
    resourceApiBaseUrl: `${process.env.REACT_APP_API_BASE_URL}`,
  };
  return (
    <>
      <BrowserRouter basename="/">
        <Id24Provider config={id24Config}>
          <AuthProvider>
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
          </AuthProvider>
        </Id24Provider>
      </BrowserRouter>
    </>
  );
};

export default App;

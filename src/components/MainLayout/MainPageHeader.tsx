import { PageHeader } from 'antd';
import { useLocation } from 'react-router-dom';
import styles from './MainLayout.module.scss';
import { MenuItem, menuItems } from '../../configs/menus';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';

const getBreadcrumbRoutes = (
  paths: string[],
  currMenuItems?: MenuItem[],
  routes: Route[] = [],
): Route[] => {
  if (!paths.length || !currMenuItems) {
    return routes;
  }
  const [path, ...restPaths] = paths;
  const restMenuItems = currMenuItems.find(m => m.path === path);
  return getBreadcrumbRoutes(restPaths, restMenuItems?.children, [
    ...routes,
    { path, breadcrumbName: restMenuItems?.label || '' },
  ]);
};

export const MainPageHeader = () => {
  const { pathname } = useLocation();
  const paths = pathname.slice(1).split('/');

  return (
    <PageHeader
      className={styles.siteLayoutBackground}
      breadcrumb={{ routes: getBreadcrumbRoutes(paths, menuItems) }}
    />
  );
};

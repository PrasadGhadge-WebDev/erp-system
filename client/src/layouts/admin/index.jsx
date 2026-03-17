import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    const path = location.pathname;
    let activeRouteName = "Dashboard";
    
    // Find exact match or closest parent match
    let bestMatch = null;
    let maxPathLength = -1;

    // We iterate through all routes to find the most specific match
    for (let i = 0; i < routes.length; i++) {
      if (!routes[i].layout || !routes[i].path) continue;
      
      const routePath = (routes[i].layout + "/" + routes[i].path).replace(/\/+/g, '/');
      const normalizedCurrent = path.replace(/\/+/g, '/');
      
      if (normalizedCurrent === routePath || normalizedCurrent.startsWith(routePath + "/")) {
        if (routePath.length > maxPathLength) {
          maxPathLength = routePath.length;
          bestMatch = routes[i];
        }
      }
    }
    
    if (bestMatch) {
      activeRouteName = bestMatch.name;
    }
    
    setCurrentRoute(activeRouteName);
    return activeRouteName;
  };

  const getActiveNavbar = (routes) => {
    const path = location.pathname;
    for (let i = 0; i < routes.length; i++) {
        if (!routes[i].layout || !routes[i].path) continue;
        const routePath = (routes[i].layout + "/" + routes[i].path).replace(/\/+/g, '/');
        if (path === routePath || path.startsWith(routePath + "/")) {
            return routes[i].secondary;
        }
    }
    return false;
  };

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full min-w-0 bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-[12px] h-full min-w-0 flex-none transition-all md:pr-2 ${
            open ? "xl:ml-[313px]" : "xl:ml-0"
          }`}
        >
          <div className="h-full min-w-0">
            <Navbar
              onToggleSidenav={() => setOpen((prev) => !prev)}
              isSidenavOpen={open}
              logoText={"ERP SYSTEM"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            {/* The key on div ensures a fresh re-render of the outlet container on route change */}
            <div key={location.pathname} className="pt-5 mx-auto mb-auto h-full min-h-[84vh] min-w-0 p-2 md:pr-2">
              <Outlet />
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

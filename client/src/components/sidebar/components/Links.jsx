/* eslint-disable */
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();
  const [openGroups, setOpenGroups] = React.useState({});

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    const path = location.pathname;
    // Extract the part after /admin/ or /rtl/
    const relativePath = path.replace(/^\/(admin|rtl)\//, "");
    
    if (routeName === relativePath) return true;
    if (relativePath.startsWith(routeName + "/")) return true;
    
    return false;
  };
  const getGroupOpenState = (groupName, fallbackOpen) => {
    const current = openGroups[groupName];
    return current === undefined ? fallbackOpen : current;
  };

  const toggleGroup = (groupName, fallbackOpen) => {
    setOpenGroups((prev) => {
      const current = prev[groupName];
      const isOpen = current === undefined ? fallbackOpen : current;
      return { ...prev, [groupName]: !isOpen };
    });
  };
  const openGroup = (groupName) => {
    setOpenGroups((prev) => ({ ...prev, [groupName]: true }));
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.hideInSidebar) {
        return null;
      }
      if (route.layout === "/admin" || route.layout === "/rtl") {
        const hasChildren = route.children && route.children.length > 0;
        const isGroupOpen = getGroupOpenState(
          route.name,
          activeRoute(route.path)
        );
        return (
          <div key={index} className="mb-3">
            <div className="flex items-center">
              <Link
                className="flex-1"
                to={route.layout + "/" + route.path}
                onClick={() => {
                  if (!hasChildren) return;
                  openGroup(route.name);
                }}
              >
                <div className="relative flex hover:cursor-pointer">
                  <li
                    className="my-[3px] flex cursor-pointer items-center px-8"
                    key={index}
                  >
                    <span
                      className={`${
                        activeRoute(route.path) === true
                          ? "font-bold text-brand-500 dark:text-white"
                          : "font-medium text-gray-700 dark:text-white/70"
                      }`}
                    >
                      {route.icon ? route.icon : <DashIcon />}{" "}
                    </span>
                    <p
                      className={`leading-1 ml-4 flex ${
                        activeRoute(route.path) === true
                          ? "font-bold text-navy-700 dark:text-white"
                          : "font-medium text-gray-800 dark:text-white/70"
                      }`}
                    >
                      {route.name}
                    </p>
                  </li>
                  {activeRoute(route.path) ? (
                    <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                  ) : null}
                </div>
              </Link>
              {hasChildren ? (
                <button
                  type="button"
                  className="mr-4 text-2xl text-gray-600 transition-transform dark:text-white/70"
                  aria-expanded={isGroupOpen}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleGroup(route.name, activeRoute(route.path));
                  }}
                >
                  <span
                    className={`inline-block transition-transform ${
                      isGroupOpen ? "rotate-180" : ""
                    }`}
                  >
                    <HiChevronDown className="h-7 w-7" />
                  </span>
                </button>
              ) : null}
            </div>
            {hasChildren && isGroupOpen ? (
              <ul className="mt-2 flex flex-col gap-2 pl-14 text-base">
                {route.children.map((child) => (
                  <li key={child.name}>
                    <Link
                      to={`${route.layout}/${child.path}`}
                      className={`block ${
                        activeRoute(child.path)
                          ? "font-semibold text-navy-700 dark:text-white"
                          : "text-gray-700 dark:text-white/70"
                      }`}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }
      return null;
    });
  };
  // BRAND
  return createLinks(routes);
}

export default SidebarLinks;

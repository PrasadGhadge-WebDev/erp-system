import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import routes from "routes.js";

const App = () => {
  const adminRoutes = routes
    .filter((route) => route.layout && route.layout.replace(/\/$/, "") === "/admin")
    .map((route, index) => (
      <Route key={`admin-${index}`} path={route.path} element={route.component} />
    ));

  const authRoutes = routes
    .filter((route) => route.layout === "/auth")
    .map((route, index) => (
      <Route key={`auth-${index}`} path={route.path} element={route.component} />
    ));

  const rtlRoutes = routes
    .filter((route) => route.layout === "/rtl")
    .map((route, index) => (
      <Route key={`rtl-${index}`} path={route.path} element={route.component} />
    ));

  return (
    <Routes>
      <Route path="auth" element={<AuthLayout />}>
        {authRoutes}
        <Route index element={<Navigate to="sign-in" replace />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        {adminRoutes}
        <Route index element={<Navigate to="default" replace />} />
      </Route>
      <Route path="rtl" element={<RtlLayout />}>
        {rtlRoutes}
        <Route index element={<Navigate to="rtl" replace />} />
      </Route>
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;

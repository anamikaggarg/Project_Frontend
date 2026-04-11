import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isauthenticated } = useSelector((state) => state.User);

  return isauthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
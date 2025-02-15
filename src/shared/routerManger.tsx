import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRoutes = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
};
export const UnProtectedRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? <Navigate to="/home" /> : <Outlet />;
};

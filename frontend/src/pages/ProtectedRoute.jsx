import { Navigate } from "react-router-dom";
import  userStore  from "../store/index";

export const ProtectedRoute = ({ children }) => {
  const user = userStore((state)  => state.user);
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  return children;
};

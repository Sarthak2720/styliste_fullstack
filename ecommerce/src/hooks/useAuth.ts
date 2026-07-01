import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// Typed Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

// Custom auth hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isCustomer,
    dispatch,
  };
};

export default useAuth;

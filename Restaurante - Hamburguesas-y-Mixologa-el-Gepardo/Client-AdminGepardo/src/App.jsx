import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./app/routes/AppRoutes";
import { useAuthStore } from "./features/auth/store/authStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontWeight: "600",
            fontSize: "1rem",
            borderRadius: "8px",
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
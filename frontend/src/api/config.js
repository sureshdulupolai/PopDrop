/**
 * Dynamic API URL resolver for PopDrop.
 * Automatically switches between local development server and live Render backend.
 */
export const getBackendURL = () => {
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || 
     window.location.hostname === "127.0.0.1")
  ) {
    return "http://localhost:8000";
  }
  return "https://popdrop-backend-ruzu.onrender.com";
};

export const BASE_URL = getBackendURL();

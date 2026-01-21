import { useContext, useEffect } from "react";
import { AppContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import axiosConfig from "../util/axiosConfig";

export const useUser = () => {
  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user || !token) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosConfig.get(API_ENDPOINTS.GET_USER_INFO);
        if (isMounted && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        // silently ignore 403 during logout
        if (error.response?.status !== 403) {
          console.log("Failed to fetch the user information", error);
        }
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, setUser, clearUser, navigate]);
};

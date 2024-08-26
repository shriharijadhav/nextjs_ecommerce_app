import { useSessionTimeout } from "../context/SessionTimeoutContext";
import axios from "axios";

export const useSessionTimeoutModal = (endpoint, method, data = null, headers = {}) => {
  const { openModal } = useSessionTimeout();

  const fetchData = async () => {
    try {
      const response = await axios({
        method,
        url: endpoint,
        data,
        headers,
      });

      if (response.data.redirectUserToLogin && response.data.isRefreshTokenExpired) {
        openModal(); // Open the modal
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  return fetchData;
};
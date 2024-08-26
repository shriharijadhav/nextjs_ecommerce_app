// hooks/useSessionTimeoutModal.js
import { useSessionTimeout } from "../context/SessionTimeoutContext";
import axios from "axios";

export const useSessionTimeoutModal = (endpoint, method, headers = {}) => {
  const { openModal } = useSessionTimeout();

  const fetchData = async (data = null) => {
    // console.log(data)
    // console.log(headers)
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

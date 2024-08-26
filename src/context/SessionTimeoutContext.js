// context/SessionTimeoutContext.js
"use client"
import { createContext, useContext, useState, useCallback } from "react";

const SessionTimeoutContext = createContext();

export const SessionTimeoutProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <SessionTimeoutContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </SessionTimeoutContext.Provider>
  );
};

export const useSessionTimeout = () => useContext(SessionTimeoutContext);

"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  // What the thank-you shows, from the last successful form submission:
  // { name, visit: { slot, booked } | null }. Non-null while it's open.
  const [thanks, setThanks] = useState(null);

  const toggleModal = () => {
    setMenuActive(false);
    setShowModal((prev) => !prev);
  };

  // Closes the request modal (if that's where the form was sent from) and
  // opens the thank-you modal in its place.
  const openThanks = (details) => {
    setShowModal(false);
    setThanks(details);
  };

  const closeThanks = () => setThanks(null);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        toggleModal,
        menuActive,
        setMenuActive,
        thanks,
        openThanks,
        closeThanks,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
